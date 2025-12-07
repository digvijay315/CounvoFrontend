import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import Swal from "sweetalert2";
import api from "../../api";
import { HiOutlinePaperClip } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  MenuItem as MuiMenuItem,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Backdrop,
  Select,
  FormControl,
  Container,
} from "@mui/material";
import {
  Call,
  VideoCall,
  ArrowDropDown,
  Close,
  Chat as ChatIcon,
  Favorite,
  FavoriteBorder,
  SwapHoriz,
  Search as SearchIcon,
} from "@mui/icons-material";
import CallScreen from "../../_modules/calling/CallScreen";
import IncomingCallScreen from "../../_modules/calling/IncomingCallScreen";
import useAuth from "../../hooks/useAuth";

function Findalawyer() {
  const [isLoading, setIsLoading] = useState(false);

  const [specialization, setSpecialization] = useState("");
  const [state, setState] = useState("");
  const [recentChats, setRecentChats] = useState([]);
  const { user: userData, userId } = useAuth();

  const fetchChatHistory = async () => {
    try {
      const res = await api.get("api/admin/chathistory");
      const result = res.data;
      const clientChats = result.filter(
        (chat) => chat.from === userId && chat.fromModel === "User"
      );
      setRecentChats(clientChats);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch chat history for the logged-in user
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Deduplicate by lawyer ID ("to" field)
  const uniqueChatsMap = {};
  const uniqueChats = [];
  recentChats.forEach((chat) => {
    if (!uniqueChatsMap[chat.to]) {
      uniqueChatsMap[chat.to] = true;
      uniqueChats.push(chat);
    }
  });

  const SPECIALIZATIONS = [
    { value: "", label: "Select Specialization" },
    { value: "property lawyer", label: "Property Lawyer" },
    { value: "family lawyer", label: "Family Lawyer" },
    { value: "civil lawyer", label: "Civil Lawyer" },
    { value: "cyber lawyer", label: "Cyber Lawyer" },
    { value: "criminal lawyer", label: "Criminal Lawyer" },
    { value: "consumer lawyer", label: "Consumer Lawyer" },
    { value: "labour lawyer", label: "Labour Lawyer" },
    { value: "legal notice drafting", label: "Legal Notice Drafting" },
    {
      value: "company law & corporate compliance",
      label: "Company Law & Corporate Compliance",
    },
  ];

  const STATES = [
    { value: "", label: "Select State" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
    { value: "delhi", label: "Delhi" },
    { value: "tamilnadu", label: "Tamil Nadu" },
    // ...add more
  ];

  const [lawyers, setLawyers] = useState([]);
  const [chatLawyer, setChatLawyer] = useState(null);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageMap, setMessageMap] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [callMenuAnchor, setCallMenuAnchor] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); // {callerId, callerInfo, callType}
  const [favorites, setFavorites] = useState([]);

  const fetchlawyers = async () => {
    try {
      const resp = await api.get("api/lawyer/getalllawyerprofile");
      setLawyers(resp.data.filter((item) => item.status === "verified"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchlawyers();
  }, []);

  const getLawyerById = (id) => lawyers.find((lawyer) => lawyer._id === id);

  // Filter lawyers based on search
  const filterLawyersAndChat = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Filter lawyers by specialization and state
      let filtered = lawyers;

      if (specialization) {
        filtered = filtered.filter((lawyer) =>
          Array.isArray(lawyer.specializations)
            ? lawyer.specializations.some(
                (spec) =>
                  spec.label &&
                  spec.label
                    .toLowerCase()
                    .includes(specialization.toLowerCase())
              )
            : (lawyer.specializations?.label || lawyer.specializations || "")
                .toLowerCase()
                .includes(specialization.toLowerCase())
        );
      }

      if (state) {
        filtered = filtered.filter(
          (lawyer) =>
            lawyer.state &&
            lawyer.state.toLowerCase().includes(state.toLowerCase())
        );
      }

      // Try to find an online lawyer from filtered list, random order
      let candidates = [...filtered];
      while (candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        const candidate = candidates[idx];
        if (onlineLawyers.includes(candidate._id)) {
          handleOpenChat(candidate);
          return;
        }
        candidates.splice(idx, 1); // Remove tried candidate
      }

      // If no online lawyer found in filtered, pick any online lawyer
      const onlineLawyerObjs = lawyers.filter((lawyer) =>
        onlineLawyers.includes(lawyer._id)
      );
      if (onlineLawyerObjs.length > 0) {
        const randomLawyer =
          onlineLawyerObjs[Math.floor(Math.random() * onlineLawyerObjs.length)];
        handleOpenChat(randomLawyer);
      } else {
        Swal.fire({
          icon: "info",
          title: "Search result...",
          text: "No lawyers available.",
          showConfirmButton: "true",
        });
      }
    }, 2000);
  };

  // Your existing chat functionality...
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected (client):", socket.id);
      socket.emit("clientOnline", userId);
      socket.emit("getOnlineLawyers");
    });

    socket.on("onlineLawyersList", (ids) => {
      console.log("✅ Received online lawyers:", ids);
      setOnlineLawyers(ids);
    });

    socket.on("updateOnlineUsers", (ids) => {
      setOnlineLawyers(ids);
    });

    socket.on("receiveMessage", ({ from, message }) => {
      if (chatLawyer?._id === from) {
        setMessages((prev) => [...prev, { text: message, isMe: false }]);
      }
    });

    // Incoming call event
    socket.on("incomingCall", async ({ callerId, callType, callerModel }) => {
      console.log("Incoming call from:", callerId, callType);

      // Fetch caller info
      let callerInfo = null;
      if (callerModel === "Lawyer") {
        try {
          const res = await api.get(`/api/lawyer/getlawyer/${callerId}`);
          callerInfo = res.data;
        } catch (err) {
          console.error("Failed to fetch caller info:", err);
        }
      }

      setIncomingCall({
        callerId,
        callerInfo: callerInfo || { fullName: "Unknown Lawyer" },
        callType,
      });
    });

    // Call rejected by recipient
    socket.on("callRejected", ({ message }) => {
      console.log("Call was rejected:", message);
      setCallingData({
        isActive: false,
        callType: "voice",
        lawyerId: null,
        callerInfo: null,
        callStatus: "idle",
      });
      Swal.fire({
        icon: "error",
        title: "Call Declined",
        text: message || "The lawyer declined your call.",
        timer: 3000,
        showConfirmButton: false,
      });
    });

    // Call accepted by recipient
    socket.on("callAccepted", ({ accepterId }) => {
      console.log("Call accepted by:", accepterId);
      // Update call status to connected
      setCallingData((prev) => ({
        ...prev,
        callStatus: "connected",
      }));
    });

    // Call ended by other party
    socket.on("callEnded", ({ enderId }) => {
      console.log("Call ended by other party:", enderId);
      setCallingData({
        isActive: false,
        callType: "voice",
        lawyerId: null,
        callerInfo: null,
        callStatus: "idle",
      });
      Swal.fire({
        icon: "info",
        title: "Call Ended",
        text: "The other party has ended the call.",
        timer: 2000,
        showConfirmButton: false,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("onlineLawyersList");
      socket.off("updateOnlineUsers");
      socket.off("incomingCall");
      socket.off("callRejected");
      socket.off("callAccepted");
      socket.off("callEnded");
    };
  }, [userId, chatLawyer]);

  // ✅ Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = userId;
        const res = await api.get(`api/user/get-favorite/${userId}`);

        const favIds = res.data.map((f) => f.lawyerId._id);
        setFavorites(favIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [userId]);

  const handleToggleFavorite = async (lawyerId) => {
    try {
      const res = await api.post("api/user/add-to-favorite", {
        userId: userId,
        lawyerId,
      });

      if (res.data.isFavorite) {
        setFavorites((prev) => [...prev, lawyerId]);
        Swal.fire({
          icon: "success",
          title: "Added to Favorites ❤️",
          text: "This lawyer has been added to your favorites list.",
          showConfirmButton: true,
        });
      } else {
        setFavorites((prev) => prev.filter((id) => id !== lawyerId));
        Swal.fire({
          icon: "info",
          title: "Removed from Favorites 💔",
          text: "This lawyer has been removed from your favorites list.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Unable to update favorite. Please try again later.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const handleSendMessage = (text) => {
    if (!text.trim() || !chatLawyer?._id) return;

    if (containsSensitiveInfo(text)) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed 🚫",
        text: "Sharing mobile numbers or emails is not permitted!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const timestamp = new Date().toISOString();

    socket.emit("privateMessage", {
      toUserId: chatLawyer._id,
      message: text,
      fromUserType: "client",
      timestamp,
    });

    setMessages((prev) => [...prev, { text, isMe: true, timestamp }]);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatLawyer?._id) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/admin/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = res.data.url;
      const fileType = file.type;

      socket.emit("privateMessage", {
        toUserId: chatLawyer._id,
        message: "",
        fileUrl,
        fileName: file.name,
        fileType,
        fromUserType: "client",
      });

      setMessages((prev) => [
        ...prev,
        { text: "", fileUrl, fileName: file.name, fileType, isMe: true },
      ]);
    } catch (err) {
      alert("Upload failed");
    }
    setIsUploading(false);
  };

  const handleOpenChat = async (lawyer) => {
    const isOnline = onlineLawyers.includes(lawyer._id);
    setChatLawyer({ ...lawyer, isOnline });

    const clientId = userId;
    const lawyerId = lawyer._id;

    try {
      const res = await api.get(
        `api/admin/chathistory/${clientId}/${lawyerId}`
      );
      const data = await res.data;

      let formatted = data.map((msg) => ({
        text: msg.message,
        isMe: msg.from === clientId,
        isSystem: false,
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        fileType: msg.fileType,
        timestamp: msg.timestamp,
      }));

      if (formatted.length === 0) {
        const systemMessage = {
          text: `You are now connected to Advocate ${lawyer.firstName} ${
            lawyer.lastName
          } who practices in ${
            Array.isArray(lawyer.practicingcourts)
              ? lawyer.practicingcourts.map((item) => item.label).join(",")
              : "various"
          } Courts and specializes in ${
            Array.isArray(lawyer.specializations)
              ? lawyer.specializations.map((item) => item.label).join(",")
              : lawyer.specializations
          }, With ${
            lawyer.yearsOfExperience
          } of experience. Feel free to share your concern or upload documents securely`,
          isSystem: true,
          isMe: false,
        };
        formatted = [systemMessage];
      }

      setMessages(formatted);
      setMessageMap((prev) => ({ ...prev, [lawyerId]: formatted }));
    } catch (err) {
      console.error("❌ Error fetching chat history:", err);
    }
  };

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

  const [isFlipping, setIsFlipping] = useState(false);

  // ======== Calling Functionality
  const [callingData, setCallingData] = useState({
    isActive: false,
    callType: "voice",
    lawyerId: null,
    callerInfo: null,
    callStatus: "idle", // idle, ringing, connected
  });

  const handleSwapLawyer = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);
      setIsFlipping(true); // Start flip
      const availableOnlineLawyers = lawyers.filter(
        (lawyer) =>
          onlineLawyers.includes(lawyer._id) && lawyer._id !== chatLawyer._id
      );

      if (availableOnlineLawyers.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Other Lawyers Online",
          text: "Sorry, there are no other online lawyers to swap with right now.",
          timer: 2500,
          showConfirmButton: false,
        });
        setIsFlipping(false);
        return;
      }

      const randomIndex = Math.floor(
        Math.random() * availableOnlineLawyers.length
      );
      const newLawyer = availableOnlineLawyers[randomIndex];

      await handleOpenChat(newLawyer);

      // End flip after the second half
      setTimeout(() => setIsFlipping(false), 300); // 300ms for the second half
    }, 2000); // 300ms for the first half
  };

  const handleStartCall = async (lawyerId, callType) => {
    try {
      // Emit call initiation to server
      socket.emit("initiateCall", {
        callerId: userId,
        receiverId: lawyerId,
        callType,
        callerModel: "User",
        receiverModel: "Lawyer",
      });

      setCallingData({
        isActive: true,
        callType,
        lawyerId,
        callerInfo: {
          firstName: chatLawyer.firstName,
          lastName: chatLawyer.lastName,
          profilepic: chatLawyer.profilepic,
        },
        callStatus: "ringing", // Set initial status as ringing
      });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = async () => {
    try {
      // Notify the other party that the call has ended
      if (callingData.lawyerId) {
        socket.emit("endCall", {
          callerId: userId,
          receiverId: callingData.lawyerId,
        });
      }

      setCallingData({
        isActive: false,
        callType: "video",
        lawyerId: null,
        callerInfo: null,
        callStatus: "idle",
      });
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleOpenCallMenu = (event) => {
    setCallMenuAnchor(event.currentTarget);
  };

  const handleCloseCallMenu = () => {
    setCallMenuAnchor(null);
  };

  const handleCallOptionSelect = (callType) => {
    handleStartCall(chatLawyer._id, callType);
    handleCloseCallMenu();
  };

  // Handle incoming call acceptance
  const handleAcceptCall = () => {
    if (!incomingCall) return;

    // Emit call acceptance
    socket.emit("acceptCall", {
      callerId: incomingCall.callerId,
      accepterId: userId,
    });

    // Start the call - when accepting, it's immediately connected
    setCallingData({
      isActive: true,
      callType: incomingCall.callType,
      lawyerId: incomingCall.callerId,
      callerInfo: incomingCall.callerInfo,
      callStatus: "connected", // Incoming calls are immediately connected when accepted
    });

    // Clear incoming call
    setIncomingCall(null);
  };

  // Handle incoming call rejection
  const handleRejectCall = () => {
    if (!incomingCall) return;

    // Emit call rejection
    socket.emit("rejectCall", {
      callerId: incomingCall.callerId,
      rejecterId: userId,
      message: "Call was declined",
    });

    // Clear incoming call
    setIncomingCall(null);

    Swal.fire({
      icon: "info",
      title: "Call Declined",
      text: "You declined the call.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Section */}
      <Card
        sx={{
          mb: 4,
          maxWidth: 800,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
            🔎 Find a Lawyer
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <FormControl sx={{ flex: { xs: "1 1 100%", sm: "1 1 180px" } }}>
              <Select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                displayEmpty
                size="medium"
              >
                {SPECIALIZATIONS.map((spec) => (
                  <MuiMenuItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: { xs: "1 1 100%", sm: "1 1 180px" } }}>
              <Select
                value={state}
                onChange={(e) => setState(e.target.value)}
                displayEmpty
                size="medium"
              >
                {STATES.map((st) => (
                  <MuiMenuItem key={st.value} value={st.value}>
                    {st.label}
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={filterLawyersAndChat}
              startIcon={<SearchIcon />}
              sx={{ flex: { xs: "1 1 100%", sm: "1 1 120px" }, minWidth: 120 }}
            >
              Chat Now
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Recent Chat Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          Recent Chats
        </Typography>
        <Grid container spacing={3}>
          {uniqueChats.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                No recent chats found.
              </Typography>
            </Grid>
          ) : (
            uniqueChats.map((chat) => {
              const lawyer = getLawyerById(chat.to);
              const isOnline = onlineLawyers.includes(chat.to);
              if (!lawyer) return null;

              return (
                <Grid item xs={12} sm={6} md={4} key={chat._id}>
                  <Card
                    sx={{
                      position: "relative",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        p: 3,
                      }}
                    >
                      {/* Favorite Icon */}
                      <IconButton
                        onClick={() => handleToggleFavorite(lawyer._id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          p: 0.5,
                        }}
                        title={
                          favorites.includes(lawyer._id)
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                      >
                        {favorites.includes(lawyer._id) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>

                      <Avatar
                        src={lawyer.profilepic}
                        alt="Lawyer"
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 2,
                          border: 3,
                          borderColor: "primary.main",
                        }}
                      />

                      <Typography variant="h6" gutterBottom fontWeight="600">
                        {lawyer.firstName} {lawyer.lastName}
                      </Typography>

                      <Chip
                        label={isOnline ? "Online" : "Offline"}
                        color={isOnline ? "success" : "error"}
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      <Box sx={{ mb: 2, textAlign: "left" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>Specialization:</strong>{" "}
                          {Array.isArray(lawyer.specializations)
                            ? lawyer.specializations
                                .map((spec) => spec.label)
                                .join(", ")
                            : lawyer.specializations?.label ||
                              lawyer.specializations ||
                              ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Experience:</strong>{" "}
                          {lawyer.yearsOfExperience} years
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          textAlign: "left",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        <strong>Last Message:</strong> {chat.message}
                      </Typography>

                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ChatIcon />}
                        onClick={() => handleOpenChat(lawyer)}
                        fullWidth
                      >
                        Chat
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>

      {/* Chat Popup */}
      {chatLawyer && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: { xs: "calc(100vw - 20px)", sm: 380 },
            height: { xs: "calc(100vh - 100px)", sm: 500 },
            borderRadius: { xs: 0, sm: 2 },
            overflow: "hidden",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            transform: isFlipping ? "rotateY(180deg)" : "none",
            transition: "transform 0.3s",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={chatLawyer.profilepic}
                alt="profile"
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid white",
                }}
              />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {chatLawyer.firstName} {chatLawyer.lastName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {chatLawyer.isOnline ? "🟢 Online" : "🔴 Offline"}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={handleOpenCallMenu}
                aria-controls="call-menu"
                aria-haspopup="true"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                <Call sx={{ fontSize: 18 }} />
                <ArrowDropDown sx={{ fontSize: 16, ml: 0.5 }} />
              </IconButton>
              <Menu
                id="call-menu"
                anchorEl={callMenuAnchor}
                open={Boolean(callMenuAnchor)}
                onClose={handleCloseCallMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleCallOptionSelect("voice")}>
                  <Call sx={{ fontSize: 18, mr: 1.5 }} />
                  Voice Call
                </MenuItem>
                <MenuItem onClick={() => handleCallOptionSelect("video")}>
                  <VideoCall sx={{ fontSize: 18, mr: 1.5 }} />
                  Video Call
                </MenuItem>
              </Menu>

              <Button
                size="small"
                onClick={handleSwapLawyer}
                title="Switch Lawyer"
                startIcon={<SwapHoriz />}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  fontSize: "12px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Switch
              </Button>

              <IconButton
                size="small"
                onClick={() => setChatLawyer(null)}
                title="Close Chat"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "error.main",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              backgroundColor: "grey.50",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  maxWidth: "80%",
                  alignSelf: msg.isMe
                    ? "flex-end"
                    : msg.isSystem
                    ? "center"
                    : "flex-start",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    ...(msg.isMe && {
                      backgroundColor: "primary.main",
                      color: "white",
                    }),
                    ...(msg.isSystem && {
                      backgroundColor: "info.lighter",
                      color: "info.dark",
                      textAlign: "center",
                      fontStyle: "italic",
                    }),
                    ...(!msg.isMe &&
                      !msg.isSystem && {
                        backgroundColor: "white",
                        border: 1,
                        borderColor: "divider",
                      }),
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  {msg.fileUrl &&
                    (msg.fileType && msg.fileType.startsWith("image/") ? (
                      <Box
                        component="img"
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        sx={{ maxWidth: 150, maxHeight: 150, mt: 1 }}
                      />
                    ) : (
                      <Typography
                        component="a"
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{ display: "block", mt: 1 }}
                      >
                        📄 {msg.fileName}
                      </Typography>
                    ))}
                  {msg.timestamp && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.7,
                        textAlign: msg.isMe ? "right" : "left",
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Chat Input */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "white",
            }}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={() => fileInputRef.current.click()}
                title="Attach Document"
                disabled={isUploading}
              >
                <HiOutlinePaperClip size={20} />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    handleSendMessage(message.trim());
                    setMessage("");
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={() => {
                  if (message.trim()) {
                    handleSendMessage(message.trim());
                    setMessage("");
                  }
                }}
                title="Send"
              >
                <IoSend size={20} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Calling Screen */}
      {callingData.isActive && (
        <CallScreen
          userId={userId}
          callerId={callingData.lawyerId}
          callerInfo={callingData.callerInfo}
          callType={callingData.callType}
          callDirection="outgoing"
          callStatus={callingData.callStatus}
          onCallEnded={handleEndCall}
          screen="client"
        />
      )}

      {/* Incoming Call Screen */}
      {incomingCall && (
        <IncomingCallScreen
          callerInfo={incomingCall.callerInfo}
          callType={incomingCall.callType}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          userType="client"
        />
      )}

      {/* Loading Backdrop */}
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h6" fontWeight="600" color="primary">
            Connecting you to a lawyer...
          </Typography>
        </Paper>
      </Backdrop>
    </Container>
  );
}

export default Findalawyer;
