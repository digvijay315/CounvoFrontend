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
import IncomingChatRequest from "../_modules/chat/IncomingChatRequest";
import { Backdrop, CircularProgress, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Socket Event Constants
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // Online status events
  LAWYER_ONLINE: "lawyerOnline",
  CLIENT_ONLINE: "clientOnline",
  GET_ONLINE_LAWYERS: "getOnlineLawyers",
  ONLINE_LAWYERS_LIST: "onlineLawyersList",
  ONLINE_CLIENTS_LIST: "onlineClientsList",
  UPDATE_ONLINE_USERS: "updateOnlineUsers",

  // Messaging events
  PRIVATE_MESSAGE: "privateMessage",
  RECEIVE_MESSAGE: "receiveMessage",

  // Calling events
  INITIATE_CALL: "initiateCall",
  INCOMING_CALL: "incomingCall",
  ACCEPT_CALL: "acceptCall",
  REJECT_CALL: "rejectCall",
  CALL_ACCEPTED: "callAccepted",
  CALL_REJECTED: "callRejected",
  END_CALL: "endCall",
  CALL_ENDED: "callEnded",
  MARK_MESSAGES_READ: "markMessagesRead",

  // Chat Request events
  INITIATE_CHAT_REQUEST: "initiateChatRequest",
  INCOMING_CHAT_REQUEST: "incomingChatRequest",
  ACCEPT_CHAT_REQUEST: "acceptChatRequest",
  REJECT_CHAT_REQUEST: "rejectChatRequest",
  CHAT_REQUEST_TIMEOUT: "chatRequestTimeout",
  CHAT_REQUEST_ACCEPTED: "chatRequestAccepted",
  CHAT_REQUEST_REJECTED: "chatRequestRejected",
  CHAT_REQUEST_NOT_ACCEPTED: "chatRequestNotAccepted",
};

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

  // Chat request state (for lawyers receiving requests)
  const [incomingChatRequest, setIncomingChatRequest] = useState(null);
  // Chat request state (for clients waiting for response)
  const [pendingChatRequest, setPendingChatRequest] = useState(null);

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
        socketIO.emit(SOCKET_EVENTS.LAWYER_ONLINE, userId);
      } else {
        socketIO.emit(SOCKET_EVENTS.CLIENT_ONLINE, userId);
      }

      // Request online users list
      socketIO.emit(SOCKET_EVENTS.GET_ONLINE_LAWYERS);
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
        const res = await api.get(`/api/v2/user/byId/${callerId}`);
        if(res.data.success){
          callerInfo = res.data?.user;
        } else {
          callerInfo = null;
        }
      } catch (err) {
        console.error("Failed to fetch caller info:", err);
      }

      setIncomingCall({
        callerId,
        callerInfo: callerInfo,
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

    // Chat request handlers
    const handleIncomingChatRequest = ({ clientId, clientInfo }) => {
      console.log("💬 Incoming chat request from:", clientId);
      setIncomingChatRequest({
        clientId,
        clientInfo,
      });
    };

    const handleChatRequestAccepted = ({ lawyerId, chatGroupId }) => {
      console.log("✅ Chat request accepted by lawyer:", lawyerId);
      setPendingChatRequest(null);
      // Navigate to chat - will be handled by the component
      window.dispatchEvent(
        new CustomEvent("chatRequestAccepted", { detail: { lawyerId, chatGroupId } })
      );
    };

    const handleChatRequestRejected = ({ lawyerId, message }) => {
      console.log("❌ Chat request rejected:", message);
      setPendingChatRequest(null);
      window.dispatchEvent(
        new CustomEvent("chatRequestRejected", { detail: { lawyerId, message } })
      );
    };

    const handleChatRequestNotAccepted = ({ lawyerId, message }) => {
      console.log("⏱️ Chat request not accepted:", message);
      setPendingChatRequest(null);
      window.dispatchEvent(
        new CustomEvent("chatRequestNotAccepted", { detail: { lawyerId, message } })
      );
    };

    // Register event listeners
    socketIO.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socketIO.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socketIO.on(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
    socketIO.on(SOCKET_EVENTS.ONLINE_LAWYERS_LIST, handleOnlineLawyersList);
    socketIO.on(SOCKET_EVENTS.UPDATE_ONLINE_USERS, handleUpdateOnlineUsers);
    socketIO.on(SOCKET_EVENTS.ONLINE_CLIENTS_LIST, handleOnlineClientsList);
    socketIO.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
    socketIO.on(SOCKET_EVENTS.INCOMING_CALL, handleIncomingCall);
    socketIO.on(SOCKET_EVENTS.CALL_REJECTED, handleCallRejected);
    socketIO.on(SOCKET_EVENTS.CALL_ACCEPTED, handleCallAccepted);
    socketIO.on(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
    socketIO.on(SOCKET_EVENTS.INCOMING_CHAT_REQUEST, handleIncomingChatRequest);
    socketIO.on(SOCKET_EVENTS.CHAT_REQUEST_ACCEPTED, handleChatRequestAccepted);
    socketIO.on(SOCKET_EVENTS.CHAT_REQUEST_REJECTED, handleChatRequestRejected);
    socketIO.on(SOCKET_EVENTS.CHAT_REQUEST_NOT_ACCEPTED, handleChatRequestNotAccepted);

    // Cleanup on unmount or user change
    return () => {
      socketIO.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socketIO.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socketIO.off(SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
      socketIO.off(SOCKET_EVENTS.ONLINE_LAWYERS_LIST, handleOnlineLawyersList);
      socketIO.off(SOCKET_EVENTS.UPDATE_ONLINE_USERS, handleUpdateOnlineUsers);
      socketIO.off(SOCKET_EVENTS.ONLINE_CLIENTS_LIST, handleOnlineClientsList);
      socketIO.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage);
      socketIO.off(SOCKET_EVENTS.INCOMING_CALL, handleIncomingCall);
      socketIO.off(SOCKET_EVENTS.CALL_REJECTED, handleCallRejected);
      socketIO.off(SOCKET_EVENTS.CALL_ACCEPTED, handleCallAccepted);
      socketIO.off(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
      socketIO.off(SOCKET_EVENTS.INCOMING_CHAT_REQUEST, handleIncomingChatRequest);
      socketIO.off(SOCKET_EVENTS.CHAT_REQUEST_ACCEPTED, handleChatRequestAccepted);
      socketIO.off(SOCKET_EVENTS.CHAT_REQUEST_REJECTED, handleChatRequestRejected);
      socketIO.off(SOCKET_EVENTS.CHAT_REQUEST_NOT_ACCEPTED, handleChatRequestNotAccepted);
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

      socket.emit(SOCKET_EVENTS.PRIVATE_MESSAGE, {
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

      socket.emit(SOCKET_EVENTS.INITIATE_CALL, {
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

    socket.emit(SOCKET_EVENTS.ACCEPT_CALL, {
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

    socket.emit(SOCKET_EVENTS.REJECT_CALL, {
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

    socket.emit(SOCKET_EVENTS.END_CALL, {
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

  // ==================== CHAT REQUEST METHODS ====================

  /**
   * Initiate a chat request to a lawyer (for clients)
   */
  const initiateChatRequest = useCallback(
    (lawyerId, clientInfo) => {
      if (!socket?.connected || !lawyerId) return false;

      socket.emit(SOCKET_EVENTS.INITIATE_CHAT_REQUEST, {
        clientId: userId,
        lawyerId,
        clientInfo,
      });

      setPendingChatRequest({
        lawyerId,
        status: "pending",
      });

      return true;
    },
    [socket, userId]
  );

  /**
   * Accept an incoming chat request (for lawyers)
   */
  const acceptChatRequest = useCallback(
    async (chatGroupId) => {
      if (!socket?.connected || !incomingChatRequest) return false;

      socket.emit(SOCKET_EVENTS.ACCEPT_CHAT_REQUEST, {
        clientId: incomingChatRequest.clientId,
        chatGroupId,
      });

      const clientId = incomingChatRequest.clientId;
      setIncomingChatRequest(null);

      // Return clientId so the component can navigate
      return clientId;
    },
    [socket, incomingChatRequest]
  );

  /**
   * Reject an incoming chat request (for lawyers)
   */
  const rejectChatRequest = useCallback(() => {
    if (!socket?.connected || !incomingChatRequest) return false;

    socket.emit(SOCKET_EVENTS.REJECT_CHAT_REQUEST, {
      clientId: incomingChatRequest.clientId,
    });

    setIncomingChatRequest(null);

    Swal.fire({
      icon: "info",
      title: "Chat Declined",
      text: "You declined the chat request.",
      timer: 2000,
      showConfirmButton: false,
    });

    return true;
  }, [socket, incomingChatRequest]);

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
    socket.emit(SOCKET_EVENTS.GET_ONLINE_LAWYERS);
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

    // Chat Requests
    incomingChatRequest,
    pendingChatRequest,
    initiateChatRequest,
    acceptChatRequest,
    rejectChatRequest,

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
          userFullName={user?.fullName}
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

      {/* Incoming Chat Request Screen (for lawyers) */}
      {incomingChatRequest && (
        <IncomingChatRequest
          clientInfo={incomingChatRequest.clientInfo}
          onAccept={async () => {
            try {
              // Create chat group first
              const res = await api.post("/api/v2/chat/group", {
                fromUserId: incomingChatRequest.clientId,
                fromUserModel: "User",
                toUserId: userId,
                toUserModel: "Lawyer",
              });
              const chatGroupId = res.data._id;
              
              // Accept the chat request
              await acceptChatRequest(chatGroupId);
              
              // Navigate to messages
              window.location.href = `/dashboard/messages?chatId=${chatGroupId}`;
            } catch (err) {
              console.error("Error accepting chat:", err);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to accept chat request.",
              });
            }
          }}
          onReject={rejectChatRequest}
          onTimeout={() => {
            // Emit timeout event to notify client
            if (socket?.connected && incomingChatRequest) {
              socket.emit(SOCKET_EVENTS.CHAT_REQUEST_TIMEOUT, {
                clientId: incomingChatRequest.clientId,
              });
            }
            setIncomingChatRequest(null);
          }}
        />
      )}

      {/* Loading Backdrop */}
      <Backdrop
        open={activeCall.isActive && activeCall.callStatus === "ringing"}
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
