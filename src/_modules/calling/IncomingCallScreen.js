import React, { useState, useEffect } from "react";
import { Call, VideoCall, Close, PhoneDisabled } from "@mui/icons-material";
import { IconButton, Avatar } from "@mui/material";

const IncomingCallScreen = ({ 
  callerInfo, 
  callType, 
  onAccept, 
  onReject,
  userType = "client" // "client" or "lawyer"
}) => {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    // Start ripple animation
    setRipple(true);
    
    // Play ringtone sound (optional)
    const audio = new Audio("/ringtone.mp3"); // Add your ringtone file
    audio.loop = true;
    audio.play().catch(err => console.log("Audio play failed:", err));

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
          <div className={`avatar-container ${ripple ? 'ripple' : ''}`}>
            <Avatar
              src={callerInfo?.profilepic}
              alt={callerInfo?.fullName || callerInfo?.firstName}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>

          {/* Caller Info */}
          <div className="caller-info">
            <h2 className="caller-name">
              {callerInfo?.fullName || `${callerInfo?.firstName} ${callerInfo?.lastName}`}
            </h2>
            <p className="call-type-label">
              {callType === "video" ? (
                <>
                  <VideoCall style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Incoming Video Call
                </>
              ) : (
                <>
                  <Call style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Incoming Voice Call
                </>
              )}
            </p>
            {userType === "client" && callerInfo?.specializations && (
              <p className="caller-specialty">
                {callerInfo.specializations.map(s => s.label).join(", ")}
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
                  backgroundColor: "#ef4444",
                  color: "white",
                  width: 70,
                  height: 70,
                  "&:hover": {
                    backgroundColor: "#dc2626",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
                }}
              >
                <PhoneDisabled sx={{ fontSize: 32 }} />
              </IconButton>
              <span className="action-label">Decline</span>
            </div>

            {/* Accept Button */}
            <div className="action-wrapper">
              <IconButton
                className="accept-button"
                onClick={onAccept}
                sx={{
                  backgroundColor: "#10b981",
                  color: "white",
                  width: 70,
                  height: 70,
                  "&:hover": {
                    backgroundColor: "#059669",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
                  animation: "pulse 1.5s infinite",
                }}
              >
                {callType === "video" ? (
                  <VideoCall sx={{ fontSize: 32 }} />
                ) : (
                  <Call sx={{ fontSize: 32 }} />
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .wave {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: wave 4s infinite ease-in-out;
        }

        .wave1 {
          animation-delay: 0s;
        }

        .wave2 {
          animation-delay: 1s;
        }

        .wave3 {
          animation-delay: 2s;
        }

        @keyframes wave {
          0%, 100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.1;
          }
        }

        .incoming-call-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .avatar-container {
          position: relative;
          animation: bounceIn 0.6s ease;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .avatar-container.ripple::before,
        .avatar-container.ripple::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.6);
          animation: ripple 2s infinite;
        }

        .avatar-container.ripple::after {
          animation-delay: 1s;
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .caller-info {
          text-align: center;
          color: white;
        }

        .caller-name {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          animation: fadeIn 0.8s ease;
        }

        .call-type-label {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.95;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 1s ease;
        }

        .caller-specialty {
          font-size: 0.95rem;
          margin: 0;
          opacity: 0.85;
          font-style: italic;
        }

        .call-actions {
          display: flex;
          gap: 4rem;
          margin-top: 2rem;
        }

        .action-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .action-label {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 8px 36px rgba(16, 185, 129, 0.6);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .incoming-call-content {
            gap: 1.5rem;
            padding: 1rem;
          }

          .caller-name {
            font-size: 1.5rem;
          }

          .call-type-label {
            font-size: 1rem;
          }

          .call-actions {
            gap: 2rem;
            margin-top: 1.5rem;
          }

          .action-wrapper button {
            width: 60px !important;
            height: 60px !important;
          }

          .action-wrapper button svg {
            font-size: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomingCallScreen;

