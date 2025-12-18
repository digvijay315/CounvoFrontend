import React from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { HourglassEmpty as PendingIcon } from "@mui/icons-material";

const ChatPendingApproval = ({ selectedChat, getParticipantName }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "warning.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <PendingIcon sx={{ fontSize: 40, color: "warning.main" }} />
        </Box>

        <Typography variant="h6" fontWeight="600" gutterBottom>
          Waiting for Lawyer's Response
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getParticipantName(
            selectedChat?.participant,
            selectedChat?.participantModel
          )}{" "}
          hasn't accepted this chat yet.
        </Typography>

        <Typography variant="caption" color="text.secondary">
          You'll be able to send messages once the lawyer accepts your chat
          request.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPendingApproval;

