import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  Image as ImageIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon,
  PhoneMissed as PhoneMissedIcon,
  VideoCall as VideoCallIcon,
  ArrowBackIos,
  ArrowBackIosNew,
  SwapHoriz as SwitchIcon,
  RateReview as ReviewIcon,
} from "@mui/icons-material";
import { useSocket } from "../../context/SocketContext";
import useAuth from "../../hooks/useAuth";
import api from "../../api";
import { uploadResource } from "../../utils";
import Swal from "sweetalert2";

// Import chat components
import ChatHeader from "./chat/ChatHeader";
import MessagesArea from "./chat/MessagesArea";
import MessageInput from "./chat/MessageInput";
import ChatPendingApproval from "./chat/ChatPendingApproval";
import ChatApprovalButtons from "./chat/ChatApprovalButtons";
import useNotification from "../../hooks/useNotification";
import { NAVIGATION_CONSTANTS } from "../../_constants/navigationConstants";
import CustomerFeedbackForm from "../customerfeedback";
import LawyerFeedbackForm from "../lawyerfeedbackform";

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
    typingFromUserId,
    emitTyping,
  } = useSocket();
  const { isBrowserMinimized, verifyPermission, createNotification } =
    useNotification();

  // Tab state from query params
  const currentTab = searchParams.get("tab") === "call" ? "call" : "messages";

  // State
  const [chatGroups, setChatGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Call history state (placeholder for now)
  const [callHistory, setCallHistory] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [isLoadingCallHistory, setIsLoadingCallHistory] = useState(false);

  // Review feedback dialog (both sides)
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  // Has user already submitted review for this reviewee? key = revieweeId, value = true/false
  const [reviewSubmittedMap, setReviewSubmittedMap] = useState({});

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingDebounceRef = useRef(null);

  // Computed
  const userModel = userType === "lawyer" ? "Lawyer" : "User";
  const onlineUsers = userType === "lawyer" ? onlineClients : onlineLawyers;
  const isOtherUserTyping =
    !!selectedChat?.participant?._id &&
    typingFromUserId === selectedChat.participant._id;

  // Emit typing indicator when user types (debounced)
  useEffect(() => {
    const participantId = selectedChat?.participant?._id;
    if (!participantId || !messageInput.trim()) return;
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      emitTyping(participantId);
      typingDebounceRef.current = null;
    }, 300);
    return () => {
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [messageInput, selectedChat?.participant?._id, emitTyping]);

  // Handle tab change
  const handleTabChange = (event, newTab) => {
    if (newTab !== null) {
      const newParams = new URLSearchParams(searchParams);

      if (newTab === "call") {
        newParams.set("tab", "call");
        newParams.delete("chatId");
      } else {
        newParams.delete("tab");
        newParams.delete("chatId");
      }

      setSearchParams(newParams);
      setSelectedChat(null);
      setSelectedCall(null);
      setMessages([]);
    }
  };

  // Fetch call history from API
  const fetchCallHistory = useCallback(async () => {
    if (!userId) return;
    setIsLoadingCallHistory(true);
    try {
      const res = await api.get(
        `/api/v2/chat/call-history/${userId}?userType=${userModel}`
      );
      if (res.data.success) {
        setCallHistory(res.data.data || []);
      } else {
        setCallHistory([]);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
      setCallHistory([]);
    } finally {
      setIsLoadingCallHistory(false);
    }
  }, [userId, userModel]);

  // Fetch call history when on call tab
  useEffect(() => {
    if (currentTab === "call") {
      fetchCallHistory();
    }
  }, [currentTab, fetchCallHistory]);

  // Fetch review status when selected chat (reviewee) changes
  const fetchReviewStatus = useCallback(async (revieweeId) => {
    if (!revieweeId) return;
    try {
      const res = await api.get(`api/review/status?revieweeId=${revieweeId}`);
      setReviewSubmittedMap((prev) => ({
        ...prev,
        [revieweeId]: res.data?.submitted === true,
      }));
    } catch (err) {
      setReviewSubmittedMap((prev) => ({ ...prev, [revieweeId]: false }));
    }
  }, []);

  useEffect(() => {
    const revieweeId = selectedChat?.participant?._id;
    if (revieweeId) {
      fetchReviewStatus(revieweeId);
    }
  }, [selectedChat?.participant?._id, fetchReviewStatus]);

  // Handle call selection
  const handleSelectCall = (call) => {
    if (call?._id !== selectedCall?._id) {
      setSelectedCall(call);

      if (call?._id) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("callId", call._id);
        setSearchParams(newParams);
      }
    }
  };

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
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat?._id]);

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
      } else {
        // To show the updated chat group
        setTimeout(() => {
          fetchChatGroups();
        }, 1000);
      }
      // Notify is user browser is minimized
      if (isBrowserMinimized() || from !== participantId) {
        verifyPermission().then((permission) => {
          if (permission === "granted") {
            createNotification(
              "New message received",
              msgText || "You have received a new message."
            );
          }
        });
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
      // Upload file to S3 using presigned URL
      const uploadResult = await uploadResource(file, file.name, "chat");

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      const { fileKey, publicUrl } = uploadResult;
      const fileType = file.type;
      const fileName = file.name;
      const timestamp = new Date().toISOString();

      // Send via socket
      sendMessage({
        toUserId: participantId,
        message: "",
        fileUrl: publicUrl,
        fileKey,
        fileName,
        fileType,
      });

      // Add to local messages
      const newMsg = {
        _id: Date.now().toString(),
        senderId: userId,
        senderModel: userModel,
        message: "",
        fileUrl: publicUrl,
        fileKey,
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
        fileUrl: publicUrl,
        fileKey,
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
        text: error.message || "Failed to upload file. Please try again.",
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

  const filteredCallHistory = callHistory.filter((call) => {
    if (!searchQuery) return true;
    const name = getParticipantName(call.participant, call.participantModel);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ==================== RENDER ====================

  const findLawyerPayId = (selectedChat) => {
    let lawyerPayId = null;
    if (selectedChat && selectedChat?.participantModel === "Lawyer") {
      lawyerPayId = selectedChat.participant._id;
    }
    return lawyerPayId;
  };

  const lawyerPayId = useMemo(
    () => findLawyerPayId(selectedChat),
    [selectedChat]
  );

  // Format call duration
  const formatCallDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get call icon based on type and status
  const getCallIcon = (call) => {
    // Missed or rejected calls
    if (call.status === "missed" || call.status === "rejected") {
      return <PhoneMissedIcon sx={{ color: "error.main", fontSize: 18 }} />;
    }
    // Connected or ended calls (successful)
    if (call.direction === "outgoing") {
      return <CallMadeIcon sx={{ color: "success.main", fontSize: 18 }} />;
    }
    return <CallReceivedIcon sx={{ color: "primary.main", fontSize: 18 }} />;
  };

  // Get call status text for display
  const getCallStatusText = (call) => {
    const typeLabel = call.callType === "video" ? "Video call" : "Voice call";

    switch (call.status) {
      case "missed":
        return "Missed";
      case "rejected":
        return "Declined";
      case "connected":
      case "ended":
        return typeLabel;
      default:
        return typeLabel;
    }
  };

  const handleResetCurrentId = () => {
    setSelectedCall(null);
    setSelectedChat(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar - Chat Groups or Call History */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: selectedChat || selectedCall ? 0 : "100%", md: 360 },
          minWidth: { md: 360 },
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 0.3s",
        }}
      >
        {/* Tab Toggle in Sidebar Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <ToggleButtonGroup
            value={currentTab}
            exclusive
            onChange={handleTabChange}
            size="small"
            sx={{
              mb: 1.5,
              "& .MuiToggleButton-root": {
                px: 2,
                py: 0.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "1px solid",
                borderColor: "divider",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              },
            }}
          >
            <ToggleButton value="messages">
              <ChatIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Messages
            </ToggleButton>
            <ToggleButton value="call">
              <PhoneIcon sx={{ mr: 0.75, fontSize: 18 }} />
              Calls
            </ToggleButton>
          </ToggleButtonGroup>
          <TextField
            fullWidth
            size="small"
            placeholder={
              currentTab === "messages"
                ? "Search conversations..."
                : "Search calls..."
            }
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

        {/* List Content */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {currentTab === "messages" ? (
            // Chat List
            isLoadingGroups ? (
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
            )
          ) : // Call History List
          isLoadingCallHistory ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredCallHistory.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <PhoneIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography color="text.secondary">
                {searchQuery ? "No calls found" : "No call history yet"}
              </Typography>
              {!searchQuery && (
                <Typography variant="body2" color="text.disabled">
                  Your call records will appear here
                </Typography>
              )}
            </Box>
          ) : (
            <List disablePadding>
              {filteredCallHistory.map((call) => {
                const participantName = getParticipantName(
                  call.participant,
                  call.participantModel
                );
                const avatarSrc = getAvatarSrc(call.participant);
                const isSelected = selectedCall?._id === call._id;

                return (
                  <ListItem
                    key={call._id}
                    button
                    onClick={() => handleSelectCall(call)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor: isSelected ? "action.selected" : "transparent",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={avatarSrc} alt={participantName}>
                        {participantName?.[0] || "?"}
                      </Avatar>
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
                            fontWeight={500}
                            noWrap
                            sx={{ maxWidth: 150 }}
                          >
                            {participantName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(call.callTime)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          {getCallIcon(call)}
                          <Typography
                            variant="body2"
                            color={
                              call.status === "missed" ||
                              call.status === "rejected"
                                ? "error.main"
                                : "text.secondary"
                            }
                          >
                            {getCallStatusText(call)}
                          </Typography>
                          {call.duration > 0 && (
                            <Typography variant="body2" color="text.disabled">
                              • {formatCallDuration(call.duration)}
                            </Typography>
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

      {/* Right Side - Chat Messages or Call Details */}
      <Box
        sx={{
          flex: 1,
          display: {
            xs: selectedChat || selectedCall ? "flex" : "none",
            md: "flex",
          },
          flexDirection: "column",
          bgcolor: "grey.50",
        }}
      >
        {currentTab === "messages" ? (
          // Messages Tab Content
          selectedChat ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                selectedChat={selectedChat}
                onlineUsers={onlineUsers}
                isOtherUserTyping={isOtherUserTyping}
                getAvatarSrc={getAvatarSrc}
                getParticipantName={getParticipantName}
                onCall={handleCall}
                goBack={handleResetCurrentId}
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
                    <Stack
                      direction="row"
                      justifyContent="center"
                      spacing={2}
                      sx={{ px: 1, pb: 1, width: "100%" }}
                    >
                      {userType === "customer" && (
                        <Button
                          variant="outlined"
                          startIcon={<SwitchIcon />}
                          onClick={() =>
                            navigate(NAVIGATION_CONSTANTS.FIND_LAWYER_PATH)
                          }
                          sx={{ textTransform: "none", borderRadius: 10 }}
                        >
                          Switch
                        </Button>
                      )}
                      {reviewSubmittedMap[selectedChat?.participant?._id] ===
                        false && (
                        <Button
                          variant="contained"
                          startIcon={<ReviewIcon />}
                          onClick={() => setShowReviewDialog(true)}
                          sx={{ textTransform: "none", borderRadius: 10 }}
                        >
                          Review
                        </Button>
                      )}
                    </Stack>
                    <MessagesArea
                      messages={messages}
                      isLoadingMessages={isLoadingMessages}
                      userId={userId}
                      messagesEndRef={messagesEndRef}
                    />
                  </Box>

                  <Dialog
                    open={showReviewDialog}
                    onClose={() => setShowReviewDialog(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "90vh",
                      },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      We Value Your Feedback
                    </DialogTitle>
                    <DialogContent
                      sx={{
                        flex: 1,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        px: 3,
                      }}
                    >
                      {userType === "lawyer" ? (
                        <LawyerFeedbackForm
                          revieweeId={selectedChat?.participant?._id}
                          onSubmit={async () => {
                            await fetchReviewStatus(
                              selectedChat?.participant?._id
                            );
                            setShowReviewDialog(false);
                          }}
                        />
                      ) : (
                        <CustomerFeedbackForm
                          revieweeId={selectedChat?.participant?._id}
                          onSubmit={async () => {
                            await fetchReviewStatus(
                              selectedChat?.participant?._id
                            );
                            setShowReviewDialog(false);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Message Input */}
                  <MessageInput
                    lawyerPayId={lawyerPayId}
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
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Centre content - can scroll if needed */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <ChatIcon
                  sx={{ fontSize: 64, color: "text.disabled", mb: 1 }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Choose a chat from the left to start messaging
                </Typography>
              </Box>
              {/* Buttons fixed at bottom - no scroll */}
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  py: 2,
                  px: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                {userType === "customer" && (
                  <Button
                    variant="outlined"
                    startIcon={<SwitchIcon />}
                    onClick={() =>
                      navigate(NAVIGATION_CONSTANTS.FIND_LAWYER_PATH)
                    }
                    sx={{ textTransform: "none", borderRadius: 10 }}
                  >
                    Switch
                  </Button>
                )}
                {reviewSubmittedMap[selectedChat?.participant?._id] ===
                  false && (
                  <Button
                    variant="contained"
                    startIcon={<ReviewIcon />}
                    onClick={() => setShowReviewDialog(true)}
                    sx={{ textTransform: "none", borderRadius: 10 }}
                  >
                    Review
                  </Button>
                )}
              </Box>
              <Dialog
                open={showReviewDialog}
                onClose={() => setShowReviewDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "90vh",
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  We Value Your Feedback
                </DialogTitle>
                <DialogContent
                  sx={{
                    flex: 1,
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    px: 3,
                  }}
                >
                  {userType === "lawyer" ? (
                    <LawyerFeedbackForm
                      revieweeId={selectedChat?.participant?._id}
                      onSubmit={async () => {
                        await fetchReviewStatus(selectedChat?.participant?._id);
                        setShowReviewDialog(false);
                      }}
                    />
                  ) : (
                    <CustomerFeedbackForm
                      revieweeId={selectedChat?.participant?._id}
                      onSubmit={async () => {
                        await fetchReviewStatus(selectedChat?.participant?._id);
                        setShowReviewDialog(false);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </Box>
          )
        ) : // Calls Tab Content
        selectedCall ? (
          <>
            {/* Call Details Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => setSelectedCall(null)}
                sx={{ display: { md: "none" } }}
              >
                <ArrowBackIosNew />
              </IconButton>
              <Avatar
                src={getAvatarSrc(selectedCall.participant)}
                alt={getParticipantName(
                  selectedCall.participant,
                  selectedCall.participantModel
                )}
                sx={{ width: 48, height: 48 }}
              >
                {
                  getParticipantName(
                    selectedCall.participant,
                    selectedCall.participantModel
                  )?.[0]
                }
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {getParticipantName(
                    selectedCall.participant,
                    selectedCall.participantModel
                  )}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getCallIcon(selectedCall)}
                  <Typography variant="body2" color="text.secondary">
                    {selectedCall.callType === "video"
                      ? "Video call"
                      : "Voice call"}
                    {selectedCall.duration &&
                      ` • ${formatCallDuration(selectedCall.duration)}`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Call Details Content */}
            <Box
              sx={{
                flex: 1,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                src={getAvatarSrc(selectedCall.participant)}
                alt={getParticipantName(
                  selectedCall.participant,
                  selectedCall.participantModel
                )}
                sx={{ width: 120, height: 120, mb: 3 }}
              >
                {
                  getParticipantName(
                    selectedCall.participant,
                    selectedCall.participantModel
                  )?.[0]
                }
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {getParticipantName(
                  selectedCall.participant,
                  selectedCall.participantModel
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {formatTime(selectedCall.callTime)}
              </Typography>
              <Chip
                icon={getCallIcon(selectedCall)}
                label={
                  selectedCall.status === "missed" ||
                  selectedCall.status === "rejected"
                    ? `${getCallStatusText(selectedCall)} Call`
                    : `${
                        selectedCall.callType === "video" ? "Video" : "Voice"
                      } Call${
                        selectedCall.duration > 0
                          ? ` • ${formatCallDuration(selectedCall.duration)}`
                          : ""
                      }`
                }
                variant="outlined"
                color={
                  selectedCall.status === "missed" ||
                  selectedCall.status === "rejected"
                    ? "error"
                    : "default"
                }
                sx={{ mt: 1 }}
              />
            </Box>
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
            <PhoneIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Select a call
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a call from the history to view details
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
