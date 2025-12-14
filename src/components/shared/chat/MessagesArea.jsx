import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";

const MessagesArea = ({ 
  messages, 
  isLoadingMessages, 
  userId, 
  messagesEndRef 
}) => {
  if (isLoadingMessages) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Typography color="text.secondary">
          No messages yet. Start the conversation!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isMe={
            msg.senderId === userId ||
            msg.senderId?.toString() === userId
          }
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessagesArea;

