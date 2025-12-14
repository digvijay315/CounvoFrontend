import React from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";

const MessageInput = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  fileInputRef,
  onFileUpload,
  isUploading,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "white",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileUpload}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          color="primary"
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <AttachFileIcon />
          )}
        </IconButton>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
        />
        <IconButton
          onClick={onSendMessage}
          color="primary"
          disabled={!messageInput.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default MessageInput;

