import React, { useState, useEffect, useRef } from "react";
import Clientsidebar from "../clientsidebar";
import socket from "../socket";
import Swal from "sweetalert2";
import api from "../../api";
import Header from "../Layout/header";
import { HiOutlinePaperClip } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import "../Client/css/client_chat_history.css";

function Clientchathistory() {
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  
  const [recentChats, setRecentChats] = useState([]);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [chatLawyer, setChatLawyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageMap, setMessageMap] = useState({});
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  const fetchChatHistory = async () => {
    try {
      const res = await api.get("api/admin/chathistoryforrecentchat");
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

  const markMessagesRead = async (clientId) => {
    try {
      const userid = userData.user._id;
      socket.emit("markMessagesRead", {
        readerId: userid,
        senderId: clientId,
        readerModel: "User",
      });
    } catch (err) {
      console.error("Failed to mark messages read", err);
    }
  };

  // Your existing chat functionality...
  useEffect(() => {
    if (!userData?.user?._id) return;

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

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
      socket.off("onlineLawyersList");
      socket.off("updateOnlineUsers");
      socket.disconnect();
    };
  }, [userData?.user?._id, chatLawyer]);

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
    markMessagesRead(lawyer._id);
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
          } who practices in ${lawyer.practicingcourts
            .map((item) => item.label)
            .join(",")} Courts and specializes in ${lawyer.specializations
            .map((item) => item.label)
            .join(",")}, With ${
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

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

    const [favorites, setFavorites] = useState([]);



    // ✅ Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId=userData.user._id
        const res = await api.get(`api/user/get-favorite/${userId}`);
       
        const favIds = res.data.map(f => f.lawyerId._id);
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



  return (
    <div>
      <Header />
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
      color: favorites.includes(lawyer._id) ? "red" : "#bbb",
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

      {chatLawyer && (
        <div className={`chat-popup${isFlipping ? " flip" : ""}`}>
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <button
                onClick={handleSwapLawyer}
                style={{
                  background: "none",
                  color: "white",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
                // onClick={() => setShowLawyerSwitch(!showLawyerSwitch)}
                title="Switch Lawyer"
              >
                🔄
                {/* <span style={{fontSize:"14px"}}>switch</span> */}
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => setChatLawyer(null)}
                title="Close Chat"
              >
                ✖
              </button>
            </div>
            {/* <button
              onClick={() => setChatLawyer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >✖</button> */}
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.isMe ? "sent" : msg.isSystem ? "system" : "received"
                }`}
              >
                {msg.text}
                <div style={{ fontSize: "10px", marginTop: 2 }}>
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleString()
                    : ""}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleSendMessage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      )}

      {/* ==============chat popup ===========================================*/}

      {chatLawyer && (
        <div className={`chat-popup${isFlipping ? " flip" : ""}`}>
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                  {/* <span style={{fontSize:"10px",color:"lightgray",fontWeight:"normal"}}>
                    {chatLawyer.yearsOfExperience}years of experience</span> */}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>
                  {chatLawyer.isOnline ? "🟢 Online" : "🔴 Offline"}
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={handleSwapLawyer}
                style={{
                  background: "none",
                  border: "1px solid lightgray",
                  color: "black",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                title="Switch Lawyer"
              >
                Switch
                {/* <span style={{fontSize:"14px"}}>switch</span> */}
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={() => setChatLawyer(null)}
                title="Close Chat"
              >
                ✖
              </button>
            </div>
            {/* <button
              onClick={() => setChatLawyer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >✖</button> */}
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.isMe ? "sent" : "received"}`}
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
            {/* <button
  type="button"
  onClick={() => fileInputRef.current.click()}
  style={{
    position: 'absolute',
    right: '25px',
    top: '93%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'gray',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
    margin: 0
  }}
  title="Attach Document"
  tabIndex={-1}
>
  🗂️
</button> */}
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

export default Clientchathistory;
