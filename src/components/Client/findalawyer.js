import React, { useState, useEffect, useRef } from "react";
import Clientsidebar from "../clientsidebar";
import socket from "../socket";
import Swal from "sweetalert2";
import api from "../../api";
import Header from "../Layout/header";
import { HiOutlinePaperClip } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import "../Client/css/client_chat_history.css";
import { IconButton, Stack, Menu, MenuItem } from "@mui/material";
import { Call, VideoCall, ArrowDropDown, Close } from "@mui/icons-material";
import CallScreen from "../../_modules/calling/CallScreen";
import IncomingCallScreen from "../../_modules/calling/IncomingCallScreen";

function Findalawyer() {
  const [isLoading, setIsLoading] = useState(false);

  const [specialization, setSpecialization] = useState("");
  const [state, setState] = useState("");
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const fetchChatHistory = async () => {
    try {
      const res = await api.get("api/admin/chathistory");
      const result = res.data;
      const clientChats = result.filter(
        (chat) => chat.from === userData.user._id && chat.fromModel === "User"
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

  const iconStyle = { width: 22, height: 22, verticalAlign: "middle" };

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
    if (!userData.user._id) return;

    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected (client):", socket.id);
      socket.emit("clientOnline", userData.user._id);
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
  }, [userData.user._id, chatLawyer]);

  // ✅ Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = userData.user._id;
        const res = await api.get(`api/user/get-favorite/${userId}`);

        const favIds = res.data.map((f) => f.lawyerId._id);
        setFavorites(favIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [userData.user._id]);

  const handleToggleFavorite = async (lawyerId) => {
    try {
      const res = await api.post("api/user/add-to-favorite", {
        userId: userData.user._id,
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

    const clientId = userData.user._id;
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
        callerId: userData.user._id,
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
          callerId: userData.user._id,
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
      accepterId: userData.user._id,
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
      rejecterId: userData.user._id,
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
    <div>
      <style>{`

  .lawyers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .lawyer-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .lawyer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
          background: white;
        }

        .lawyer-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #3b82f6;
          margin: 0 auto 1rem;
        }

        .lawyer-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .lawyer-status {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .lawyer-details {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .lawyer-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }

        .action-btn {
          background: white;
          color:blue;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }
        .chat-popup {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.sent {
          align-self: flex-end;
          background: #3b82f6;
          color: white;
        }

        .message.received {
          align-self: flex-start;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .message.system {
          align-self: center;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          text-align: center;
          font-style: italic;
        }

        .chat-input {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .chat-input input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .chat-input input:focus {
          border-color: #3b82f6;
        }

        .findlawyer {
  padding: 32px 40px;
  background: linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(60, 80, 180, 0.08);
  margin: 32px 0;
  max-width: 800px;
  margin-left: 0;
  margin-right: auto;
  position: relative;
  overflow: hidden;
}
  .findlawyer-glass {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(6px);
  border-radius: inherit;
  z-index: 0;
}

.findlawyer-title {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  color: #2d3a5c;
  letter-spacing: 1px;
}

.findlawyer-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

.findlawyer-select {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #b6c2e2;
  min-width: 180px;
  background: #fff;
  font-size: 16px;
  color: #243056;
  box-shadow: 0 2px 8px 0 rgba(80,120,220,0.06);
  transition: border 0.2s;
  flex: 1 1 180px;
}

.findlawyer-btn {
  padding: 12px 32px;
  border-radius: 10px;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(80,120,220,0.10);
  cursor: pointer;
  letter-spacing: 1px;
  transition: background 0.2s, transform 0.1s;
  flex: 1 1 120px;
  min-width: 120px;
}
  @media (max-width: 700px) {
  .findlawyer {
    padding: 20px 10px;
    border-radius: 12px;
    max-width: 98vw;
  }
  .findlawyer-controls {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  .findlawyer-select, .findlawyer-btn {

      padding: 4px 8px;   
    font-size: 14px;  
    border-radius: 6px;
    height: 32px;         
    min-height: 32px;
    max-height: 36px;
    box-sizing: border-box;
  }
  .findlawyer-title {
    font-size: 1.1rem;
    margin-bottom: 18px;
  }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .time-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .lawyers-grid {
            grid-template-columns: 1fr;
          }

          .chat-popup {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
              @media (max-width: 1024px) {
    .lawyers-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .chat-popup {
      width: 320px;
      height: 450px;
    }
  }

  @media (max-width: 480px) {
  .main1{
      margin-left:0px
      }
    .lawyers-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .chat-popup {
      width: 100vw;
      height: 100vh;
      bottom: 0;
      right: 0;
      left: 0;
      border-radius: 0;
    }
    .chat-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .chat-input input {
      font-size: 1rem;
    }
    select {
      min-width: 100% !important;
    }
    .action-btn {
      width: 100%;
      justify-content: center;
    }
    .main1 > div {
      padding: 20px 16px !important;
    }
      
        
      `}</style>

      {/* Search Section */}
      <main className="main1">
        <div className="findlawyer">
          <div className="findlawyer-glass" />
          <h2 className="findlawyer-title">🔎 Find a Lawyer</h2>
          <div className="findlawyer-controls">
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="findlawyer-select"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="findlawyer-select"
            >
              {STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <button
              className="action-btn findlawyer-btn"
              title="Chat Now"
              onClick={filterLawyersAndChat}
            >
              Chat Now
            </button>
          </div>
        </div>

        {/* Recent Chat Section */}
        <div
          className="recent-chat"
          style={{ padding: "32px", background: "#fff" }}
        >
          <h2 style={{ marginBottom: 16 }}> Recent Chats</h2>
          <div className="lawyers-grid">
            {uniqueChats.length === 0 ? (
              <div>No recent chats found.</div>
            ) : (
              uniqueChats.map((chat, idx) => {
                const lawyer = getLawyerById(chat.to);
                const isOnline = onlineLawyers.includes(chat.to);
                if (!lawyer) return null; // Skip if lawyer data not found

                return (
                  <div key={chat._id} className="lawyer-card">
                    {/* Favorite Icon (top-right corner) */}
                    <button
                      className="favorite-always-btn"
                      onClick={() => handleToggleFavorite(lawyer._id)}
                      title={
                        favorites.includes(lawyer._id)
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    >
                      <span
                        style={{
                          color: favorites.includes(lawyer._id)
                            ? "red"
                            : "#bbb",
                          fontSize: "20px",
                        }}
                      >
                        {favorites.includes(lawyer._id) ? "❤️" : "🤍"}
                      </span>
                    </button>

                    <img
                      src={lawyer.profilepic}
                      alt="Lawyer"
                      className="lawyer-avatar"
                    />
                    <div className="lawyer-name">
                      {lawyer.firstName} {lawyer.lastName}
                    </div>
                    <div className="lawyer-status">
                      <span style={{ color: isOnline ? "#10b981" : "#ef4444" }}>
                        {isOnline ? "🟢 Online" : "🔴 Offline"}
                      </span>
                    </div>
                    <div className="lawyer-details">
                      <div>
                        <strong>Specialization:</strong>{" "}
                        {Array.isArray(lawyer.specializations)
                          ? lawyer.specializations
                              .map((spec) => spec.label)
                              .join(", ")
                          : lawyer.specializations?.label ||
                            lawyer.specializations ||
                            ""}
                      </div>
                      <div>
                        <strong>Experience:</strong> {lawyer.yearsOfExperience}{" "}
                        years
                      </div>
                    </div>
                    <div className="chat-message">
                      <strong>Last Message:</strong> {chat.message}
                    </div>
                    <div className="lawyer-actions">
                      <button
                        className="action-btn"
                        title="Chat"
                        onClick={() => handleOpenChat(lawyer)}
                      >
                        💬 Chat
                      </button>
                      {/*<button
              className="action-btn"
              title="WhatsApp"
              onClick={() =>
                window.open(`https://wa.me/${lawyer.mobile || ''}`, '_blank')
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                style={{ width: 22, height: 22, verticalAlign: 'middle' }}
              />
            </button>*/}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ==============chat popup ===========================================*/}

        {chatLawyer && (
          <div className={`chat-popup${isFlipping ? " flip" : ""}`}>
            <div className="chat-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={chatLawyer.profilepic}
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid white",
                  }}
                />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {chatLawyer.firstName} {chatLawyer.lastName}
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.9 }}>
                    {chatLawyer.isOnline ? "🟢 Online" : "🔴 Offline"}
                  </div>
                </div>
              </div>
              <div className="header-actions">
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
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <Call sx={{ fontSize: 18 }} />
                    <ArrowDropDown sx={{ fontSize: 16, marginLeft: "2px" }} />
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
                    PaperProps={{
                      sx: {
                        marginTop: "8px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        minWidth: "180px",
                        overflow: "visible",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          backgroundColor: "white",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                          borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
                          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => handleCallOptionSelect("voice")}
                      sx={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1f2937",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f0f9ff",
                          color: "#3b82f6",
                          "& .MuiSvgIcon-root": {
                            color: "#3b82f6",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <Call
                        sx={{
                          fontSize: 18,
                          marginRight: "12px",
                          color: "#6b7280",
                          transition: "all 0.2s ease",
                        }}
                      />
                      Voice Call
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleCallOptionSelect("video")}
                      sx={{
                        padding: "12px 20px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1f2937",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f0fdf4",
                          color: "#10b981",
                          "& .MuiSvgIcon-root": {
                            color: "#10b981",
                            transform: "scale(1.1)",
                          },
                        },
                      }}
                    >
                      <VideoCall
                        sx={{
                          fontSize: 18,
                          marginRight: "12px",
                          color: "#6b7280",
                          transition: "all 0.2s ease",
                        }}
                      />
                      Video Call
                    </MenuItem>
                  </Menu>
                  <IconButton
                    size="small"
                    onClick={handleSwapLawyer}
                    title="Switch Lawyer"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    Switch
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setChatLawyer(null)}
                    title="Close Chat"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      padding: "8px",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                      },
                      "&:active": {
                        transform: "translateY(0px)",
                      },
                    }}
                  >
                    <Close sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.isMe ? "sent" : msg.isSystem ? "system" : "received"
                  }`}
                >
                  {msg.text}
                  {msg.fileUrl &&
                    (msg.fileType && msg.fileType.startsWith("image/") ? (
                      <img
                        src={msg.fileUrl}
                        alt={msg.fileName}
                        style={{ maxWidth: 150, maxHeight: 150 }}
                      />
                    ) : (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📄 {msg.fileName}
                      </a>
                    ))}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "black",
                      marginTop: "2px",
                      textAlign: msg.isMe ? "right" : "left",
                    }}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : ""}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleSendMessage(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="actionbutton"
                type="button"
                onClick={() => {
                  handleSendMessage(message);
                  setMessage("");
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "92%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#54656f",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: 0,
                  margin: 0,
                }}
                title="Send"
                tabIndex={-1}
              >
                <IoSend />
              </button>

              <button
                className="actionbutton"
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "absolute",
                  right: "20%",
                  top: "92%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "gray",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: 0,
                  margin: 0,
                }}
                title="Attach Document"
                tabIndex={-1}
              >
                <HiOutlinePaperClip />
              </button>
            </div>
          </div>
        )}

        {callingData.isActive && (
          <CallScreen
            userId={userData.user._id}
            callerId={callingData.lawyerId}
            callerInfo={callingData.callerInfo}
            callType={callingData.callType}
            callDirection="outgoing"
            callStatus={callingData.callStatus}
            onCallEnded={handleEndCall}
            screen="client"
          />
        )}

        {incomingCall && (
          <IncomingCallScreen
            callerInfo={incomingCall.callerInfo}
            callType={incomingCall.callType}
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
            userType="client"
          />
        )}
      </main>

      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "40px 60px",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(80,120,220,0.10)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: "6px solid #e0e7ff",
                borderTop: "6px solid #6366f1",
                borderRadius: "50%",
                width: 60,
                height: 60,
                animation: "spin 1s linear infinite",
                marginBottom: 16,
              }}
            />
            <span style={{ color: "#6366f1", fontSize: 18, fontWeight: 600 }}>
              Connecting you to a lawyer...
            </span>
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
            </style>
          </div>
        </div>
      )}
    </div>
  );
}

export default Findalawyer;
