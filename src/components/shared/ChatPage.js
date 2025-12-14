import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  InputAdornment,
  Chip,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { Search as SearchIcon, Image as ImageIcon } from "@mui/icons-material";
import { useSocket } from "../../context/SocketContext";
import useAuth from "../../hooks/useAuth";
import api from "../../api";
import Swal from "sweetalert2";

// Import chat components
import ChatHeader from "./chat/ChatHeader";
import MessagesArea from "./chat/MessagesArea";
import MessageInput from "./chat/MessageInput";
import ChatPendingApproval from "./chat/ChatPendingApproval";
import ChatApprovalButtons from "./chat/ChatApprovalButtons";

// ==================== UTILITY FUNCTIONS ====================
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

const getParticipantName = (participant, participantModel) => {
  if (!participant) return "Unknown";
  if (participantModel === "Lawyer") {
    return `Adv. ${participant.fullName}`;
  }
  return participant.fullName || "Unknown";
};

const getAvatarSrc = (participant) => {
  if (!participant) return "";
  if (Array.isArray(participant.profilepic)) {
    return participant.profilepic[0] || "";
  }
  return participant.profilepic || "";
};

// ==================== MAIN COMPONENT ====================
const ChatPage = ({ userType = "customer" }) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    onlineLawyers,
    onlineClients,
    sendMessage,
    registerMessageHandler,
    initiateCall,
  } = useSocket();

  // State
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Computed
  const userModel = userType === "lawyer" ? "Lawyer" : "User";
  const onlineUsers = userType === "lawyer" ? onlineClients : onlineLawyers;

  // ==================== DATA FETCHING ====================
  const fetchChatGroups = useCallback(async () => {
    if (!userId) return;
    setIsLoadingGroups(true);
    try {
      const res = await api.get(
        `/api/v2/chat/groups/${userId}?userType=${userModel}`
      );
      setChatGroups(res.data);
    } catch (error) {
      console.error("Error fetching chat groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  }, [userId, userModel]);

  const fetchMessages = useCallback(
    async (chatGroupId) => {
      if (!chatGroupId) return;
      setIsLoadingMessages(true);
      try {
        const res = await api.get(`/api/v2/chat/messages/${chatGroupId}`);
        setMessages(res.data.messages || []);

        // Mark messages as read
        await api.post("/api/v2/chat/mark-read", {
          chatGroupId,
          readerId: userId,
          readerModel: userModel,
        });

        // Update unread count locally
        setChatGroups((prev) =>
          prev.map((g) =>
            g._id === chatGroupId ? { ...g, unreadCount: 0 } : g
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [userId, userModel]
  );

  // Initial fetch
  useEffect(() => {
    fetchChatGroups();
  }, [fetchChatGroups]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat?._id && selectedChat?.isAccepted) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat?._id, fetchMessages]);

  // Auto-select chat from query parameter
  useEffect(() => {
    const chatIdFromUrl = searchParams.get("chatId");

    if (chatIdFromUrl && chatGroups.length > 0 && !isLoadingGroups) {
      // Find the chat group matching the chatId in URL
      const chatToSelect = chatGroups.find(
        (group) => group._id === chatIdFromUrl
      );

      if (chatToSelect) {
        // Only select if it's different from current selection to avoid infinite loop
        if (selectedChat?._id !== chatIdFromUrl) {
          setSelectedChat(chatToSelect);
          setMessages([]);
        }
      } else {
        // Chat not found, clear the invalid query param
        console.warn(`Chat with ID ${chatIdFromUrl} not found`);
      }
    }
  }, [searchParams, chatGroups, isLoadingGroups, selectedChat?._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==================== REAL-TIME MESSAGE HANDLING ====================
  useEffect(() => {
    if (!selectedChat) return;

    const participantId = selectedChat.participant?._id;
    if (!participantId) return;

    const handleIncomingMessage = ({
      from,
      message: msgText,
      fileUrl,
      fileName,
      fileType,
      timestamp,
    }) => {
      if (from === participantId) {
        const newMsg = {
          _id: Date.now().toString(),
          senderId: from,
          senderModel: selectedChat.participantModel,
          message: msgText,
          fileUrl,
          fileName,
          fileType,
          timestamp: timestamp || new Date().toISOString(),
          isRead: true,
        };
        setMessages((prev) => [...prev, newMsg]);

        // Update last message in chat group list
        setChatGroups((prev) =>
          prev.map((g) =>
            g._id === selectedChat._id
              ? {
                  ...g,
                  lastMessage: msgText || (fileName ? `📎 ${fileName}` : ""),
                  lastMessageAt: newMsg.timestamp,
                }
              : g
          )
        );
      }
    };

    const unsubscribe = registerMessageHandler(
      "chatPage",
      handleIncomingMessage
    );
    return unsubscribe;
  }, [selectedChat, registerMessageHandler]);

  // ==================== ACTIONS ====================
  const handleSelectChat = (chatGroup) => {
    if (chatGroup?._id !== selectedChat?._id) {
      setSelectedChat(chatGroup);
      setMessages([]);

      // Update URL with chatId query parameter
      if (chatGroup?._id) {
        setSearchParams({ chatId: chatGroup._id });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const participantId = selectedChat.participant?._id;
    if (!participantId) return;

    const timestamp = new Date().toISOString();
    const msgText = messageInput.trim();

    // Send via socket
    sendMessage({
      toUserId: participantId,
      message: msgText,
    });

    // Add to local messages
    const newMsg = {
      _id: Date.now().toString(),
      senderId: userId,
      senderModel: userModel,
      message: msgText,
      timestamp,
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Update chat group list
    setChatGroups((prev) =>
      prev.map((g) =>
        g._id === selectedChat._id
          ? { ...g, lastMessage: msgText, lastMessageAt: timestamp }
          : g
      )
    );

    // Save to database
    try {
      await api.post("/api/v2/chat/message", {
        chatGroupId: selectedChat._id,
        senderId: userId,
        senderModel: userModel,
        message: msgText,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setMessageInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    const participantId = selectedChat.participant?._id;
    if (!participantId) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/v2/admin/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url;
      const fileType = file.type;
      const fileName = file.name;
      const timestamp = new Date().toISOString();

      // Send via socket
      sendMessage({
        toUserId: participantId,
        message: "",
        fileUrl,
        fileName,
        fileType,
      });

      // Add to local messages
      const newMsg = {
        _id: Date.now().toString(),
        senderId: userId,
        senderModel: userModel,
        message: "",
        fileUrl,
        fileName,
        fileType,
        timestamp,
        isRead: false,
      };
      setMessages((prev) => [...prev, newMsg]);

      // Save to database
      await api.post("/api/v2/chat/message", {
        chatGroupId: selectedChat._id,
        senderId: userId,
        senderModel: userModel,
        message: "",
        fileUrl,
        fileName,
        fileType,
      });

      // Update chat group list
      setChatGroups((prev) =>
        prev.map((g) =>
          g._id === selectedChat._id
            ? { ...g, lastMessage: `📎 ${fileName}`, lastMessageAt: timestamp }
            : g
        )
      );
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload file. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCall = (callType) => {
    if (!selectedChat?.participant?._id) return;

    initiateCall(selectedChat.participant._id, callType, {
      firstName: selectedChat.participant.firstName,
      lastName: selectedChat.participant.lastName,
      fullName: selectedChat.participant.fullName,
      profilepic: selectedChat.participant.profilepic,
    });
  };

  const handleChatUpdate = (chatGroupId, updates) => {
    setChatGroups((prev) =>
      prev.map((g) => (g._id === chatGroupId ? { ...g, ...updates } : g))
    );

    // Update selected chat if it's the one being modified
    if (selectedChat?._id === chatGroupId) {
      setSelectedChat((prev) => ({ ...prev, ...updates }));
    }
  };

  // ==================== FILTERED DATA ====================
  const filteredChatGroups = chatGroups.filter((group) => {
    if (!searchQuery) return true;
    const name = getParticipantName(group.participant, group.participantModel);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ==================== RENDER ====================
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar - Chat Groups */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: selectedChat ? 0 : "100%", md: 360 },
          minWidth: { md: 360 },
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 0.3s",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight="700" gutterBottom>
            Messages
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Box>

        {/* Chat List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {isLoadingGroups ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredChatGroups.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                {searchQuery ? "No conversations found" : "No messages yet"}
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredChatGroups.map((group) => {
                const participantName = getParticipantName(
                  group.participant,
                  group.participantModel
                );
                const avatarSrc = getAvatarSrc(group.participant);
                const isOnline = onlineUsers.includes(group.participant?._id);
                const isSelected = selectedChat?._id === group._id;

                return (
                  <ListItem
                    key={group._id}
                    button
                    onClick={() => handleSelectChat(group)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor: isSelected ? "action.selected" : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: isOnline ? "success.main" : "grey.400",
                            border: "2px solid white",
                          },
                        }}
                      >
                        <Avatar src={avatarSrc} alt={participantName}>
                          {participantName[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={group.unreadCount > 0 ? 700 : 500}
                            noWrap
                            sx={{ maxWidth: 150 }}
                          >
                            {participantName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(group.lastMessageAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{
                              maxWidth: 180,
                              fontWeight: group.unreadCount > 0 ? 600 : 400,
                            }}
                          >
                            {group.lastMessage || "Start a conversation"}
                          </Typography>
                          {group.unreadCount > 0 && (
                            <Chip
                              label={group.unreadCount}
                              size="small"
                              color="primary"
                              sx={{
                                height: 20,
                                minWidth: 20,
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>

      {/* Right Side - Chat Messages */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedChat ? "flex" : "none", md: "flex" },
          flexDirection: "column",
          bgcolor: "grey.50",
        }}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              selectedChat={selectedChat}
              onlineUsers={onlineUsers}
              getAvatarSrc={getAvatarSrc}
              getParticipantName={getParticipantName}
              onCall={handleCall}
            />

            {/* Check if chat is accepted */}
            {!selectedChat.isAccepted && userType === "lawyer" ? (
              // Lawyer sees approval buttons
              <ChatApprovalButtons
                selectedChat={selectedChat}
                onChatUpdate={handleChatUpdate}
                getParticipantName={getParticipantName}
              />
            ) : !selectedChat.isAccepted && userType !== "lawyer" ? (
              // Client sees pending message
              <ChatPendingApproval
                selectedChat={selectedChat}
                getParticipantName={getParticipantName}
              />
            ) : (
              // Chat is accepted - show normal chat interface
              <>
                {/* Messages Area */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <MessagesArea
                    messages={messages}
                    isLoadingMessages={isLoadingMessages}
                    userId={userId}
                    messagesEndRef={messagesEndRef}
                  />
                </Box>

                {/* Message Input */}
                <MessageInput
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  onSendMessage={handleSendMessage}
                  fileInputRef={fileInputRef}
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              </>
            )}
          </>
        ) : (
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
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Select a conversation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a chat from the left to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;

