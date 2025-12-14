import React, { useState } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import api from "../../../api";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const ChatApprovalButtons = ({
  selectedChat,
  onChatUpdate,
  getParticipantName,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useAuth();

  const handleAcceptChat = async () => {
    setIsProcessing(true);
    try {
      const response = await api.put(
        `/api/v2/lawyer/updateChatStatus/${userId}`,
        {
          chatStatus: true,
          chatGroupId: selectedChat._id,
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Chat Accepted",
          text: "You can now start chatting with the client.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update the chat group status
        if (onChatUpdate) {
          onChatUpdate(selectedChat._id, { isAccepted: true });
        }
      }
    } catch (error) {
      console.error("Error accepting chat:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Accept",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectChat = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Reject Chat Request?",
      text: "Are you sure you want to reject this chat request?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setIsProcessing(true);
    try {
      const response = await api.put(`/api/v2/lawyer/updateChatStatus/${userId}`, {
        chatGroupId: selectedChat._id,
        chatStatus: false,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "info",
          title: "Chat Rejected",
          text: "The chat request has been rejected.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Update the chat group status
        if (onChatUpdate) {
          onChatUpdate(selectedChat._id, {
            isAccepted: false,
            isRejected: true,
          });
        }
      }
    } catch (error) {
      console.error("Error rejecting chat:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Reject",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
          maxWidth: 450,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <Typography variant="h3">💬</Typography>
        </Box>

        <Typography variant="h6" fontWeight="600" gutterBottom>
          New Chat Request
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getParticipantName(
            selectedChat?.participant,
            selectedChat?.participantModel
          )}{" "}
          wants to start a conversation with you.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<RejectIcon />}
            onClick={handleRejectChat}
            disabled={isProcessing}
            sx={{ minWidth: 120 }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<AcceptIcon />}
            onClick={handleAcceptChat}
            disabled={isProcessing}
            sx={{ minWidth: 120 }}
          >
            Accept
          </Button>
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          Accepting will allow you to chat with the client
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatApprovalButtons;
