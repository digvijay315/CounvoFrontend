import React, { useEffect, useState } from 'react'
import api from '../../api'
import Adminsidebar from '../Admin/adminsidebar'
import '../../css/allchat.css'
function Allchat() {

    const[allchat,setallchat]=useState([])
     const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

    const getallchat=async()=>
    {
        try {
            const resp=await api.get('api/admin/chathistory')
            setallchat(resp.data)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>
    {
        getallchat()

    },[])
  
 
  
    


function groupByConversation(messages) {
  const convMap = {};

  messages.forEach(msg => {
    let user, lawyer;

    // find who is user and who is lawyer for this msg
    if (msg.fromModel === "User") {
      user = msg.from;
      lawyer = msg.to;
    } else {
      user = msg.to;
      lawyer = msg.from;
    }
    if (!user || !lawyer) return; // Defensive (shouldn't happen if populated)

    const key = user._id + "|" + lawyer._id;
    if (!convMap[key]) {
      convMap[key] = {
        user,
        lawyer,
        messages: []
      };
    }
    convMap[key].messages.push(msg);
  });

  // Sort messages by timestamp for each conversation
  Object.values(convMap).forEach(conv =>
    conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  );

  return Object.values(convMap);
}


 useEffect(() => {
    setConversations(groupByConversation(allchat));
  }, [allchat]);
     
  return (
 <div>
  <Adminsidebar />
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <div className="allchat-listview">
      <div className="allchat-list-title">All Chats</div>
      <div className="allchat-list-items">
        {conversations.length === 0 && (
          <div className="allchat-empty">No Conversations</div>
        )}
        {conversations.map((conv, idx) => (
          <div
            className={
              "allchat-list-item" +
              (selectedConv === conv ? " allchat-selected" : "")
            }
            key={idx}
            onClick={() => setSelectedConv(conv)}
          >
            <img
              src={
                conv.user?.profilepic ||
                "https://ui-avatars.com/api/?background=ff0879&color=fff&name=" +
                  (conv.user?.fullName || "Client")
              }
              className="profile-pic"
              alt="User"
            />
            <div className="allchat-item-content">
              <div className="allchat-names">
                <b>{conv.user?.fullName || "Client"}</b>
                <span style={{ color: "#888", fontWeight: 400 }}>with</span>
                <b style={{ color: "#2b67e9" }}>{conv.lawyer?.firstName || "Lawyer"}</b>
              </div>
              <div className="allchat-preview">
                {conv.messages[conv.messages.length - 1]?.message?.slice(0, 35) || ""}
              </div>
              <span className="allchat-msgcount">
                {conv.messages.length} msgs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="allchat-detailsview">
      {!selectedConv ? (
        <div className="allchat-welcome">
          Select a conversation to view messages
        </div>
      ) : (
        <div className="allchat-chatbox">
          <div className="allchat-chatbox-header">
            <img
              src={
                selectedConv.user?.profilepic ||
                "https://ui-avatars.com/api/?background=ff0879&color=fff&name=" +
                  (selectedConv.user?.fullName || "Client")
              }
              alt="User"
              className="profile-pic"
              style={{ width: 38, height: 38, marginRight: 12 }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: "17px" }}>
                {selectedConv.user?.fullName || "Client"}{" "}
                <span style={{ fontWeight: 400, color: "#aaa" }}>with</span>{" "}
                <span style={{ color: "#3159e1" }}>
                  {selectedConv.lawyer?.firstName || "Lawyer"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>
                {selectedConv.messages.length} messages
              </div>
            </div>
            <button
              className="close-btn"
              style={{
                marginLeft: "auto",
                borderRadius: "100%",
                border: "none",
                background: "#f5f5f5",
                fontSize: 22,
                color: "#888",
                cursor: "pointer"
              }}
              onClick={() => setSelectedConv(null)}
            >
              ×
            </button>
          </div>
          <div className="allchat-messages-area">
            {selectedConv.messages.map((msg, i) => (
              <div
                key={i}
                className={
                  "msg-row " +
                  (msg.fromModel === "User" ? "msg-client" : "msg-lawyer")
                }
              >
                <div className="msg-bubble">
                  {msg.message}
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>


  </div>
</div>

  )
}

export default Allchat
