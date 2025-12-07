import React, { useState, useEffect, useRef } from "react";
import socket from "./socket";
import Swal from "sweetalert2";
import api from "../api";
import { HiOutlinePaperClip } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import CallScreen from "../_modules/calling/CallScreen";
import IncomingCallScreen from "../_modules/calling/IncomingCallScreen";
import { IconButton, Stack, Menu, MenuItem } from "@mui/material";
import { Call, Close, VideoCall, ArrowDropDown } from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import "./LawyerChatHistory.css";

function LawyerChatHistory() {
  const { userId: lawyerID } = useAuth();
  const [recentChats, setRecentChats] = useState([]);
  const [onlineClients, setOnlineClients] = useState([]);
  const [clients, setClients] = useState([]); // all clients who ever chatted
  const [chatClient, setChatClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offlineNotified, setOfflineNotified] = useState({});
  const inputRef = useRef();
  const [callMenuAnchor, setCallMenuAnchor] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); // {callerId, callerInfo, callType}

  // Fetch all recent chat history for this lawyer
  const fetchRecentChats = async () => {
    try {
      const res = await api.get("api/admin/chathistoryforrecentchat");
      const result = res.data;
      const lawyerChats = result.filter(
        (chat) => chat.to === lawyerID && chat.toModel === "Lawyer"
      );
      setRecentChats(lawyerChats);
    } catch (err) {
      console.error("Error fetching lawyer chats:", err);
    }
  };

  // Get unique client IDs from history
  const uniqueClientMap = {};
  const uniqueChatClients = [];
  recentChats.forEach((chat) => {
    if (!uniqueClientMap[chat.from]) {
      uniqueClientMap[chat.from] = true;
      uniqueChatClients.push(chat);
    }
  });

  // Fetch all user data for clients lawyer chatted with
  const fetchClientsData = async () => {
    const ids = uniqueChatClients.map((chat) => chat.from);
    const allClients = [];
    for (let id of ids) {
      try {
        const res = await api.get("/api/user/" + id);
        allClients.push(res.data);
      } catch {}
    }
    setClients(allClients);
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  useEffect(() => {
    fetchClientsData();
  }, [recentChats.length]);

  const markMessagesRead = async (clientId) => {
    try {
      const lawyerId = lawyerID;
      socket.emit("markMessagesRead", {
        readerId: lawyerId,
        senderId: clientId,
        readerModel: "Lawyer",
      });
    } catch (err) {
      console.error("Failed to mark messages read", err);
    }
  };

  // Online clients (if you have this)
  useEffect(() => {
    if (!lawyerID) return;
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      socket.emit("lawyerOnline", lawyerID);
      socket.emit("getOnlineClients");
    });

    socket.on("onlineClientsList", (ids) => {
      setOnlineClients(ids);
    });

    socket.on("receiveMessage", ({ from, message }) => {
      // Notification for lawyer if not in this chat
      if (!chatClient || chatClient._id !== from) {
        setOfflineNotified((prev) => ({
          ...prev,
          [from]: true,
        }));
        Swal.fire({
          icon: "info",
          title: "New Message",
          text: "Client sent you a message!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      if (chatClient && chatClient._id === from) {
        setMessages((prev) => [...prev, { text: message, isMe: false }]);
        setOfflineNotified((prev) => ({
          ...prev,
          [from]: false,
        }));
      }
    });

    // Incoming call event
    socket.on("incomingCall", async ({ callerId, callType, callerModel }) => {
      console.log("Incoming call from:", callerId, callType);

      // Fetch caller info
      let callerInfo = null;
      if (callerModel === "User") {
        try {
          const res = await api.get(`/api/user/${callerId}`);
          callerInfo = res.data;
        } catch (err) {
          console.error("Failed to fetch caller info:", err);
        }
      }

      setIncomingCall({
        callerId,
        callerInfo: callerInfo || { fullName: "Unknown User" },
        callType,
      });
    });

    // Call rejected by recipient
    socket.on("callRejected", ({ message }) => {
      console.log("Call was rejected:", message);
      setCallingData({
        isActive: false,
        callType: "voice",
        clientId: null,
        callerInfo: null,
        callStatus: "idle",
      });
      Swal.fire({
        icon: "error",
        title: "Call Declined",
        text: message || "The user declined your call.",
        timer: 3000,
        showConfirmButton: false,
      });
    });

    // Call accepted by recipient
    socket.on("callAccepted", ({ accepterId }) => {
      console.log("Call accepted by:", accepterId);
      // Update call status to connected
      setCallingData((prev) => ({
        ...prev,
        callStatus: "connected",
      }));
    });

    // Call ended by other party
    socket.on("callEnded", ({ enderId }) => {
      console.log("Call ended by other party:", enderId);
      setCallingData({
        isActive: false,
        callType: "voice",
        clientId: null,
        callerInfo: null,
        callStatus: "idle",
      });
      Swal.fire({
        icon: "info",
        title: "Call Ended",
        text: "The other party has ended the call.",
        timer: 2000,
        showConfirmButton: false,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("onlineClientsList");
      socket.off("incomingCall");
      socket.off("callRejected");
      socket.off("callAccepted");
      socket.off("callEnded");
      socket.disconnect();
    };
  }, [lawyerID, chatClient]);

  const fetchChatHistory = async (user1Id, user2Id) => {
    try {
      const res = await api.get(`api/admin/chathistory/${user1Id}/${user2Id}`);

      const data = await res.data;

      if (res.status === 200) {
        const formatted = data.map((msg) => ({
          text: msg.message,
          isMe: msg.from === user1Id,
          timestamp: msg.timestamp,
          isSystem: false,
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
          fileType: msg.fileType,
        }));
        setMessages(formatted);
      } else {
        console.error("❌ Failed to fetch history:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  // Fetch full chat with this client
  const handleOpenChat = async (client) => {
    setChatClient(client);
    markMessagesRead(client._id);
    setOfflineNotified((prev) => ({
      ...prev,
      [client._id]: false,
    }));
    const lawyerId = lawyerID;
    await fetchChatHistory(lawyerId, client._id);
  };

  // Send a message to client
  const handleSendMessage = (msgText) => {
    if (!msgText.trim() || !chatClient) return;
    socket.emit("privateMessage", {
      toUserId: chatClient._id,
      message: msgText,
      fromUserType: "lawyer",
      timestamp: new Date().toISOString(),
    });
    setMessages((prev) => [
      ...prev,
      { text: msgText, isMe: true, timestamp: new Date().toISOString() },
    ]);
  };

  // ======== Calling Functionallity
  const [callingData, setCallingData] = useState({
    isActive: false,
    callType: "voice",
    clientId: null,
    callerInfo: null,
    callStatus: "idle", // idle, ringing, connected
  });
  const handleStartCall = async (clientId, callType) => {
    try {
      // Emit call initiation to server
      socket.emit("initiateCall", {
        callerId: lawyerID,
        receiverId: clientId,
        callType,
        callerModel: "Lawyer",
        receiverModel: "User",
      });

      setCallingData({
        isActive: true,
        callType,
        clientId,
        callerInfo: {
          fullName: chatClient.fullName,
          profilepic: chatClient.profilepic,
        },
        callStatus: "ringing", // Set initial status as ringing
      });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = async () => {
    try {
      // Notify the other party that the call has ended
      if (callingData.clientId) {
        socket.emit("endCall", {
          callerId: lawyerID,
          receiverId: callingData.clientId,
        });
      }

      setCallingData({
        isActive: false,
        callType: "video",
        clientId: null,
        callerInfo: null,
        callStatus: "idle",
      });
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleOpenCallMenu = (event) => {
    setCallMenuAnchor(event.currentTarget);
  };

  const handleCloseCallMenu = () => {
    setCallMenuAnchor(null);
  };

  const handleCallOptionSelect = (callType) => {
    handleStartCall(chatClient._id, callType);
    handleCloseCallMenu();
  };

  // Handle incoming call acceptance
  const handleAcceptCall = () => {
    if (!incomingCall) return;

    // Emit call acceptance
    socket.emit("acceptCall", {
      callerId: incomingCall.callerId,
      accepterId: lawyerID,
    });

    // Start the call - when accepting, it's immediately connected
    setCallingData({
      isActive: true,
      callType: incomingCall.callType,
      clientId: incomingCall.callerId,
      callerInfo: incomingCall.callerInfo,
      callStatus: "connected", // Incoming calls are immediately connected when accepted
    });

    // Clear incoming call
    setIncomingCall(null);
  };

  // Handle incoming call rejection
  const handleRejectCall = () => {
    if (!incomingCall) return;

    // Emit call rejection
    socket.emit("rejectCall", {
      callerId: incomingCall.callerId,
      rejecterId: lawyerID,
      message: "Call was declined",
    });

    // Clear incoming call
    setIncomingCall(null);

    Swal.fire({
      icon: "info",
      title: "Call Declined",
      text: "You declined the call.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="lawyer-chat-history">
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 1,
            padding: "20px",
            // background: '#fff',
          }}
          className="main-content"
        >
          <h2>Your Clients</h2>
          <div className="lawyers-grid">
            {uniqueChatClients.length === 0 ? (
              <div>No clients you have chatted with yet.</div>
            ) : (
              uniqueChatClients.map((chat, idx) => {
                const client = clients.find((ci) => ci._id === chat.from);
                if (!client) return null;
                const isOnline = onlineClients.includes(client._id);
                const hasUnread = offlineNotified[client._id];
                return (
                  <div
                    key={chat._id}
                    className="lawyer-card"
                    style={
                      hasUnread
                        ? { border: "2px solid #3b82f6", background: "#eff6ff" }
                        : undefined
                    }
                  >
                    <img
                      src={client.profilepic}
                      alt={client.firstName}
                      className="lawyer-avatar"
                    />
                    <div className="lawyer-name">
                      {client.fullName}
                      {hasUnread && (
                        <span
                          style={{
                            color: "#2563eb",
                            fontWeight: "bold",
                            marginLeft: 8,
                            fontSize: "0.9em",
                          }}
                        >
                          • New
                        </span>
                      )}
                    </div>
                    <div className="lawyer-status">
                      <span style={{ color: isOnline ? "#10b981" : "#ef4444" }}>
                        {isOnline ? "🟢 Online" : "🔴 Offline"}
                      </span>
                    </div>
                    <div className="lawyer-details">
                      {/* <div>
                        <strong>Mobile:</strong> {client.contact_no}
                      </div> */}
                      {/* <div>
                        <strong>Email:</strong> {client.email}
                      </div> */}
                    </div>
                    {/* <div className="chat-message">
                      <strong>Last Message:</strong> {chat.message}
                    </div> */}
                    <div className="lawyer-actions">
                      <button
                        className="action-btn"
                        title="Chat"
                        onClick={() => handleOpenChat(client)}
                        style={{ background: "#2563eb", color: "#fff" }}
                      >
                        💬 Chat
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Popup */}
          {chatClient && (
            <div className="chat-popup" style={{ right: 80 }}>
              <div className="chat-header">
                <div>
                  <b>{chatClient.fullName}</b>
                  <div style={{ fontSize: 12, color: "#444" }}>
                    {onlineClients.includes(chatClient._id)
                      ? "🟢 Online"
                      : "🔴 Offline"}
                  </div>
                </div>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={handleOpenCallMenu}
                    aria-controls="call-menu"
                    aria-haspopup="true"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <Call sx={{ fontSize: 18 }} />
                    <ArrowDropDown sx={{ fontSize: 16, marginLeft: "2px" }} />
                  </IconButton>
                  <Menu
                    id="call-menu"
                    anchorEl={callMenuAnchor}
                    open={Boolean(callMenuAnchor)}
                    onClose={handleCloseCallMenu}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    PaperProps={{
                      sx: {
                        marginTop: "8px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        minWidth: "180px",
                        overflow: "visible",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          backgroundColor: "white",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                          borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
                          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleCallOptionSelect("voice")}
                      sx={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1f2937",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f0f9ff",
                          color: "#3b82f6",
                          "& .MuiSvgIcon-root": {
                            color: "#3b82f6",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <Call
                        sx={{
                          fontSize: 18,
                          marginRight: "12px",
                          color: "#6b7280",
                          transition: "all 0.2s ease",
                        }}
                      />
                      Voice Call
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleCallOptionSelect("video")}
                      sx={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1f2937",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                          color: "#10b981",
                          "& .MuiSvgIcon-root": {
                            color: "#10b981",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <VideoCall
                        sx={{
                          fontSize: 18,
                          marginRight: "12px",
                          color: "#6b7280",
                          transition: "all 0.2s ease",
                        }}
                      />
                      Video Call
                    </MenuItem>
                  </Menu>
                  <IconButton
                    size="small"
                    onClick={() => setChatClient(null)}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      padding: "8px",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <Close sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </div>
              <div
                className="chat-messages"
                style={{ height: 300, overflow: "auto" }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.isMe ? "sent" : "received"}`}
                    style={{
                      maxWidth: "80%",
                      padding: "0.75rem 1rem",
                      borderRadius: "18px",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      background: msg.isMe ? "#1e40af" : "white",
                      color: msg.isMe ? "white" : "#1f2937",
                      border: msg.isMe ? "none" : "1px solid #e5e7eb",
                      alignSelf: msg.isMe ? "flex-end" : "flex-start",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                    {msg.fileUrl &&
                      (msg.fileType && msg.fileType.startsWith("image/") ? (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={msg.fileUrl}
                            alt={msg.fileName}
                            style={{
                              maxWidth: 150,
                              maxHeight: 150,
                              marginTop: 8,
                              borderRadius: 4,
                            }}
                          />
                        </a>
                      ) : (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📄 {msg.fileName}
                        </a>
                      ))}
                    <div
                      style={{
                        fontSize: "10px",
                        color: msg.isMe ? "white" : "black",
                        marginTop: "2px",
                        textAlign: msg.isMe ? "right" : "left",
                      }}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleString()
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  ref={inputRef}
                  style={{ width: "80%", marginRight: 4 }}
                  type="text"
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      handleSendMessage(e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />

                {/* <button
                  className="actionbutton"
                  style={{ width: 38 }}
                  onClick={() => {
                    if (inputRef.current && inputRef.current.value.trim()) {
                      handleSendMessage(inputRef.current.value.trim());
                      inputRef.current.value = '';
                    }
                  }}
                >
                  ➤
                </button> */}

                <button
                  className="actionbutton"
                  type="button"
                  onClick={() => {
                    if (inputRef.current && inputRef.current.value.trim()) {
                      handleSendMessage(inputRef.current.value.trim());
                      inputRef.current.value = "";
                    }
                  }}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "92%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#54656f",
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                  title="Send"
                  tabIndex={-1}
                >
                  <IoSend />
                </button>

                <button
                  className="actionbutton"
                  type="button"
                  // onClick={() => fileInputRef.current.click()}
                  style={{
                    position: "absolute",
                    right: "20%",
                    top: "92%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "gray",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                  title="Attach Document"
                  tabIndex={-1}
                >
                  <HiOutlinePaperClip />
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <div
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99,
              }}
            >
              <span>Loading...</span>
            </div>
          )}
        </div>
        {callingData.isActive && (
          <CallScreen
            userId={lawyerID}
            callerId={callingData.clientId}
            callerInfo={callingData.callerInfo}
            callType={callingData.callType}
            callDirection="outgoing"
            callStatus={callingData.callStatus}
            onCallEnded={handleEndCall}
            screen="lawyer"
          />
        )}
        {incomingCall && (
          <IncomingCallScreen
            callerInfo={incomingCall.callerInfo}
            callType={incomingCall.callType}
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
            userType="lawyer"
          />
        )}
      </div>
    </div>
  );
}

export default LawyerChatHistory;
