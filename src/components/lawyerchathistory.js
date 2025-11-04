import React, { useState, useEffect, useRef } from 'react';
import Lawyersidebar from './lawyersidebar';
import socket from './socket';
import Swal from 'sweetalert2';
import api from '../api';
import Header from './Layout/header';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';

function LawyerChatHistory() {
  const lawyerdetails = JSON.parse(localStorage.getItem('lawyerDetails')); // should be lawyer info

  const [recentChats, setRecentChats] = useState([]);
  const [onlineClients, setOnlineClients] = useState([]);
  const [clients, setClients] = useState([]); // all clients who ever chatted
  const [chatClient, setChatClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offlineNotified, setOfflineNotified] = useState({});
  const inputRef = useRef();

  // Fetch all recent chat history for this lawyer
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
    setClients(allClients);
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  useEffect(() => {
    fetchClientsData();
  }, [recentChats.length]);



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
  
  

  // Online clients (if you have this)
  useEffect(() => {
    if (!lawyerdetails.lawyer._id) return;
    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      socket.emit('lawyerOnline', lawyerdetails.lawyer._id);
      socket.emit('getOnlineClients');
    });

    socket.on('onlineClientsList', ids => {
      setOnlineClients(ids);
    });

    socket.on('receiveMessage', ({ from, message }) => {
      // Notification for lawyer if not in this chat
      if (!chatClient || chatClient._id !== from) {
        setOfflineNotified(prev => ({
          ...prev,
          [from]: true
        }));
        Swal.fire({
          icon: 'info',
          title: 'New Message',
          text: 'Client sent you a message!',
          timer: 2000,
          showConfirmButton: false
        });
      }
      if (chatClient && chatClient._id === from) {
        setMessages(prev => [...prev, { text: message, isMe: false }]);
        setOfflineNotified(prev => ({
          ...prev,
          [from]: false
        }));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('onlineClientsList');
      socket.disconnect();
    };
  }, [lawyerdetails.lawyer._id, chatClient]);


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



  // Fetch full chat with this client
  const handleOpenChat = async (client) => {
    setChatClient(client);
    markMessagesRead(client._id)
    setOfflineNotified(prev => ({
      ...prev,
      [client._id]: false
    }));
    const lawyerId = lawyerdetails.lawyer._id;
   await fetchChatHistory(lawyerId,client._id)
  };

  // Send a message to client
  const handleSendMessage = msgText => {
    if (!msgText.trim() || !chatClient) return;
    socket.emit('privateMessage', {
      toUserId: chatClient._id,
      message: msgText,
      fromUserType: 'lawyer',
      timestamp: new Date().toISOString()
    });
    setMessages(prev => [
      ...prev,
      { text: msgText, isMe: true, timestamp: new Date().toISOString() }
    ]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fb' }}>
   <Lawyersidebar />
      <div style={{ display: 'flex' }}>
       

        <div
          style={{
            flex: 1,
            marginLeft: "20%",
            marginTop:"7%",
            padding:"20px"
            // background: '#fff',
          }}
          className="main-content"
        >
          <h2>Your Clients</h2>
          <div className="lawyers-grid">
            {uniqueChatClients.length === 0 ? (
              <div>No clients you have chatted with yet.</div>
            ) : (
              uniqueChatClients.map((chat, idx) => {
                const client = clients.find(ci => ci._id === chat.from);
                if (!client) return null;
                const isOnline = onlineClients.includes(client._id);
                const hasUnread = offlineNotified[client._id];
                return (
                  <div
                    key={chat._id}
                    className="lawyer-card"
                    style={
                      hasUnread
                        ? { border: "2px solid #3b82f6", background: "#eff6ff" }
                        : undefined
                    }
                  >
                    <img
                      src={client.profilepic}
                      alt={client.firstName}
                      className="lawyer-avatar"
                    />
                    <div className="lawyer-name">
                      {client.fullName}
                      {hasUnread && (
                        <span
                          style={{
                            color: "#2563eb",
                            fontWeight: "bold",
                            marginLeft: 8,
                            fontSize: "0.9em"
                          }}
                        >
                          • New
                        </span>
                      )}
                    </div>
                    <div className="lawyer-status">
                      <span style={{ color: isOnline ? "#10b981" : "#ef4444" }}>
                        {isOnline ? "🟢 Online" : "🔴 Offline"}
                      </span>
                    </div>
                    <div className="lawyer-details">
                      {/* <div>
                        <strong>Mobile:</strong> {client.contact_no}
                      </div> */}
                      {/* <div>
                        <strong>Email:</strong> {client.email}
                      </div> */}
                    </div>
                    {/* <div className="chat-message">
                      <strong>Last Message:</strong> {chat.message}
                    </div> */}
                    <div className="lawyer-actions">
                      <button
                        className="action-btn"
                        title="Chat"
                        onClick={() => handleOpenChat(client)}
                        style={{ background: "#2563eb", color: "#fff" }}
                      >
                        💬 Chat
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Popup */}
          {chatClient && (
            <div className="chat-popup" style={{ right: 80 }}>
              <div className="chat-header">
                <div>
                  <b>
                    {chatClient.fullName}
                  </b>
                  <div style={{ fontSize: 12, color: "#444" }}>
                    {onlineClients.includes(chatClient._id)
                      ? "🟢 Online"
                      : "🔴 Offline"}
                  </div>
                </div>
                <button
                  className="action-btn"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => setChatClient(null)}
                >
                  ✖
                </button>
              </div>
              <div className="chat-messages" style={{ height: 300, overflow: "auto" }}>
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
              <div className="chat-input">
                <input
                  ref={inputRef}
                  style={{ width: '80%', marginRight: 4 }}
                  type="text"
                  placeholder="Type a message..."
                  onKeyDown={e => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      handleSendMessage(e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
                  
                {/* <button
                  className="actionbutton"
                  style={{ width: 38 }}
                  onClick={() => {
                    if (inputRef.current && inputRef.current.value.trim()) {
                      handleSendMessage(inputRef.current.value.trim());
                      inputRef.current.value = '';
                    }
                  }}
                >
                  ➤
                </button> */}

              <button
                                className="actionbutton"
                      type="button"
                      onClick={() => {
                        if (inputRef.current && inputRef.current.value.trim()) {
                          handleSendMessage(inputRef.current.value.trim());
                          inputRef.current.value = '';
                        }
                      }}
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
                          // onClick={() => fileInputRef.current.click()}
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
          )}

          {isLoading && (
            <div
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99
              }}
            >
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
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
       width:85%;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  gap: 0.5rem;
}


      .chat-input input {
  flex: 1 1 auto;

  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
  background: #fff;
}
  .actionbutton{
        margin-top:10px !important;
      
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
  .main1 {
    margin-left: 0px;
  }
  .lawyers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .chat-popup {
    width: 100vw;
    height: 100% !important;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
  .chat-header {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    height: 56px;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
  .header-actions {
    margin-left: 0;
    margin-top: 0;
    display: flex;
    gap: 0.5rem;
  }
 .chat-input {
    padding-bottom: 2.5rem;
    gap: 0.25rem;
     width:90%;
  }
  .chat-input input {
    font-size: 1rem;
    padding: 0.65rem 1rem;
 
  }
    .actionbutton
    {
    margin-top:-10px !important;
    }

  select {
    min-width: 100% !important;
  }
  .main1 > div {
    padding: 20px 8px !important;
  }
    
}

      
        
      `}</style>
    </div>
  );
}

export default LawyerChatHistory;
