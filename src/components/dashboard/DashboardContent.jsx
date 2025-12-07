import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const DashboardContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [lastLogin, setLastLogin] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  const userData = JSON.parse(localStorage.getItem("userDetails"));

  // Sample data for charts
  const consultationData = [
    { month: "Jan", consultations: 2, resolved: 1 },
    { month: "Feb", consultations: 4, resolved: 3 },
    { month: "Mar", consultations: 3, resolved: 2 },
    { month: "Apr", consultations: 5, resolved: 4 },
    { month: "May", consultations: 6, resolved: 5 },
    { month: "Jun", consultations: 3, resolved: 3 },
  ];

  const caseTypeData = [
    { type: "Divorce", count: 2, color: "#ef4444" },
    { type: "Property", count: 1, color: "#f59e0b" },
    { type: "Criminal", count: 1, color: "#10b981" },
    { type: "Corporate", count: 1, color: "#3b82f6" },
  ];

  const weeklyActivityData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.2 },
    { day: "Wed", hours: 0.8 },
    { day: "Thu", hours: 3.1 },
    { day: "Fri", hours: 2.5 },
    { day: "Sat", hours: 1.2 },
    { day: "Sun", hours: 0.5 },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

  // Time tracking
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Set last login
    const storedLastLogin = localStorage.getItem("lastLogin");
    if (storedLastLogin) {
      setLastLogin(new Date(storedLastLogin));
    }
    localStorage.setItem("lastLogin", new Date().toISOString());

    // Get session start time
    const storedSessionStart = localStorage.getItem("sessionStartTime");
    const actualSessionStart = storedSessionStart
      ? parseInt(storedSessionStart)
      : Date.now();
    setSessionStartTime(actualSessionStart);

    // Update session time every minute
    const interval = setInterval(() => {
      const timeSpent = (Date.now() - actualSessionStart) / (1000 * 60 * 60); // hours
      setCurrentSessionTime(timeSpent);
    }, 60000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  const formatLastLogin = (date) => {
    if (!date) return "First time login";
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  };

  //========================================= chat code start==================================================================

  const [lawyers, setLawyers] = useState([]);
  const [chatLawyer, setChatLawyer] = useState(null);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageMap, setMessageMap] = useState({});
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

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

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

  const [isFlipping, setIsFlipping] = useState(false);

  const handleSwapLawyer = async () => {
    setIsLoading(true);
    // Wait for the first half of the flip
    setTimeout(async () => {
      setIsFlipping(true); // Start flip
      setIsLoading(false);
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

  const caseStatuses = [
    { id: 1, title: "Divorce Case", status: "Active", progress: 65 },
    { id: 2, title: "Property Dispute", status: "Pending", progress: 30 },
    { id: 3, title: "Trademark Filing", status: "Closed", progress: 100 },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Closed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const iconStyle = {
    width: "20px",
    height: "20px",
    filter: "grayscale(0%)",
  };

  return (
    <>
      <div className="dashboard-container">
        <main className="main-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {userData?.user?.fullName}! 👋
            </h1>
            <p className="welcome-subtitle">
              Here's your legal dashboard overview
            </p>
            <div className="time-info">
              <div className="time-item">
                <span>🕒</span>
                <span>Last login: {formatLastLogin(lastLogin)}</span>
              </div>
              <div className="time-item">
                <span>⏱️</span>
                <span>Session time: {currentSessionTime.toFixed(1)} hours</span>
              </div>
              <div className="time-item">
                <span>📊</span>
                <span>Status: Active</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-value">{caseStatuses.length}</div>
              <div className="stats-label">Active Cases</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">
                {consultationData.reduce(
                  (sum, item) => sum + item.consultations,
                  0
                )}
              </div>
              <div className="stats-label">Total Consultations</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{onlineLawyers.length}</div>
              <div className="stats-label">Lawyers Online</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">
                {weeklyActivityData
                  .reduce((sum, day) => sum + day.hours, 0)
                  .toFixed(1)}
              </div>
              <div className="stats-label">Hours This Week</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-container">
              <h3 className="chart-title">📈 Consultation Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={consultationData}>
                  <defs>
                    <linearGradient
                      id="consultationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="resolvedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    stroke="#3b82f6"
                    fill="url(#consultationGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    fill="url(#resolvedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">📊 Case Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={caseTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {caseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="chart-container" style={{ marginBottom: "2rem" }}>
            <h3 className="chart-title">📅 Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value} hours`, "Time Spent"]}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cases Section */}
          <div className="case-grid">
            {caseStatuses.map((caseItem) => (
              <div
                className="case-card"
                key={caseItem.id}
                onClick={() => navigate("/case-details")}
              >
                <div className="case-header">
                  <div className="case-title">{caseItem.title}</div>
                  <div
                    className="case-status"
                    style={{ backgroundColor: statusColor(caseItem.status) }}
                  >
                    {caseItem.status}
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${caseItem.progress}%` }}
                  ></div>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Progress: {caseItem.progress}%
                </div>
              </div>
            ))}
          </div>

          {/* Lawyers Section */}
          <div className="lawyers-section">
            <h2 className="section-title">🌟 Available Lawyers</h2>
            <div className="lawyers-grid">
              {lawyers?.slice(0, 6).map((lawyer, index) => {
                const isOnline = onlineLawyers.includes(lawyer._id);
                return (
                  <div key={index} className="lawyer-card">
                    <img
                      src={lawyer?.profilepic}
                      alt="Lawyer"
                      className="lawyer-avatar"
                    />
                    <div className="lawyer-name">
                      {lawyer?.firstName} {lawyer?.lastName}
                    </div>
                    <div className="lawyer-status">
                      <span style={{ color: isOnline ? "#10b981" : "#ef4444" }}>
                        {isOnline ? "🟢 Online" : "🔴 Offline"}
                      </span>
                    </div>
                    <div className="lawyer-details">
                      <div>
                        <strong>Specialization:</strong>{" "}
                        {Array.isArray(lawyer?.specializations)
                          ? lawyer.specializations
                              .map((spec) => spec.label)
                              .join(", ")
                          : lawyer?.specializations?.label ||
                            lawyer?.specializations ||
                            ""}
                      </div>

                      <div>
                        <strong>Experience:</strong> {lawyer?.yearsOfExperience}{" "}
                        years
                      </div>
                    </div>
                    <div className="lawyer-actions">
                      <button
                        className="action-btn"
                        title="Chat"
                        onClick={() => handleOpenChat(lawyer)}
                      >
                        💬
                      </button>
                      <button
                        className="action-btn"
                        title="WhatsApp"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${lawyer?.mobile || ""}`,
                            "_blank"
                          )
                        }
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                          alt="WhatsApp"
                          style={iconStyle}
                        />
                      </button>
                      <button
                        className="action-btn"
                        title="Message"
                        onClick={() => alert("Message clicked")}
                      >
                        ✉️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        {/* Chat Popup */}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleSendMessage(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "absolute",
                  right: "25px",
                  top: "93%",
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
                🗂️
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
