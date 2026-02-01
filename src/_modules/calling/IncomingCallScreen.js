import React, { useState, useEffect } from "react";
import { Call, VideoCall, Close, PhoneDisabled } from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";

const IncomingCallScreen = ({
  callerInfo,
  callType,
  onAccept,
  onReject,
  userType = "customer", // "customer" or "lawyer"
}) => {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    // Start ripple animation
    setRipple(true);

    // Play ringtone sound (optional)
    const audio = new Audio("/ringtone.mp3"); // Add your ringtone file
    audio.loop = true;
    audio.play().catch((err) => console.log("Audio play failed:", err));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="incoming-call-overlay">
      <div className="incoming-call-container">
        {/* Animated Background */}
        <div className="animated-background">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>

        {/* Content */}
        <div className="incoming-call-content">
          {/* Caller Avatar with Ripple Effect */}
          <div className={`avatar-container ${ripple ? "ripple" : ""}`}>
            <Avatar
              src={callerInfo?.profilepic}
              alt={callerInfo?.fullName || callerInfo?.firstName}
              sx={{
                width: 100,
                height: 100,
                border: "3px solid rgba(234, 179, 8, 0.5)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* Caller Info */}
          <div className="caller-info">
            <h2 className="caller-name">
              {callerInfo?.fullName ||
                `${callerInfo?.firstName} ${callerInfo?.lastName}`}
            </h2>
            <p className="call-type-label">
              {callType === "video" ? (
                <>
                  <VideoCall
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                  />
                  Incoming Video Call
                </>
              ) : (
                <>
                  <Call style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Incoming Voice Call
                </>
              )}
            </p>
            {userType === "customer" && callerInfo?.specializations && (
              <p className="caller-specialty">
                {callerInfo.specializations.map((s) => s.label).join(", ")}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="call-actions">
            {/* Reject Button */}
            <div className="action-wrapper">
              <IconButton
                className="reject-button"
                onClick={onReject}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#fef2f2",
                  width: 64,
                  height: 64,
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    borderColor: "rgba(239, 68, 68, 0.5)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <PhoneDisabled sx={{ fontSize: 28 }} />
              </IconButton>
              <span className="action-label">Decline</span>
            </div>

            {/* Accept Button */}
            <div className="action-wrapper">
              <IconButton
                className="accept-button"
                onClick={onAccept}
                sx={{
                  backgroundColor: "#eab308",
                  color: "#0a0a0a",
                  width: 64,
                  height: 64,
                  "&:hover": {
                    backgroundColor: "#facc15",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 20px rgba(234, 179, 8, 0.35)",
                  animation: "acceptPulse 2s ease-in-out infinite",
                }}
              >
                {callType === "video" ? (
                  <VideoCall sx={{ fontSize: 28 }} />
                ) : (
                  <Call sx={{ fontSize: 28 }} />
                )}
              </IconButton>
              <span className="action-label">Accept</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .incoming-call-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a0a;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .incoming-call-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .animated-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle at center, rgba(234, 179, 8, 0.06) 0%, transparent 55%);
          animation: wave 6s infinite ease-in-out;
        }

        .wave1 { animation-delay: 0s; }
        .wave2 { animation-delay: 2s; }
        .wave3 { animation-delay: 4s; }

        @keyframes wave {
          0%, 100% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }

        .incoming-call-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .avatar-container {
          position: relative;
          animation: bounceIn 0.5s ease;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .avatar-container.ripple::before,
        .avatar-container.ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 2px solid rgba(234, 179, 8, 0.4);
          animation: ripple 2.5s infinite;
        }

        .avatar-container.ripple::after { animation-delay: 1.25s; }

        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

        .caller-info {
          text-align: center;
          color: #ffffff;
        }

        .caller-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.35rem 0;
          color: #ffffff;
          letter-spacing: -0.02em;
          animation: fadeIn 0.6s ease;
        }

        .call-type-label {
          font-size: 0.95rem;
          margin: 0 0 0.35rem 0;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          animation: fadeIn 0.8s ease;
        }

        .call-type-label .MuiSvgIcon-root {
          color: rgba(234, 179, 8, 0.9);
          font-size: 1.1rem;
        }

        .caller-specialty {
          font-size: 0.8rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        .call-actions {
          display: flex;
          gap: 2.5rem;
          margin-top: 1.25rem;
        }

        .action-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .action-label {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-weight: 600;
        }

        @keyframes acceptPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(234, 179, 8, 0.35); }
          50% { box-shadow: 0 4px 28px rgba(234, 179, 8, 0.5); }
        }

        @media (max-width: 768px) {
          .incoming-call-content {
            gap: 1.25rem;
            padding: 1rem;
          }

          .caller-name { font-size: 1.25rem; }
          .call-type-label { font-size: 0.875rem; }
          .call-actions { gap: 1.75rem; margin-top: 1rem; }
          .action-wrapper button { width: 56px !important; height: 56px !important; }
          .action-wrapper button svg { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
};

export default IncomingCallScreen;

