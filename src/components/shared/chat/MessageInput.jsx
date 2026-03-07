import React, { useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  CurrencyRupeeSharp,
} from "@mui/icons-material";
import LawyerPaymentDialog from "../../Client/LawyerPaymentDialog";

const MessageInput = ({
  messageInput,
  setMessageInput,
  onSendMessage,
  fileInputRef,
  onFileUpload,
  isUploading,
  lawyerPayId,
}) => {
  const paymentApiRef = useRef(null);
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
          InputProps={{
            startAdornment:
              <InputAdornment>
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  color="primary"
                >
                  {isUploading ? <CircularProgress size={24} /> : <AttachFileIcon />}
                </IconButton>
              </InputAdornment>,
            endAdornment: lawyerPayId && paymentApiRef.current && (
              <InputAdornment>
                <IconButton
                  onClick={() => paymentApiRef.current?.handleOpen()}
                  color="success"
                >
                  <CurrencyRupeeSharp />
                </IconButton>
              </InputAdornment>
            ),
          }}
          multiline
          maxRows={4}
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
      {lawyerPayId && (
        <LawyerPaymentDialog ref={paymentApiRef} lawyerId={lawyerPayId} />
      )}
    </Paper>
  );
};

export default MessageInput;
