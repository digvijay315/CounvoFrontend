import React, { useState, useEffect } from "react";
import { Chat as ChatIcon, Close as CloseIcon, Timer as TimerIcon } from "@mui/icons-material";
import { Avatar, Box, Typography, Button, Stack, Paper, LinearProgress } from "@mui/material";

const TIMEOUT_SECONDS = 60;

const IncomingChatRequest = ({
  clientInfo,
  onAccept,
  onReject,
  onTimeout, // Called when timer expires (different from reject)
}) => {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Timer expired - dismiss without rejecting
      if (onTimeout) {
        onTimeout();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const progress = (timeLeft / TIMEOUT_SECONDS) * 100;
  const isUrgent = timeLeft <= 15;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          animation: "slideUp 0.4s ease",
          "@keyframes slideUp": {
            from: { transform: "translateY(30px)", opacity: 0 },
            to: { transform: "translateY(0)", opacity: 1 },
          },
        }}
      >
        {/* Timer Bar */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <TimerIcon
              sx={{
                fontSize: 20,
                color: isUrgent ? "error.main" : "text.secondary",
                animation: isUrgent ? "pulse 1s infinite" : "none",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            />
            <Typography
              variant="body2"
              fontWeight="600"
              color={isUrgent ? "error.main" : "text.secondary"}
            >
              {timeLeft}s remaining
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: isUrgent ? "error.main" : "primary.main",
                transition: "transform 1s linear",
              },
            }}
          />
        </Box>

        {/* Chat Icon Header */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)",
          }}
        >
          <ChatIcon sx={{ fontSize: 40, color: "white" }} />
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight="700" gutterBottom>
          New Chat Request
        </Typography>

        {/* Client Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            my: 3,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Avatar
            src={clientInfo?.profilepic?.[0] || ""}
            sx={{ width: 56, height: 56, bgcolor: "primary.light" }}
          >
            {clientInfo?.fullName?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" fontWeight="600">
              {clientInfo?.fullName || "Unknown User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              wants to chat with you
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<CloseIcon />}
            onClick={onReject}
            sx={{
              flex: 1,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<ChatIcon />}
            onClick={onAccept}
            sx={{
              flex: 1,
              py: 1.5,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
              },
            }}
          >
            Accept
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          Accepting will start a conversation with this client
        </Typography>
      </Paper>
    </Box>
  );
};

export default IncomingChatRequest;

