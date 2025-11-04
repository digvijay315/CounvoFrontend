import React, { useEffect, useState ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import ClientProfileModal from './ClientProfileModal';
import api from '../api';
import { io } from 'socket.io-client';
import socket from './socket';
import Swal from 'sweetalert2';
import Clientsidebar from './clientsidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import changaccount from '../img/change-account.svg'

const ClientDashboard = () => {
      const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [lastLogin, setLastLogin] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  const userData = JSON.parse(localStorage.getItem('userDetails'));

  // Sample data for charts
  const consultationData = [
    { month: 'Jan', consultations: 2, resolved: 1 },
    { month: 'Feb', consultations: 4, resolved: 3 },
    { month: 'Mar', consultations: 3, resolved: 2 },
    { month: 'Apr', consultations: 5, resolved: 4 },
    { month: 'May', consultations: 6, resolved: 5 },
    { month: 'Jun', consultations: 3, resolved: 3 },
  ];

  const caseTypeData = [
    { type: 'Divorce', count: 2, color: '#ef4444' },
    { type: 'Property', count: 1, color: '#f59e0b' },
    { type: 'Criminal', count: 1, color: '#10b981' },
    { type: 'Corporate', count: 1, color: '#3b82f6' },
  ];

  const weeklyActivityData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.2 },
    { day: 'Wed', hours: 0.8 },
    { day: 'Thu', hours: 3.1 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 1.2 },
    { day: 'Sun', hours: 0.5 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  // Time tracking
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Set last login
    const storedLastLogin = localStorage.getItem('lastLogin');
    if (storedLastLogin) {
      setLastLogin(new Date(storedLastLogin));
    }
    localStorage.setItem('lastLogin', new Date().toISOString());

    // Get session start time
    const storedSessionStart = localStorage.getItem('sessionStartTime');
    const actualSessionStart = storedSessionStart ? parseInt(storedSessionStart) : Date.now();
    setSessionStartTime(actualSessionStart);

    // Update session time every minute
    const interval = setInterval(() => {
      const timeSpent = (Date.now() - actualSessionStart) / (1000 * 60 * 60); // hours
      setCurrentSessionTime(timeSpent);
    }, 60000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  const formatLastLogin = (date) => {
    if (!date) return 'First time login';
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  //========================================= chat code start==================================================================


  const [lawyers, setLawyers] = useState([]);
  const [chatLawyer, setChatLawyer] = useState(null);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageMap, setMessageMap] = useState({});
  const fileInputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchlawyers = async () => {
    try {
      const resp = await api.get('api/lawyer/getalllawyerprofile');
      setLawyers(resp.data.filter((item) => (item.status === "verified")));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchlawyers();
  }, []);



  // Your existing chat functionality...
  useEffect(() => {
    if (!userData.user._id) return;

    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected (client):', socket.id);
      socket.emit('clientOnline', userData.user._id);
      socket.emit('getOnlineLawyers');
    });

    socket.on('onlineLawyersList', (ids) => {
      console.log('✅ Received online lawyers:', ids);
      setOnlineLawyers(ids);
    });

    socket.on('updateOnlineUsers', (ids) => {
      setOnlineLawyers(ids);
    });

    socket.on('receiveMessage', ({ from, message }) => {
      if (chatLawyer?._id === from) {
        setMessages((prev) => [...prev, { text: message, isMe: false }]);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('onlineLawyersList');
      socket.off('updateOnlineUsers');
    };
  }, [userData.user._id, chatLawyer]);

  const handleSendMessage = (text) => {
    if (!text.trim() || !chatLawyer?._id) return;

    if (containsSensitiveInfo(text)) {
      Swal.fire({
        icon: 'warning',
        title: 'Not Allowed 🚫',
        text: 'Sharing mobile numbers or emails is not permitted!',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    
     const timestamp = new Date().toISOString();

    socket.emit('privateMessage', {
      toUserId: chatLawyer._id,
      message: text,
      fromUserType: 'client',
      timestamp
    });

    setMessages((prev) => [...prev, { text, isMe: true,timestamp  }]);
  };

    const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatLawyer?._id) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/admin/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.url;
      const fileType = file.type;

      socket.emit('privateMessage', {
        toUserId: chatLawyer._id,
        message: '',
        fileUrl,
        fileName: file.name,
        fileType,
        fromUserType: 'client'
      });

      setMessages((prev) => [
        ...prev,
        { text: '', fileUrl, fileName: file.name, fileType, isMe: true }
      ]);
    } catch (err) {
      alert('Upload failed');
    }
    setIsUploading(false);
  };


  
  const handleOpenChat = async (lawyer) => {
    const isOnline = onlineLawyers.includes(lawyer._id);
    setChatLawyer({ ...lawyer, isOnline });

    const clientId = userData.user._id;
    const lawyerId = lawyer._id;

    try {
      const res = await api.get(`api/admin/chathistory/${clientId}/${lawyerId}`);
      const data = await res.data;

      let formatted = data.map(msg => ({
        text: msg.message,
        isMe: msg.from === clientId,
        isSystem: false,
      }));

      if (formatted.length === 0) {
        const systemMessage = {
          text: `You are now connected to Advocate ${lawyer.firstName} ${lawyer.lastName} who practices in ${lawyer.practicingcourts.map((item)=>item.label).join(',')} Courts and specializes in ${lawyer.specializations.map((item)=>item.label).join(',')}, With ${lawyer.yearsOfExperience} of experience. Feel free to share your concern or upload documents securely`,
          isSystem: true,
          isMe: false,
        };
        formatted = [systemMessage];
      }

      setMessages(formatted);
      setMessageMap(prev => ({ ...prev, [lawyerId]: formatted }));
    } catch (err) {
      console.error('❌ Error fetching chat history:', err);
    }
  };

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

  const [isFlipping, setIsFlipping] = useState(false);

const handleSwapLawyer = async () => {

setIsLoading(true)
  // Wait for the first half of the flip
  setTimeout(async () => {
      setIsFlipping(true); // Start flip
      setIsLoading(false)
    const availableOnlineLawyers = lawyers.filter(
      (lawyer) => onlineLawyers.includes(lawyer._id) && lawyer._id !== chatLawyer._id
    );

    if (availableOnlineLawyers.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Other Lawyers Online',
        text: 'Sorry, there are no other online lawyers to swap with right now.',
        timer: 2500,
        showConfirmButton: false,
      });
      setIsFlipping(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableOnlineLawyers.length);
    const newLawyer = availableOnlineLawyers[randomIndex];

    await handleOpenChat(newLawyer);

    // End flip after the second half
    setTimeout(() => setIsFlipping(false), 300); // 300ms for the second half
  }, 2000); // 300ms for the first half
};



  const menuItems = [
    { label: 'Dashboard / Home', icon: '🏠', path: '/dashboard' },
    { label: 'Find a Lawyer', icon: '👨‍⚖', path: '/find-lawyer' },
    { label: 'My Consultations', icon: '📅', path: '/consultations' },
    { label: 'Messages / Chat', icon: '💬', path: '/messages' },
    { label: 'Documents', icon: '📁', path: '/documents' },
    { label: 'Payments & Invoices', icon: '💳', path: '/payments' },
    { label: 'Profile / Settings', icon: '⚙', path: '/settings' },
    { label: 'Support / Help', icon: '🆘', path: '/support' },
  ];

  const caseStatuses = [
    { id: 1, title: 'Divorce Case', status: 'Active', progress: 65 },
    { id: 2, title: 'Property Dispute', status: 'Pending', progress: 30 },
    { id: 3, title: 'Trademark Filing', status: 'Closed', progress: 100 },
  ];

  const statusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const iconOnlyButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
    filter: 'grayscale(0%)',
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          background: #f8fafc;
        }

        .welcome-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          margin-top:20px
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .time-info {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }

        .time-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stats-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stats-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .stats-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1e40af;
          margin-bottom: 0.5rem;
        }

        .stats-label {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .case-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .case-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .case-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .case-title {
          font-weight: 600;
          font-size: 1.125rem;
          color: #1f2937;
        }

        .case-status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .lawyers-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

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
          bottom: 10px;
          left:40%;
          width: 480px;
          height: 600px;
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
          
           background: linear-gradient(135deg,rgb(162, 167, 167),rgb(168, 168, 168));
          color: black;
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
        }
      `}</style>

      <Clientsidebar />
      
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
              <div className="stats-value">{consultationData.reduce((sum, item) => sum + item.consultations, 0)}</div>
              <div className="stats-label">Total Consultations</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{onlineLawyers.length}</div>
              <div className="stats-label">Lawyers Online</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{weeklyActivityData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}</div>
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
                    <linearGradient id="consultationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="consultations" stroke="#3b82f6" fill="url(#consultationGradient)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#resolvedGradient)" />
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
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="chart-container" style={{ marginBottom: '2rem' }}>
            <h3 className="chart-title">📅 Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} hours`, 'Time Spent']}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cases Section */}
          <div className="case-grid">
            {caseStatuses.map((caseItem) => (
              <div className="case-card" key={caseItem.id} onClick={() => navigate('/case-details')}>
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
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Progress: {caseItem.progress}%
                </div>
              </div>
            ))}
          </div>

          {/* Lawyers Section */}
          <div className="lawyers-section">
            <h2 className="section-title">
              🌟 Available Lawyers
            </h2>
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
                      <span style={{ color: isOnline ? '#10b981' : '#ef4444' }}>
                        {isOnline ? '🟢 Online' : '🔴 Offline'}
                      </span>
                    </div>
                    <div className="lawyer-details">
                      <div>
                      <strong>Specialization:</strong>{" "}
                      {Array.isArray(lawyer?.specializations)
                        ? lawyer.specializations.map(spec => spec.label).join(", ")
                        : (lawyer?.specializations?.label || lawyer?.specializations || "")}
                    </div>

                      <div><strong>Experience:</strong> {lawyer?.yearsOfExperience} years</div>
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
                        onClick={() => window.open(`https://wa.me/${lawyer?.mobile || ''}`, '_blank')}
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
      </div>

      {/* Chat Popup */}
      {chatLawyer && (
        <div className={`chat-popup${isFlipping ? ' flip' : ''}`}>
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={chatLawyer.profilepic}
                alt="profile"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid white',
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {chatLawyer.firstName} {chatLawyer.lastName}
                  {/* <span style={{fontSize:"10px",color:"lightgray",fontWeight:"normal"}}>
                    {chatLawyer.yearsOfExperience}years of experience</span> */}
                 

                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  {chatLawyer.isOnline ? '🟢 Online' : '🔴 Offline'}
                </div>
              </div>
            </div>
            <div className="header-actions">
        <button
        onClick={handleSwapLawyer}
           style={{
                background: 'none',
                border:"1px solid lightgray",
                color: 'black',
                fontSize: '12px',
                cursor: 'pointer',
              }}
        
          title="Switch Lawyer"
        >
          Switch
          {/* <span style={{fontSize:"14px"}}>switch</span> */}
        </button>
        <button
           style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
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
          <div key={idx} className={`message ${msg.isMe ? 'sent' : 'received'}`}>
            {msg.text}
            {msg.fileUrl && (
              msg.fileType && msg.fileType.startsWith('image/') ? (
                <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: 150, maxHeight: 150 }} />
              ) : (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  📄 {msg.fileName}
                </a>
              )
            )}
       <div style={{ fontSize: '10px', color: 'black', marginTop: '2px', textAlign: msg.isMe ? 'right' : 'left' }}>
      {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
    </div>
  </div>
))}
      </div>

          <div className="chat-input">
            <input
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
            <input
              type="text"
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSendMessage(e.target.value.trim());
                  e.target.value = '';
                }
              }}
            />
   <button
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
    </>
  );
};

export default ClientDashboard;
