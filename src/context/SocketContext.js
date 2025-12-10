import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { APP_CONFIG } from "../_constants/config";
import { useSelector } from "react-redux";
import { selectUser, selectUserRole } from "../redux/slices/authSlice";
import Swal from "sweetalert2";
import api from "../api";
import IncomingCallScreen from "../_modules/calling/IncomingCallScreen";
import CallScreen from "../_modules/calling/CallScreen";
import { Backdrop, CircularProgress, Paper, Typography } from "@mui/material";

// Create the context
const SocketContext = createContext(null);

// Socket instance (singleton)
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(APP_CONFIG.SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
};

/**
 * SocketProvider - Centralized socket management for the application
 * Handles connection, disconnection, and common socket events
 */
export const SocketProvider = ({ children }) => {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const userId = user?._id;

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // Online users state
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [onlineClients, setOnlineClients] = useState([]);

  // Calling state
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState({
    isActive: false,
    callType: "voice",
    peerId: null,
    peerInfo: null,
    callStatus: "idle", // idle, ringing, connected
    callDirection: null, // incoming, outgoing
  });

  // Message handlers ref (for external components to register)
  const messageHandlersRef = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const socketIO = getSocket();
    setSocket(socketIO);

    // Connect if not already connected
    if (!socketIO.connected) {
      socketIO.connect();
    }

    // Connection event handlers
    const handleConnect = () => {
      console.log("✅ Socket connected:", socketIO.id);
      setIsConnected(true);

      // Emit online status based on user role
      if (userRole === "lawyer") {
        socketIO.emit("lawyerOnline", userId);
      } else {
        socketIO.emit("clientOnline", userId);
      }

      // Request online users list
      socketIO.emit("getOnlineLawyers");
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    };

    // Online users handlers
    const handleOnlineLawyersList = (ids) => {
      console.log("📋 Online lawyers:", ids);
      setOnlineLawyers(ids);
    };

    const handleUpdateOnlineUsers = (ids) => {
      setOnlineLawyers(ids);
    };

    const handleOnlineClientsList = (ids) => {
      console.log("📋 Online clients:", ids);
      setOnlineClients(ids);
    };

    // Message handler
    const handleReceiveMessage = (data) => {
      // Notify all registered message handlers
      messageHandlersRef.current.forEach((handler) => {
        handler(data);
      });
    };

    // Call handlers
    const handleIncomingCall = async ({ callerId, callType, callerModel }) => {
      console.log("📞 Incoming call from:", callerId, callType, callerModel);

      // Fetch caller info
      let callerInfo = null;
      try {
        if (callerModel === "Lawyer") {
          const res = await api.get(`/api/lawyer/getlawyer/${callerId}`);
          callerInfo = res.data;
        } else {
          const res = await api.get(`/api/user/getuser/${callerId}`);
          callerInfo = res.data;
        }
      } catch (err) {
        console.error("Failed to fetch caller info:", err);
      }

      setIncomingCall({
        callerId,
        callerInfo: callerInfo || { fullName: "Unknown" },
        callType,
        callerModel,
      });
    };

    const handleCallRejected = ({ message }) => {
      console.log("📞 Call rejected:", message);
      setActiveCall({
        isActive: false,
        callType: "voice",
        peerId: null,
        peerInfo: null,
        callStatus: "idle",
        callDirection: null,
      });
      Swal.fire({
        icon: "error",
        title: "Call Declined",
        text: message || "The call was declined.",
        timer: 3000,
        showConfirmButton: false,
      });
    };

    const handleCallAccepted = ({ accepterId }) => {
      console.log("📞 Call accepted by:", accepterId);
      setActiveCall((prev) => ({
        ...prev,
        callStatus: "connected",
      }));
    };

    const handleCallEnded = ({ enderId }) => {
      console.log("📞 Call ended by:", enderId);
      setActiveCall({
        isActive: false,
        callType: "voice",
        peerId: null,
        peerInfo: null,
        callStatus: "idle",
        callDirection: null,
      });
      Swal.fire({
        icon: "info",
        title: "Call Ended",
        text: "The call has ended.",
        timer: 2000,
        showConfirmButton: false,
      });
    };

    // Register event listeners
    socketIO.on("connect", handleConnect);
    socketIO.on("disconnect", handleDisconnect);
    socketIO.on("connect_error", handleConnectError);
    socketIO.on("onlineLawyersList", handleOnlineLawyersList);
    socketIO.on("updateOnlineUsers", handleUpdateOnlineUsers);
    socketIO.on("onlineClientsList", handleOnlineClientsList);
    socketIO.on("receiveMessage", handleReceiveMessage);
    socketIO.on("incomingCall", handleIncomingCall);
    socketIO.on("callRejected", handleCallRejected);
    socketIO.on("callAccepted", handleCallAccepted);
    socketIO.on("callEnded", handleCallEnded);

    // Cleanup on unmount or user change
    return () => {
      socketIO.off("connect", handleConnect);
      socketIO.off("disconnect", handleDisconnect);
      socketIO.off("connect_error", handleConnectError);
      socketIO.off("onlineLawyersList", handleOnlineLawyersList);
      socketIO.off("updateOnlineUsers", handleUpdateOnlineUsers);
      socketIO.off("onlineClientsList", handleOnlineClientsList);
      socketIO.off("receiveMessage", handleReceiveMessage);
      socketIO.off("incomingCall", handleIncomingCall);
      socketIO.off("callRejected", handleCallRejected);
      socketIO.off("callAccepted", handleCallAccepted);
      socketIO.off("callEnded", handleCallEnded);
    };
  }, [userId, userRole]);

  // Disconnect when user logs out
  useEffect(() => {
    if (!userId && socket?.connected) {
      socket.disconnect();
      setIsConnected(false);
      setOnlineLawyers([]);
      setOnlineClients([]);
    }
  }, [userId, socket]);

  // ==================== MESSAGING METHODS ====================

  /**
   * Send a private message to another user
   */
  const sendMessage = useCallback(
    ({ toUserId, message, fileUrl, fileName, fileType }) => {
      if (!socket?.connected || !toUserId) return false;

      const timestamp = new Date().toISOString();
      const fromUserType = userRole === "lawyer" ? "lawyer" : "client";

      socket.emit("privateMessage", {
        toUserId,
        message: message || "",
        fileUrl,
        fileName,
        fileType,
        fromUserType,
        timestamp,
      });

      return true;
    },
    [socket, userRole]
  );

  /**
   * Register a message handler (for components that need to receive messages)
   */
  const registerMessageHandler = useCallback((id, handler) => {
    messageHandlersRef.current.set(id, handler);
    return () => messageHandlersRef.current.delete(id);
  }, []);

  // ==================== CALLING METHODS ====================

  /**
   * Initiate a call to another user
   */
  const initiateCall = useCallback(
    (receiverId, callType, peerInfo) => {
      if (!socket?.connected || !receiverId) return false;

      const callerModel = userRole === "lawyer" ? "Lawyer" : "User";
      const receiverModel = userRole === "lawyer" ? "User" : "Lawyer";

      socket.emit("initiateCall", {
        callerId: userId,
        receiverId,
        callType,
        callerModel,
        receiverModel,
      });

      setActiveCall({
        isActive: true,
        callType,
        peerId: receiverId,
        peerInfo,
        callStatus: "ringing",
        callDirection: "outgoing",
      });

      return true;
    },
    [socket, userId, userRole]
  );

  /**
   * Accept an incoming call
   */
  const acceptCall = useCallback(() => {
    if (!socket?.connected || !incomingCall) return false;

    socket.emit("acceptCall", {
      callerId: incomingCall.callerId,
      accepterId: userId,
    });

    setActiveCall({
      isActive: true,
      callType: incomingCall.callType,
      peerId: incomingCall.callerId,
      peerInfo: incomingCall.callerInfo,
      callStatus: "connected",
      callDirection: "incoming",
    });

    setIncomingCall(null);
    return true;
  }, [socket, userId, incomingCall]);

  /**
   * Reject an incoming call
   */
  const rejectCall = useCallback(() => {
    if (!socket?.connected || !incomingCall) return false;

    socket.emit("rejectCall", {
      callerId: incomingCall.callerId,
      rejecterId: userId,
      message: "Call was declined",
    });

    setIncomingCall(null);

    Swal.fire({
      icon: "info",
      title: "Call Declined",
      text: "You declined the call.",
      timer: 2000,
      showConfirmButton: false,
    });

    return true;
  }, [socket, userId, incomingCall]);

  /**
   * End the current active call
   */
  const endCall = useCallback(() => {
    if (!socket?.connected || !activeCall.peerId) return false;

    socket.emit("endCall", {
      callerId: userId,
      receiverId: activeCall.peerId,
    });

    setActiveCall({
      isActive: false,
      callType: "voice",
      peerId: null,
      peerInfo: null,
      callStatus: "idle",
      callDirection: null,
    });

    return true;
  }, [socket, userId, activeCall.peerId]);

  // ==================== UTILITY METHODS ====================

  /**
   * Check if a specific user is online
   */
  const isUserOnline = useCallback(
    (targetUserId, role = "lawyer") => {
      if (role === "lawyer") {
        return onlineLawyers.includes(targetUserId);
      }
      return onlineClients.includes(targetUserId);
    },
    [onlineLawyers, onlineClients]
  );

  /**
   * Manually refresh online users list
   */
  const refreshOnlineUsers = useCallback(() => {
    if (!socket?.connected) return;
    socket.emit("getOnlineLawyers");
  }, [socket]);

  /**
   * Emit a custom event
   */
  const emit = useCallback(
    (event, data) => {
      if (!socket?.connected) return false;
      socket.emit(event, data);
      return true;
    },
    [socket]
  );

  /**
   * Subscribe to a custom event
   */
  const on = useCallback(
    (event, handler) => {
      if (!socket) return () => {};
      socket.on(event, handler);
      return () => socket.off(event, handler);
    },
    [socket]
  );

  // Context value
  const value = {
    // Connection state
    socket,
    isConnected,

    // Online users
    onlineLawyers,
    onlineClients,
    isUserOnline,
    refreshOnlineUsers,

    // Messaging
    sendMessage,
    registerMessageHandler,

    // Calling
    incomingCall,
    activeCall,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,

    // Utilities
    emit,
    on,
  };

  console.log("socket", value);

  return (
    <SocketContext.Provider value={value}>
      {children}

      {/* Calling UI */}

      {/* Calling Screen */}
      {activeCall.isActive && (
        <CallScreen
          userId={userId}
          callerId={activeCall.peerId}
          callerInfo={activeCall.peerInfo}
          callType={activeCall.callType}
          callDirection="outgoing"
          callStatus={activeCall.callStatus}
          onCallEnded={endCall}
          screen={userRole}
        />
      )}

      {/* Incoming Call Screen */}
      {incomingCall && (
        <IncomingCallScreen
          callerInfo={incomingCall.callerInfo}
          callType={incomingCall.callType}
          onAccept={acceptCall}
          onReject={rejectCall}
          userType={userRole}
        />
      )}

      {/* Loading Backdrop */}
      <Backdrop
        open={activeCall.isActive}
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
    </SocketContext.Provider>
  );
};

/**
 * Custom hook to use socket context
 * @returns {Object} Socket context value
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
