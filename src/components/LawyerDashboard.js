import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import socket from './socket';
import Swal from 'sweetalert2';
import Lawyersidebar from './lawyersidebar';
import { Modal, Button } from "react-bootstrap";
import CustomerFeedbackForm from "./customerfeedback";

import '../css/lawyerdashboard.css'
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';
import { FiMinus } from 'react-icons/fi';
import LawyerFeedbackForm from './lawyerfeedbackform';


const LawyerDashboard = () => {

  const [isLoading, setisLoading] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [dailyTimeSpent, setDailyTimeSpent] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Chat states
  const [chatClients, setChatClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const fetchedClientsRef = useRef(new Set());
  const [messageMap, setMessageMap] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [needsAccept, setNeedsAccept] = useState({}); // { [clientId]: true/false }
const [sessionTimestamps, setSessionTimestamps] = useState({}); // { [clientId]: lastActiveTimestamp (number ms) }


  const lawyerdetails = JSON.parse(localStorage.getItem('lawyerDetails'));

 

   const getWeeklyData = () => {
    const today = new Date();
    const weeklyData = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toLocaleDateString();
      
      // Find tracked time for this day
      const dayData = dailyTimeSpent.find(d => d.date === dateString);
      const hours = dayData ? dayData.hours : 0;
      
      weeklyData.push({
        day: dayName,
        hours: parseFloat(hours.toFixed(1)),
        date: dateString
      });
    }
    
    return weeklyData;
  };

 
  // Get current week's data
  const weeklyData = getWeeklyData();

   console.log(weeklyData);

 useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  // Get login times from localStorage
  const currentLogin = localStorage.getItem('currentLoginTime');
  const previousLogin = localStorage.getItem('previousLogin');
  
  if (previousLogin) {
    setLastLogin(new Date(previousLogin));
  } else {
    setLastLogin(null); // First time login
  }
  
  // Get session start time from localStorage or use current time
  const storedSessionStart = localStorage.getItem('sessionStartTime');
  const actualSessionStart = storedSessionStart ? parseInt(storedSessionStart) : Date.now();
  setSessionStartTime(actualSessionStart);

  // Load existing daily time data
  const storedDailyTime = JSON.parse(localStorage.getItem('dailyTimeSpent') || '[]');
  setDailyTimeSpent(storedDailyTime);

  // Track session time
  const interval = setInterval(() => {
    const timeSpent = (Date.now() - actualSessionStart) / (1000 * 60 * 60); // hours
    const today = new Date().toLocaleDateString();
    
    setDailyTimeSpent(prev => {
      const updated = prev.map(d => 
        d.date === today 
          ? { ...d, hours: timeSpent }
          : d
      );
      
      // If today doesn't exist, add it
      const todayExists = updated.find(d => d.date === today);
      if (!todayExists) {
        updated.push({ 
          date: today, 
          hours: timeSpent, 
          loginTime: new Date().toISOString() 
        });
      }
      
      // Update localStorage
      localStorage.setItem('dailyTimeSpent', JSON.stringify(updated));
      return updated;
    });
  }, 60000); // Update every minute

  return () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(interval);
  };
}, []); 

//=================================== chat code start============================================================================
 const [message, setMessage] = useState('');
 const fileInputRef = useRef(null);

  const [isMinimized, setIsMinimized] = useState(false);

    const [onlineClients, setOnlineClients] = useState([]);

  // Chat functionality (keeping your existing chat code)
  useEffect(() => {
    if (!lawyerdetails?.lawyer?._id) return;

    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      const lawyerId = lawyerdetails.lawyer._id;
      socket.emit('lawyerOnline', lawyerId);
      socket.emit('getOnlineClients');
    });
      socket.on('onlineClientsList', ids => {
          setOnlineClients(ids);
        });

    function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 750; // Hz
    oscillator.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15); // 150ms beep
    oscillator.onended = () => ctx.close();
  } catch (_) {}
}



 const handleReceiveMessage = async ({ from, message, fileUrl, fileName, fileType }) => {

 
  setHasNewMessages(true);
    markMessagesRead(from);
   showAcceptPopup(from); // 👈 Add this line
    // Play notification beep if chat is closed or tab is not visible
  if (
    typeof showChat === "undefined" ||
    !showChat ||
    document.visibilityState !== "visible"
  ) {
    playBeep();
  }

  // Add message (with file info if present) to the message map
  setMessageMap((prev) => ({
    ...prev,
    [from]: [
      ...(prev[from] || []),
      { text: message, fileUrl, fileName, fileType, isMe: false }
    ],
  }));

  // If this client is currently selected, add message to visible chat
  if (selectedClient?._id === from) {
    setMessages((prev) => [
      ...prev,
      { text: message, fileUrl, fileName, fileType, isMe: false }
    ]);
   
  }

  // Fetch client info if not already fetched
  if (!fetchedClientsRef.current.has(from)) {
    try {
      const res = await api.get(`api/user/${from}`);
      const data = res.data;

      const newClient = {
        _id: data._id,
        firstName: data.fullName || 'Client',
        profilepic: data.profilepic || '',
        lastMessage: message,
      };

      setChatClients((prev) => {
        const exists = prev.find((c) => c._id === from);
        if (exists) return prev.map((c) =>
          c._id === from ? { ...c, lastMessage: message } : c
        );
        return [...prev, newClient];
      });

      fetchedClientsRef.current.add(from);
    } catch (err) {
      console.error('❌ Failed to fetch client:', err);
    }
  } else {
    setChatClients((prev) =>
      prev.map((c) =>
        c._id === from ? { ...c, lastMessage: message } : c
      )
    );
  }
};


    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('connect');
      socket.off('receiveMessage', handleReceiveMessage);
      socket.disconnect();
    };
  }, [lawyerdetails?.lawyer?._id, selectedClient]);

  function isSessionActive(clientId) {
  const last = sessionTimestamps[clientId];
  if (!last) return false;
  return Date.now() - last < 30 * 60 * 1000;
}

// On opening chat, check if new/expired session and trigger accept requirement:
const showAcceptPopup = (clientId) => {
  const shouldAccept = !isSessionActive(clientId);
  setNeedsAccept(prev => ({ ...prev, [clientId]: shouldAccept }));
};

const markMessagesRead = async (clientId) => {
  try {
    const lawyerId = lawyerdetails.lawyer._id;
    socket.emit('markMessagesRead', {
      readerId: lawyerId,
      senderId: clientId,
      readerModel: 'Lawyer'
    });
  } catch (err) {
    console.error('Failed to mark messages read', err);
  }
};

 const handleOpenChat = async (client) => {
  setSelectedClient(client);
    markMessagesRead(client._id);

  // Show accept dialog if session is expired/missing
  // showAcceptPopup(client._id);

  // If session is active, load chat history (as before)
  if (isSessionActive(client._id)) {
    const lawyerId = lawyerdetails.lawyer._id;
    const clientId = client._id;
    await fetchChatHistory(lawyerId, clientId);
    
  } else {
    setMessages([]); // Not showing messages until accepted
  }
};


  const handleSend = (msg) => {
  
    handleLawyerTyping()
    // if (e.key === 'Enter' && e.target.value.trim()) {
    //   const msg = e.target.value.trim();
    //   e.target.value = '';

      if (containsSensitiveInfo(msg)) {
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
        toUserId: selectedClient._id,
        message: msg,
        fromUserType: 'lawyer',
        timestamp
      });

      setMessages(prev => [...prev, { text: msg, isMe: true,timestamp }]);
    }
  

       const handleFileChange = async (e) => {
        setisLoading(true)
        const file = e.target.files[0];
        if (!file || !selectedClient?._id) return;
        // setIsLoading(true);
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const res = await api.post('/api/admin/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const fileUrl = res.data.url;
          const fileType = file.type;
    
          socket.emit('privateMessage', {
            toUserId: selectedClient._id,
            message: '',
            fileUrl,
            fileName: file.name,
            fileType,
            fromUserType: 'lawyer',
            timestamp: new Date().toISOString()
          });
    
          setMessages((prev) => [
            ...prev,
            { text: '', fileUrl, fileName: file.name, fileType, isMe: true }
          ]);
        } catch (err) {
          alert('Upload failed');
        }finally
        {
          setisLoading(false);
        }
        
      };


  const fetchChatHistory = async (user1Id, user2Id) => {
    try {
      const res = await api.get(`api/admin/chathistory/${user1Id}/${user2Id}`);
      const data = await res.data;

      if (res.status === 200) {
        const formatted = data.map(msg => ({
          text: msg.message,
          isMe: msg.from === user1Id,
          timestamp: msg.timestamp,
          isSystem: false,
        fileUrl:msg.fileUrl,
        fileName:msg.fileName, 
        fileType:msg.fileType
        }));
        setMessages(formatted);
      } else {
        console.error('❌ Failed to fetch history:', data.error);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
    }
  };

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

  //==================================== typing indicaton==============================================

  const handleLawyerTyping = () => {
  if (!selectedClient?._id) return;
  socket.emit('typing', {
    toUserId: selectedClient._id,
    fromUserType: 'lawyer',
    name: lawyerdetails.lawyer.firstName || 'Lawyer',
    fromUserId: lawyerdetails.lawyer._id
  });
};

const [typingStatus, setTypingStatus] = useState('');
const typingTimeout = useRef();

useEffect(() => {
  socket.on('typing', ({ fromUserType, name, fromUserId }) => {
    if (selectedClient?._id === fromUserId) { // Only show for current client
      setTypingStatus(`typing...`);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingStatus(''), 1500);
    }
  });
  return () => socket.off('typing');
}, [selectedClient]);

const [clientMap, setClientMap] = useState({}); // { clientId: clientName, ... }


// show modal for feed back form when close the chat

 const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


// useEffect(() => {
//   socket.on('missedMessagesNotification', async (notifications) => {
//     // Get unique client IDs to fetch
//     const clientIds = [...new Set(notifications.map(n => n._id))];

//     // Fetch clients data from API 
//     const clientIdNameMap = {};
//     await Promise.all(clientIds.map(async (id) => {
//       try {
//         const res = await api.get(`/api/user/${id}`);
//         clientIdNameMap[id] = res.data.fullName || 'Client';
//       } catch {
//         clientIdNameMap[id] = 'Client'; // fallback
//       }
//     }));

//     // Show notifications with correct names
//     notifications.forEach(({ _id: clientId, count }) => {
//       const name = clientIdNameMap[clientId] || clientId;
//       Swal.fire({
//         icon: 'info',
//         title: 'Unread Messages',
//         text: `You have ${count} unread message${count > 1 ? 's' : ''} from ${name}.`,
//         timer: 4000,
//         showConfirmButton: true,
//       });
//     });
//   });

//   return () => socket.off('missedMessagesNotification');
// }, []);



// useEffect(() => {
//   if ("Notification" in window && Notification.permission !== "granted") {
//     Notification.requestPermission();
//   }
// }, []);

// useEffect(() => {
//   const clientId = Object.keys(needsAccept).find(id => needsAccept[id]);
//   if (clientId && "Notification" in window && Notification.permission === "granted") {
//     const latestMsg =
//       messageMap[clientId]?.length > 0
//         ? messageMap[clientId][messageMap[clientId].length - 1].text
//         : "This client wants to chat with you.";
//     const notification = new Notification("Chat Request", {
//       body: latestMsg,
//       icon: "/logo.png" // optional icon path
//     });
//     notification.onclick = () => window.focus();
//   }
// }, [needsAccept, messageMap]);

useEffect(() => {
  // Request permission for notifications
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);

useEffect(() => {
  const clientId = Object.keys(needsAccept).find(id => needsAccept[id]);
  if (!clientId) return;

  const latestMsg =
    messageMap[clientId]?.length > 0
      ? messageMap[clientId][messageMap[clientId].length - 1].text
      : "This client wants to chat with you.";

  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

  if ("Notification" in window && Notification.permission === "granted") {
    if (isMobile && navigator.serviceWorker) {
      // Mobile & background: show notification via service worker
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("Chat Request", {
          body: latestMsg,
          icon: "/logo.png",
        });
      });
    } else {
      // Desktop or mobile foreground: show notification directly
      new Notification("Chat Request", {
        body: latestMsg,
        icon: "/logo.png",
      });
    }
  }
}, [needsAccept, messageMap]);


  //===================================== chat code end==================================================================


  //=================================== clients details code start=======================================================

  const [recentChats, setRecentChats] = useState([]);
    const [allclients, setallclients] = useState([]); 
  const fetchRecentChats = async () => {
    try {
      const res = await api.get('api/admin/chathistoryforrecentchat');
      const result = res.data;
      const lawyerChats = result.filter(
        chat =>
          chat.to === lawyerdetails.lawyer._id && chat.toModel === "Lawyer"
      );
      setRecentChats(lawyerChats);
    } catch (err) {
      console.error('Error fetching lawyer chats:', err);
    }
  };

  // Get unique client IDs from history
  const uniqueClientMap = {};
  const uniqueChatClients = [];
  recentChats.forEach(chat => {
    if (!uniqueClientMap[chat.from]) {
      uniqueClientMap[chat.from] = true;
      uniqueChatClients.push(chat);
    }
  });

  // Fetch all user data for clients lawyer chatted with
  const fetchClientsData = async () => {
    const ids = uniqueChatClients.map(chat => chat.from);
    const allClients = [];
    for (let id of ids) {
      try {
        const res = await api.get('/api/user/' + id);
        allClients.push(res.data);
      } catch {}
    }
    setallclients(allClients);
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  useEffect(() => {
    fetchClientsData();
  }, [recentChats.length]);



  // ==============================================clients details end========================================

  const menuItems = [
    { label: 'Dashboard', icon: '🏠', path: '/Lawyerdashboard' },
    { label: 'Profile', icon: '👤', path: './completelawyerprofile' },
    { label: 'Clients', icon: '👥', path: '/lawyerchathistory' },
    { label: 'Messages', icon: '💬' },
    { label: 'My Cases', icon: '📂', path: '/cases' },
    { label: 'Schedule', icon: '📅', path: '/schedule' },
    { label: 'Billing', icon: '💳', path: '/billing' },
    { label: 'Documents', icon: '📁', path: '/documents' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
    { label: 'Support', icon: '🆘', path: '/support' },
  ];

  const headerMenu = [
    { label: 'Notifications', path: '/notifications' },
  ];

  const cases = [
    { id: 1, title: 'Contract Dispute Resolution', client: 'TechCorp Ltd.', status: 'Active', priority: 'High', dueDate: '2025-07-15' },
    { id: 2, title: 'Intellectual Property Defense', client: 'Innovation Inc.', status: 'Pending', priority: 'Medium', dueDate: '2025-07-20' },
    { id: 3, title: 'Personal Injury Settlement', client: 'John Smith', status: 'Closed', priority: 'Low', dueDate: '2025-06-30' },
    { id: 4, title: 'Real Estate Transaction', client: 'Property Ventures', status: 'Active', priority: 'High', dueDate: '2025-07-10' },
  ];

  const clients = [
    { id: 1, name: 'Ram Kumar', email: 'ram.kumar@example.com', phone: '+91 98765 43210', status: 'Active' },
    { id: 2, name: 'Anita Singh', email: 'anita.singh@example.com', phone: '+91 87654 32109', status: 'Active' },
    { id: 3, name: 'John Doe', email: 'john.doe@example.com', phone: '+91 76543 21098', status: 'Inactive' },
  ];

  const statusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Closed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          margin: 0; /* Remove default body margin */
          padding: 0; /* Remove default body padding */
        }

        .dashboard-container {
          display: grid;
          grid-template-areas: 
            "header header"
            "sidebar main";
          grid-template-columns: 280px 1fr;
          grid-template-rows: 70px 1fr;
          min-height: 100vh;
          background: #f8fafc;
          margin: 0; /* Remove any margin */
          padding: 0; /* Remove any padding */
        }

       

        /* Main Content Styles */
        .main-content {
          grid-area: main;
          padding: 2rem;
          overflow-y: auto;
          background: #f8fafc;
        
        }

        .welcome-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .login-info {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .login-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Stats Grid */
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
          background: linear-gradient(90deg, #1e40af, #10b981);
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

        .stats-change {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .stats-change.positive {
          color: #10b981;
        }

        .stats-change.negative {
          color: #ef4444;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .content-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .view-all-btn {
          color: #1e40af;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover {
          background: #eff6ff;
          transform: translateX(2px);
        }

        /* Case Cards */
        .case-card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .case-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .case-header {
          display: flex;
          justify-content: between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .case-title {
          font-weight: 600;
          font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .case-client {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .case-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
        }

        .case-status, .case-priority {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .case-due {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Client Table */
        .client-table {
          width: 100%;
          border-collapse: collapse;
        }

        .client-table th,
        .client-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .client-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .client-table tr:hover {
          background: #f9fafb;
        }

        .client-status {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .client-status.active {
          background: #d1fae5;
          color: #065f46;
        }

        .client-status.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Analytics Section */
        .analytics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        /* Chat Popup */
        .chat-popup {
          position: fixed;
          bottom: 0px !important;
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
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-tabs {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem;
          gap: 0.5rem;
          background: #f9fafb;
        }

        .chat-tab {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .chat-tab.active {
          background: #1e40af;
          color: white;
        }

        .chat-tab:not(.active) {
          background: #e5e7eb;
          color: #374151;
        }

        .chat-tab:not(.active):hover {
          background: #d1d5db;
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
          background: #1e40af;
          color: white;
        }

        .message.received {
          align-self: flex-start;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
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

        .chat-input input:disabled {
          background: #f9fafb;
          color: #9ca3af;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .quick-action-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
        }

        .quick-action-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1e40af, #10b981);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .quick-action-card:hover::before {
          transform: scaleX(1);
        }

        .quick-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.2);
        }

        .quick-action-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }

        .quick-action-label {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .quick-action-desc {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .new-message-indicator {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          display: inline-block;
          margin-left: 0.5rem;
          animation: pulse 2s infinite;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            grid-template-areas: 
              "header"
              "main";
            grid-template-columns: 1fr;
            grid-template-rows: 70px 1fr;
          }

          aside {
            display: none;
          }

          aside.mobile-open {
            display: block;
            position: fixed;
            top: 70px;
            left: 0;
            width: 230px;
            height: calc(100vh - 70px);
            z-index: 200;
            background: black;
            box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
            overflow-y: scroll !important; 
          }

          .hamburger {
            display: block;
          }

          .header-menu {
            display: ${headerMenuOpen ? 'flex' : 'none'};
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            gap: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .header-menu-item {
            color: #374151 !important;
            padding: 0.75rem;
            border-radius: 6px;
          }

          .header-menu-item:hover {
            background: #f3f4f6;
            color: #1e40af !important;
          }

          .main-content {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .quick-actions {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .chat-popup {
            width: 100% !important;
            height: 100% !impoetant;
            bottom: 5px;
            right: 0px;
            left: 0px;
          }

          .welcome-title {
            font-size: 1.5rem;
          }

          .login-info {
            flex-direction: column;
            gap: 0.5rem;
          }
            .actionbutton
            {
            margin-top:30px !important;
            }
        }

        @media (max-width: 480px) {
          .chat-popup {
            width: 100%;
            height:100% !important;
            bottom: 0px;
            right: 0px;
            left: 0px;
            top:0px;
            border-radius:0px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .case-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .case-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .main-content {
          margin-left:0px
        
        }
           .actionbutton
            {
            margin-top:25px !important;
            }
        }

           @media (max-width: 380px) {
          .chat-popup {
            width: 100%;
            height:100% !important;
            bottom: 0px;
            right: 0px;
            left: 0px;
            top:0px;
            border-radius:0px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .case-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .case-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .main-content {
          margin-left:0px
        
        }
           .actionbutton
            {
            margin-top:15px !important;
            }
        }

      `}</style>

      <div className="dashboard-container">
       <Lawyersidebar/>
       
        {/* MAIN CONTENT */}
        <main className="main-content">
       
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {lawyerdetails?.lawyer?.firstName || 'Lawyer'}! 👋
            </h1>
            <p className="welcome-subtitle">
              Here's what's happening with your practice today.
            </p>
            <div className="login-info">
              <div className="login-info-item">
                <span>🕒</span>
                <span>Last login: {formatLastLogin(lastLogin)}</span>
              </div>
              <div className="login-info-item">
                <span>⏱️</span>
                <span>Today's session: {((Date.now() - sessionStartTime) / (1000 * 60 * 60)).toFixed(1)} hours</span>
              </div>
              <div className="login-info-item">
                <span>📊</span>
                <span>Status: Online</span>
              </div>
            </div>
          </div>

             {/* Quick Actions */}
          <div className="content-section">
            <div className="section-header">
              {/* <h2 className="section-title">⚡ Quick Actions</h2> */}
            </div>
            <div className="quick-actions">
              {menuItems.slice(1, 4).map((item) => (
                <div
                  key={item.label}
                  className="quick-action-card"
                  onClick={() => {
                    if (item.label === 'Messages') {
                      setHasNewMessages(false);
                      setShowChat(true);
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <div className="quick-action-icon">{item.icon}</div>
                  <div className="quick-action-label">
                    {item.label}
                    {item.label === 'Messages' && hasNewMessages && (
                      <span className="new-message-indicator"></span>
                    )}
                  </div>
                  <div className="quick-action-desc">
                    {item.label === 'Profile' && 'Manage your profile'}
                    {item.label === 'Clients' && 'View all clients'}
                    {item.label === 'Messages' && 'Chat with clients'}
                    {/* {item.label === 'My Cases' && 'Manage your cases'} */}
                    {/* {item.label === 'Schedule' && 'View appointments'} */}
                    {/* {item.label === 'Billing' && 'Manage invoices'} */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-value">{clients.length}</div>
              <div className="stats-label">Total Clients</div>
              <div className="stats-change positive">↗ +12% from last month</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{cases.filter(c => c.status === 'Active').length}</div>
              <div className="stats-label">Active Cases</div>
              <div className="stats-change positive">↗ +8% from last week</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{cases.filter(c => c.status === 'Pending').length}</div>
              <div className="stats-label">Pending Cases</div>
              <div className="stats-change negative">↘ -3% from last week</div>
            </div>
            <div className="stats-card">
              <div className="stats-value">{cases.filter(c => c.status === 'Closed').length}</div>
              <div className="stats-label">Closed Cases</div>
              <div className="stats-change positive">↗ +15% this month</div>
            </div>
          </div>

      

    
          <div className="content-grid">
      
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
               <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Client Name</th>
              <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {uniqueChatClients.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: '8px', textAlign: 'center' }}>
                  No clients you have chatted with yet.
                </td>
              </tr>
            ) : (
              uniqueChatClients.slice(-3).map((chat, idx) => {
                const client = allclients.find(ci => ci._id === chat.from);
                if (!client) return null;
                const isOnline = onlineClients.includes(client._id);
                return (
                  <tr key={chat._id}>
                         <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {new Date(client.createdAt).toLocaleString()}
                          </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                      {client.fullName}
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                      <span style={{ color: isOnline ? '#10b981' : '#ef4444' }}>
                        {isOnline ? '🟢 Online' : '🔴 Offline'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

       
         
          </div>

       
        </main>
      </div>

{Object.entries(needsAccept).map(([clientId, needed]) =>
  needed && (
    <div
      key={clientId}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        border: "2px solid #3b82f6",
        borderRadius: 12,
        padding: 24,
        width: 320,
        zIndex: 2500,
        boxShadow: "0 8px 40px #0002"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Chat Request</h3>
      <div style={{ marginBottom: 18 }}>
        This client  wants to chat.<br />
        {messageMap[clientId]?.length > 0 && (
          <span style={{ color: "#6b7280", fontSize: 13 }}>
            Latest: {messageMap[clientId][messageMap[clientId].length - 1].text}
          </span>
        )}
      </div>
      <button
        style={{
          marginRight: 12,
          background: "#22c55e",
          color: "#fff",
          border: 0,
          padding: "0.5rem 1.2rem",
          borderRadius: 18,
          fontWeight: 600
        }}
        onClick={() => {
          setNeedsAccept(prev => ({ ...prev, [clientId]: false }));
          setSessionTimestamps(prev => ({ ...prev, [clientId]: Date.now() }));
          fetchChatHistory(lawyerdetails.lawyer._id, clientId);
          const messageArr = messageMap[clientId];
          if (
            messageArr && 
            messageArr.length > 0 &&
            (!selectedClient || selectedClient._id !== clientId || messages.length === 0)
          ) {
            setMessages([
              { ...messageArr[messageArr.length - 1], isMe: false }
            ]);
          }
          // If you want to auto-select the client after "Accept":
          setSelectedClient(prev => prev && prev._id === clientId ? prev : chatClients.find(c => c._id === clientId));

            socket.emit("chatAccepted", { clientId });
        }}

        
      >
        Accept
      </button>
      <button
        style={{
          background: "#ef4444",
          color: "#fff",
          border: 0,
          padding: "0.5rem 1.2rem",
          borderRadius: 18,
          fontWeight: 600
        }}
        onClick={() => {

           socket.emit("chatRejected", { clientId });

          setNeedsAccept(prev => ({ ...prev, [clientId]: false }));
          if (selectedClient && selectedClient._id === clientId) {
            setMessages([]);
            setSelectedClient(null);
          }
          socket.emit("privateMessage", {
            toUserId: clientId,
            message: "Sorry, the lawyer is busy now. Please try again later.",
            fromUserType: "lawyer",
            timestamp: new Date().toISOString()
          });
        }}

        
      >
        Reject
      </button>
    </div>
  )
)}





{showChat && (
  isMinimized ? (
    // Minimized state: Only blue bar shows
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#2563eb",
        color: "white",
        borderRadius: 12,
        minWidth: 180,
        zIndex: 2000,
        boxShadow: "0 8px 40px #0002",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
      }}
      onClick={() => setIsMinimized(false)}
      title="Restore chat"
    >
      <span style={{ flex: 1, fontWeight: 500 }}>💬 Messages</span>
      <span style={{ fontSize: "18px", marginLeft: 4 }}>🗖</span>
      <button
        onClick={e => { e.stopPropagation(); setShowChat(false); }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          marginLeft: 8,
          padding: 0
        }}
        title="Close"
      >
        ✖
      </button>
    </div>
  ) : (
    // Maximized state: Full chat popup
    <div className="chat-popup" style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      width: 380,
      height: 500,
      background: "white",
      borderRadius: 16,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="chat-header" style={{
        background: "linear-gradient(135deg, #1e40af, #3b82f6)",
        color: "white",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontWeight: 600, fontSize: 17 }}>💬 Messages</span>

        {typingStatus && <div className="typing-indicator" style={{color:"white",paddingRight:"0px",paddingTop:"20px"}}>{typingStatus}</div>}

        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '6px'
            }}
            title="Minimize"
          >
            <FiMinus />
          </button>
          <button
            // onClick={() => setShowChat(false)}
          onClick={() => {
            if(!selectedClient?._id)
            {
              setShowChat(false);
              return;
            }
            Swal.fire({
              title: "Are you sure?",
              text: "Do you really want to close the chat?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, close it!",
                 didOpen: () => {
                  document.querySelector('.swal2-container').style.zIndex = '9999';
                }
            }).then((result) => {
              if (result.isConfirmed) {
                setShowChat(false);
                handleSend("lawyer closed the chat");
                handleShow(); // open modal after confirmation
                Swal.fire("Closed!", "Your chat has been closed.", "success");
              }
            });
          }}

            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer'
            }}
            title="Close"
          >
            ✖
          </button>
        </div>
              
      </div>

      <div className="chat-tabs" style={{
        display: "flex",
        overflowX: "auto",
        borderBottom: "1px solid #e5e7eb",
        padding: "0.5rem",
        gap: "0.5rem",
        background: "#f9fafb"
      }}>
        {chatClients?.map((client) => (
          <div
            key={client._id}
            onClick={() => {
              handleOpenChat(client);
              setHasNewMessages(false);
            }}
            className={`chat-tab ${selectedClient?._id === client._id ? 'active' : ''}`}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: selectedClient?._id === client._id ? "#1e40af" : "#e5e7eb",
              color: selectedClient?._id === client._id ? "white" : "#374151"
            }}
          >
            {client.firstName}
          </div>
        ))}
      </div>

      {/* Accept/Reject Popups for all clients needing accept */}
      {Object.entries(needsAccept).map(
        ([clientId, needed]) =>
          needed && (
            <div
              key={clientId}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                border: "2px solid #3b82f6",
                borderRadius: 12,
                padding: 24,
                width: 320,
                zIndex: 2500,
                boxShadow: "0 8px 40px #0002"
              }}
            >
              <h3 style={{ marginBottom: 10 }}>Chat Request</h3>
              <div style={{ marginBottom: 18 }}>
                This client wants to chat.<br />
                {messageMap[clientId]?.length > 0 && (
                  <span style={{ color: "#6b7280", fontSize: 13 }}>
                    Latest: {messageMap[clientId][messageMap[clientId].length - 1].text}
                  </span>
                )}
              </div>
              <button
                style={{
                  marginRight: 12,
                  background: "#22c55e",
                  color: "#fff",
                  border: 0,
                  padding: "0.5rem 1.2rem",
                  borderRadius: 18,
                  fontWeight: 600
                }}
                onClick={() => {
                  setNeedsAccept(prev => ({ ...prev, [clientId]: false }));
                  setSessionTimestamps(prev => ({ ...prev, [clientId]: Date.now() }));
                  fetchChatHistory(lawyerdetails.lawyer._id, clientId);
                  const messageArr = messageMap[clientId];
                  if (
                    messageArr &&
                    messageArr.length > 0 &&
                    (!selectedClient || selectedClient._id !== clientId || messages.length === 0)
                  ) {
                    setMessages([{ ...messageArr[messageArr.length - 1], isMe: false }]);
                  }
                  setSelectedClient(prev => prev && prev._id === clientId ? prev : chatClients.find(c => c._id === clientId));
                }}
              >
                Accept
              </button>
              <button
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: 0,
                  padding: "0.5rem 1.2rem",
                  borderRadius: 18,
                  fontWeight: 600
                }}
                onClick={() => {
                  setNeedsAccept(prev => ({ ...prev, [clientId]: false }));
                  if (selectedClient && selectedClient._id === clientId) {
                    setMessages([]);
                    setSelectedClient(null);
                  }
                  socket.emit("privateMessage", {
                    toUserId: clientId,
                    message: "Sorry, the lawyer is busy now. Please try again later.",
                    fromUserType: "lawyer",
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                Reject
              </button>
            </div>
          )
      )}

      <div className="chat-messages" style={{
        flex: 1,
        padding: "1rem",
        overflowY: "auto",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        filter: selectedClient && needsAccept?.[selectedClient._id] ? "blur(2px)" : "none",
        pointerEvents: selectedClient && needsAccept?.[selectedClient._id] ? "none" : "auto"
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.isMe ? 'sent' : 'received'}`}
            style={{
              maxWidth: "80%",
              padding: "0.75rem 1rem",
              borderRadius: "18px",
              fontSize: "0.875rem",
              lineHeight: 1.4,
              background: msg.isMe ? "#1e40af" : "white",
              color: msg.isMe ? "white" : "#1f2937",
              border: msg.isMe ? "none" : "1px solid #e5e7eb",
              alignSelf: msg.isMe ? "flex-end" : "flex-start",
              wordWrap: "break-word"
            }}>
            {msg.text}
            {msg.fileUrl && (
              msg.fileType && msg.fileType.startsWith('image/')
                ? 
                 <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: 150, maxHeight: 150, marginTop: 8, borderRadius: 4 }} />
                </a>
                : <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">📄 {msg.fileName}</a>
            )}
            <div style={{
              fontSize: '10px',
              color: msg.isMe ? 'white' : 'black',
              marginTop: '2px',
              textAlign: msg.isMe ? 'right' : 'left'
            }}>
              {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input" style={{
        padding: "1rem",
        borderTop: "1px solid #e5e7eb",
        background: "white",
        width:"90%"
      }}>
                   <input
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
        <input
        value={message}
          type="text"
          placeholder={selectedClient ? "Type a message..." : "Select a client to start chatting"}
          onChange={(e) => setMessage(e.target.value)}
          // onKeyDown={handleSend}
           onKeyDown={(e) => {
                handleLawyerTyping()
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSend(e.target.value.trim());
                  setMessage('');
                }
              }}
              
          disabled={
            !selectedClient ||
            (selectedClient && (needsAccept?.[selectedClient._id] || !isSessionActive(selectedClient._id)))
          }
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
            fontSize: "0.875rem"
          }}
        />
        {selectedClient && (needsAccept?.[selectedClient._id] || !isSessionActive(selectedClient._id)) && (
          <div style={{ color: "red", marginTop: 8, fontSize: 13 }}>
            Accept the chat request to start/continue chatting with this client.
          </div>
        )}

                 <button
                      className="actionbutton"
            type="button"
            // onClick={()=>{handleSendMessage(message);
            //    setMessage('')}
            //   }
            onClick={()=>{handleSend(message);
                        setMessage('')}
                        }
            style={{
              position: 'absolute',
              right: '20px',
              top: '92%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#54656f',
              fontSize: '24px',
              cursor: 'pointer',
              padding: 0,
              margin: 0
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
            position: 'absolute',
            right: '20%',
            top: '92%',
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
            <HiOutlinePaperClip />
        </button>

      </div>

    </div>
  )
)}



      {/* {showProfileModal && (
        <LawyerProfileModal
          onClose={() => setShowProfileModal(false)}
          userDetails={userDetails}
        />
      )} */}

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
        Uploading File...
      </span>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
      </style>
    </div>
  </div>
)}


 <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Form</Modal.Title>
        </Modal.Header>
        <Modal.Body><LawyerFeedbackForm/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default LawyerDashboard;
