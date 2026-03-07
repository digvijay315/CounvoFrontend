import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  AlertCircle,
  Loader,
  Volume2,
  Speaker,
  Headphones,
  Smartphone,
  ChevronUp,
  VolumeX,
} from "lucide-react";
import "../../css/call_screen.css";
import { APP_CONFIG } from "../../_constants/config";

const CallScreen = React.forwardRef(
  (
    {
      callType = "video",
      callerId,
      userId,
      userFullName = "",
      callerInfo,
      callStatus = "ringing",
      onCallEnded,
    },
    agoraClientRef,
  ) => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState([]);
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [permissionError, setPermissionError] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceLevel, setVoiceLevel] = useState(0);
    const [audioOutputDevices, setAudioOutputDevices] = useState([]);
    const [selectedAudioOutput, setSelectedAudioOutput] = useState("");
    const [showAudioMenu, setShowAudioMenu] = useState(false);
    const [isAudioOutputMuted, setIsAudioOutputMuted] = useState(false);

    const APP_ID = APP_CONFIG.AGORA_APP_ID;
    const BACKEND_URL = APP_CONFIG.API_URL;

    // Refs for Agora client and tracks
    const clientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);

    // Identify device type from label
    const identifyDeviceType = (label) => {
      const lowerLabel = label.toLowerCase();

      // Check for earpiece/phone speaker
      if (
        lowerLabel.includes("earpiece") ||
        lowerLabel.includes("receiver") ||
        lowerLabel.includes("phone speaker")
      ) {
        return {
          type: "Earpiece",
          icon: Smartphone,
        };
      }

      // Check for headphones/earphones/headset
      if (
        lowerLabel.includes("headphone") ||
        lowerLabel.includes("headset") ||
        lowerLabel.includes("earphone") ||
        lowerLabel.includes("airpods") ||
        lowerLabel.includes("buds") ||
        lowerLabel.includes("bluetooth") ||
        lowerLabel.includes("wireless")
      ) {
        return {
          type: "Earphones",
          icon: Headphones,
        };
      }

      // Default to speaker for anything else
      return {
        type: "Speaker",
        icon: Speaker,
      };
    };

    // Enumerate audio output devices
    const getAudioOutputDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        setAudioOutputDevices(audioOutputs);

        // Set default device if none selected
        if (audioOutputs.length > 0 && !selectedAudioOutput) {
          setSelectedAudioOutput(audioOutputs[0].deviceId);
        }

        return audioOutputs;
      } catch (error) {
        console.error("Error enumerating audio devices:", error);
        return [];
      }
    };

    // Change audio output device
    const changeAudioOutput = async (deviceId) => {
      try {
        setSelectedAudioOutput(deviceId);

        // Apply to all remote users' audio tracks
        remoteUsers.forEach((user) => {
          if (user.audioTrack) {
            // Set playback device for remote audio track
            user.audioTrack.setPlaybackDevice(deviceId).catch((err) => {
              console.error("Error setting playback device:", err);
            });
          }
        });

        console.log("Audio output changed to device:", deviceId);
      } catch (error) {
        console.error("Error changing audio output:", error);
      }
    };

    // Fetch Agora token from backend
    const fetchToken = async (channel) => {
      try {
        const response = await fetch(`${BACKEND_URL}api/calling/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelName: channel,
            uid: 0,
            role: "publisher",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        return data.token;
      } catch (error) {
        console.error("Error fetching token:", error);
        alert(
          "Failed to get token. Make sure the backend is running on port 3000."
        );
        return null;
      }
    };

    // Initialize Agora client
    const initializeAgoraClient = () => {
      if (!clientRef.current) {
        clientRef.current = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

        // Event handlers
        clientRef.current.on("user-published", handleUserPublished);
        clientRef.current.on("user-unpublished", handleUserUnpublished);
        clientRef.current.on("user-left", handleUserLeft);

        // Enable volume indicator to detect speaking
        clientRef.current.enableAudioVolumeIndicator();
        clientRef.current.on("volume-indicator", (volumes) => {
          volumes.forEach((volume) => {
            // volume.level ranges from 0 to 100
            // Check if it's the local user speaking
            if (volume.uid === clientRef.current.uid || volume.uid === 0) {
              const level = volume.level;
              // If volume is above threshold, user is speaking
              const speaking = level > 5;
              setIsSpeaking(speaking);
              // Update voice level for intensity (0-100)
              setVoiceLevel(speaking ? level : 0);
            }
          });
        });
      }
    };

    // Handle remote user published
    const handleUserPublished = async (user, mediaType) => {
      await clientRef.current.subscribe(user, mediaType);


      if (mediaType === "video") {
        setRemoteUsers((prevUsers) => {
          const existingUser = prevUsers.find((u) => u.uid === user.uid);
          if (existingUser) {
            return prevUsers.map((u) =>
              u.uid === user.uid ? { ...u, videoTrack: user.videoTrack } : u
            );
          }
          return [
            ...prevUsers,
            {
              uid: user.uid,
              videoTrack: user.videoTrack,
              audioTrack: user.audioTrack,
            },
          ];
        });

        // Play video track
        const remoteVideoContainer = document.getElementById(
          `remote-video-${user.uid}`
        );
        if (remoteVideoContainer) {
          user.videoTrack.play(remoteVideoContainer);
        }
      }

      if (mediaType === "audio") {
        setRemoteUsers((prevUsers) => {
          const existingUser = prevUsers.find((u) => u.uid === user.uid);
          if (existingUser) {
            return prevUsers.map((u) =>
              u.uid === user.uid ? { ...u, audioTrack: user.audioTrack } : u
            );
          }
          return [
            ...prevUsers,
            { uid: user.uid, videoTrack: null, audioTrack: user.audioTrack },
          ];
        });

        // Play audio track
        user.audioTrack.play();

        // Apply selected audio output device if available
        if (selectedAudioOutput) {
          user.audioTrack
            .setPlaybackDevice(selectedAudioOutput)
            .catch((err) => {
              console.error("Error setting playback device for new user:", err);
            });
        }

        // Apply current mute state
        if (isAudioOutputMuted) {
          user.audioTrack.setVolume(0);
        }
      }
    };

    // Handle remote user unpublished
    const handleUserUnpublished = (user, mediaType) => {

      if (mediaType === "video") {
        setRemoteUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.uid === user.uid ? { ...u, videoTrack: null } : u
          )
        );
      }
    };

    // Handle remote user left
    const handleUserLeft = (user) => {

      setRemoteUsers((prevUsers) =>
        prevUsers.filter((u) => u.uid !== user.uid)
      );
    };

    // Request and check permissions
    const requestPermissions = async (needsVideo) => {
      try {
        setPermissionError("");

        // Request microphone permission (always needed)
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Request camera permission if video call
        if (needsVideo) {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          // Stop the streams immediately - we just needed permission
          videoStream.getTracks().forEach((track) => track.stop());
        }

        // Stop the audio stream
        audioStream.getTracks().forEach((track) => track.stop());

        setPermissionsGranted(true);
        return true;
      } catch (error) {
        console.error("Permission denied:", error);
        let errorMessage = "Permission denied. Please allow access to ";

        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage += needsVideo ? "camera and microphone" : "microphone";
          errorMessage += " in your browser settings.";
        } else if (error.name === "NotFoundError") {
          errorMessage = needsVideo
            ? "Camera or microphone not found on this device."
            : "Microphone not found on this device.";
        } else {
          errorMessage = "Failed to access media devices. " + error.message;
        }

        setPermissionError(errorMessage);
        alert(errorMessage);
        return false;
      }
    };

    // Create local tracks (after permissions are granted)
    const createLocalTracks = async (isVideo) => {
      try {
        // Create audio track (always needed)
        localAudioTrackRef.current =
          await AgoraRTC.createMicrophoneAudioTrack();

        // Create video track only for video calls
        if (isVideo) {
          localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
        }

        return true;
      } catch (error) {
        console.error("Error creating local tracks:", error);
        alert(
          "Failed to access camera/microphone. Please check permissions and try again."
        );
        return false;
      }
    };

    // Join channel and start call
    const handleStartCall = async () => {
      if (!callerId || !userId) {
        console.error("Missing required props: userId or callerId");
        return;
      }

      setIsLoading(true);

      try {
        // Step 1: Request permissions FIRST
        console.log("Requesting permissions...");
        const permissionsOk = await requestPermissions(callType === "video");

        if (!permissionsOk) {
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch token
        const channel = [userId, callerId].sort().join("-");
        const newToken = await fetchToken(channel);

        if (!newToken) {
          setIsLoading(false);
          return;
        }

        setChannelName(channel);
        setToken(newToken);

        // Step 3: Initialize client
        initializeAgoraClient();

        // Step 4: Create local tracks (permissions already granted)
        const tracksCreated = await createLocalTracks(callType === "video");

        if (!tracksCreated) {
          setIsLoading(false);
          return;
        }

        // Step 5: Join the channel
        await clientRef.current.join(APP_ID, channel, newToken, null);
        console.log("Successfully joined channel:", channel);

        // Step 6: Publish local tracks
        const tracksToPublish = [localAudioTrackRef.current];
        if (callType === "video" && localVideoTrackRef.current) {
          tracksToPublish.push(localVideoTrackRef.current);
        }

        await clientRef.current.publish(tracksToPublish);
        console.log("Successfully published tracks");

        // Step 7: Play local video if video call
        if (callType === "video" && localVideoTrackRef.current) {
          setTimeout(() => {
            const localContainer = document.getElementById("local-video");
            if (localContainer) {
              localVideoTrackRef.current.play(localContainer);
            }
          }, 100);
        }

        // Step 8: Initialize control states based on actual track states
        if (localAudioTrackRef.current) {
          setIsMuted(!localAudioTrackRef.current.enabled);
        }
        if (callType === "video" && localVideoTrackRef.current) {
          setIsVideoOff(!localVideoTrackRef.current.enabled);
        }

        setInCall(true);
      } catch (error) {
        console.error("Error starting call:", error);
        alert("Failed to start call. Please check permissions and try again.");
        await cleanupTracks();
      } finally {
        setIsLoading(false);
      }
    };

    // Cleanup tracks
    const cleanupTracks = async () => {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      // Reset voice level
      setIsSpeaking(false);
      setVoiceLevel(0);
    };

    // Handle ending a call (works in both ringing/connecting and in-call)
    const handleEndCall = async () => {
      try {
        if (inCall) {
          // Leave channel and cleanup only if we actually joined
          if (clientRef.current) {
            await clientRef.current.leave();
          }
          await cleanupTracks();
          setInCall(false);
          setChannelName("");
          setToken(null);
          setRemoteUsers([]);
          setIsMuted(false);
          setIsVideoOff(false);
          setPermissionsGranted(false);
        }
        onCallEnded(); // Always notify context (emits END_CALL so other peer is notified)
      } catch (error) {
        console.error("Error ending call:", error);
        onCallEnded();
      }
    };

    // Toggle mute
    const toggleMute = async () => {
      if (localAudioTrackRef.current) {
        // Get current enabled state from the track itself
        const currentEnabled = localAudioTrackRef.current.enabled;
        // Toggle to opposite state
        const newEnabled = !currentEnabled;
        await localAudioTrackRef.current.setEnabled(newEnabled);
        // Update state: if track is disabled (newEnabled = false), then isMuted = true
        setIsMuted(!newEnabled);

        // Reset voice level when muted
        if (!newEnabled) {
          setIsSpeaking(false);
          setVoiceLevel(0);
        }
      }
    };

    // Toggle video
    const toggleVideo = async () => {
      if (localVideoTrackRef.current) {
        // Get current enabled state from the track itself
        const currentEnabled = localVideoTrackRef.current.enabled;
        // Toggle to opposite state
        const newEnabled = !currentEnabled;
        await localVideoTrackRef.current.setEnabled(newEnabled);
        // Update state: if track is disabled (newEnabled = false), then isVideoOff = true
        setIsVideoOff(!newEnabled);
      }
    };

    // Toggle audio output (speaker) mute
    const toggleAudioOutputMute = () => {
      const newMutedState = !isAudioOutputMuted;
      setIsAudioOutputMuted(newMutedState);

      // Mute/unmute all remote users' audio tracks
      remoteUsers.forEach((user) => {
        if (user.audioTrack) {
          user.audioTrack.setVolume(newMutedState ? 0 : 100);
        }
      });
    };

    // Auto-start call when component mounts or when call status changes to connected
    useEffect(() => {
      if (
        userId &&
        callerId &&
        !inCall &&
        !isLoading &&
        callStatus === "connected"
      ) {
        handleStartCall();
      }
    }, [userId, callerId, callStatus]);

    // Enumerate audio devices when in call
    useEffect(() => {
      if (inCall) {
        getAudioOutputDevices();

        // Listen for device changes
        const handleDeviceChange = () => {
          getAudioOutputDevices();
        };

        navigator.mediaDevices.addEventListener(
          "devicechange",
          handleDeviceChange
        );

        return () => {
          navigator.mediaDevices.removeEventListener(
            "devicechange",
            handleDeviceChange
          );
        };
      }
    }, [inCall]);

    // Close audio menu when clicking outside
    useEffect(() => {
      if (showAudioMenu) {
        const handleClickOutside = (event) => {
          if (!event.target.closest(".audio-output-selector")) {
            setShowAudioMenu(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [showAudioMenu]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (inCall) {
          handleEndCall();
        }
      };
    }, []);

    const getCallerName = () => {
      if (callerInfo.fullName) {
        return callerInfo.fullName;
      }
      return callerId;
    };

    useImperativeHandle(agoraClientRef, () => ({
      ...(clientRef.current ?? {}),
      handleEndCall,
    }));
    // Loading Screen or Ringing Screen
    if ((isLoading && !inCall) || (!inCall && callStatus === "ringing")) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1201,
            height: "100dvh",
          }}
          className="callscreen app-container call-screen"
        >
          <div className="call-loading">
            <Loader size={48} className="spinning" />
            <h2>
              {callStatus === "ringing"
                ? "Ringing..."
                : "Connecting to call..."}
            </h2>
            <p>
              {callStatus === "ringing"
                ? `Calling ${getCallerName()}...`
                : `Setting up ${
                    callType === "video" ? "video" : "voice"
                  } call with ${getCallerName()}`}
            </p>
            <button
              className="control-btn end-call cancel-call-btn"
              onClick={handleEndCall}
              title="Cancel call"
            >
              <Phone size={28} />
            </button>
          </div>
        </div>
      );
    }

    // Call Screen
    if (inCall) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1201,
            height: "100dvh",
          }}
          className={`callscreen app-container call-screen ${
            callType === "voice" ? "voice-call" : "video-call"
          }`}
        >
          {/* Call Header */}
          <div className="call-header">
            <div className="call-info">
              <div className="call-title">
                {callType === "video" ? (
                  <Video size={24} className="header-icon" />
                ) : (
                  <Phone size={24} className="header-icon" />
                )}
                <h2>{getCallerName()}</h2>
              </div>
              <p className="call-status">
                <span className="status-dot"></span>
                {callType === "video" ? "Video Call" : "Voice Call"} • Connected
              </p>
            </div>
          </div>

          {/* Video Container */}
          <div
            className={`video-container ${
              callType === "voice" ? "voice-mode" : "video-mode"
            }`}
          >
            {callType === "voice" ? (
              // Voice Call UI
              <div className="voice-call-display">
                <div className="caller-avatar">
                  <span className="avatar-text">
                    {getCallerName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3>{getCallerName()}</h3>
                <p className="call-duration">Voice Call Active</p>
              </div>
            ) : (
              // Video Call UI: remote(s) fill main area, self small top-right
              <>
                {/* Main area: remote participants (split by count) */}
                <div
                  className={`remote-videos remote-count-${Math.min(
                    Math.max(remoteUsers.length, 1),
                    4
                  )}`}
                  style={{
                    maxWidth: "500px",
                    marginInline: "auto",
                  }}
                >
                  {remoteUsers.length === 0 ? (
                    <div className="waiting-message">
                      <p>Waiting for {getCallerName()} to join...</p>
                    </div>
                  ) : (
                    remoteUsers.map((user) => (
                      <div key={user.uid} className="remote-video-wrapper">
                        <div
                          id={`remote-video-${user.uid}`}
                          className="remote-video"
                        ></div>
                        <span className="video-label">
                          {getCallerName()} (ID: {user.uid})
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Self: small pip at top right */}
                <div className="local-video-wrapper">
                  <div id="local-video" className="local-video"></div>
                  <span className="video-label">You</span>
                </div>
              </>
            )}
          </div>

          {/* Call Controls */}
          <div className="call-controls">
            {/* Microphone Mute Button */}
            <button
              className={`control-btn ${isMuted ? "muted" : ""} ${
                !isMuted && isSpeaking ? "speaking" : ""
              }`}
              onClick={toggleMute}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
              style={{
                "--voice-level": voiceLevel / 100,
                "--voice-intensity": Math.min(voiceLevel / 50, 1),
              }}
            >
              {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            {callType === "video" && (
              <button
                className={`control-btn ${isVideoOff ? "video-off" : ""}`}
                onClick={toggleVideo}
                title={isVideoOff ? "Turn on camera" : "Turn off camera"}
              >
                {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
              </button>
            )}

            {/* Audio Output Selector with Output Mute */}
            {audioOutputDevices.length > 1 && (
              <div className="audio-output-selector">
                <div className="audio-control-group">
                  {/* Left Button - Mute/Unmute Audio Output (Speaker) */}
                  <button
                    className={`control-btn audio-output-mute-btn ${
                      isAudioOutputMuted ? "muted" : ""
                    }`}
                    onClick={toggleAudioOutputMute}
                    title={
                      isAudioOutputMuted
                        ? "Unmute Audio Output"
                        : "Mute Audio Output"
                    }
                  >
                    {(() => {
                      if (isAudioOutputMuted) {
                        return <VolumeX size={28} />;
                      }
                      const selectedDevice = audioOutputDevices.find(
                        (d) => d.deviceId === selectedAudioOutput
                      );
                      if (selectedDevice) {
                        const deviceInfo = identifyDeviceType(
                          selectedDevice.label || "Speaker"
                        );
                        const SelectedIcon = deviceInfo.icon;
                        return <SelectedIcon size={28} />;
                      }
                      return <Volume2 size={28} />;
                    })()}
                  </button>

                  {/* Right Button - Audio Output Selection */}
                  <button
                    className="control-btn audio-selector-btn"
                    onClick={() => setShowAudioMenu(!showAudioMenu)}
                    title="Select Audio Output"
                  >
                    <ChevronUp size={20} />
                  </button>
                </div>

                {showAudioMenu && (
                  <div className="audio-menu">
                    <div className="audio-menu-header">
                      <h4>Audio Output</h4>
                    </div>
                    <div className="audio-menu-items">
                      {audioOutputDevices.map((device) => {
                        const deviceInfo = identifyDeviceType(
                          device.label || "Speaker"
                        );
                        const DeviceIcon = deviceInfo.icon;
                        return (
                          <button
                            key={device.deviceId}
                            className={`audio-menu-item ${
                              selectedAudioOutput === device.deviceId
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              changeAudioOutput(device.deviceId);
                              setShowAudioMenu(false);
                            }}
                          >
                            <DeviceIcon size={22} />
                            <span>{deviceInfo.type}</span>
                            {selectedAudioOutput === device.deviceId && (
                              <span className="checkmark">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className="control-btn end-call"
              onClick={handleEndCall}
              title="End Call"
            >
              <Phone size={28} />
            </button>
          </div>
        </div>
      );
    }
    return null;
  },
);

export default CallScreen;
