import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { InsertDriveFile as FileIcon } from "@mui/icons-material";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const MessageBubble = ({ message, isMe }) => {
  const isImage = message.fileType?.startsWith("image/");
  const hasFile = !!message.fileUrl;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        mb: 0.5,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "70%",
          p: 1.5,
          borderRadius: 2,
          bgcolor: isMe ? "primary.main" : "white",
          color: isMe ? "white" : "text.primary",
          border: isMe ? "none" : 1,
          borderColor: "divider",
        }}
      >
        {/* Text Message */}
        {message.message && (
          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
            {message.message}
          </Typography>
        )}

        {/* File Attachment */}
        {hasFile && (
          <Box sx={{ mt: message.message ? 1 : 0 }}>
            {isImage ? (
              <Box
                component="img"
                src={message.fileUrl}
                alt={message.fileName}
                sx={{
                  maxWidth: 200,
                  maxHeight: 200,
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
            ) : (
              <Box
                component="a"
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: isMe ? "white" : "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <FileIcon fontSize="small" />
                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                  {message.fileName}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            opacity: 0.7,
            textAlign: isMe ? "right" : "left",
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;

