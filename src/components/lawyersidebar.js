import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from './socket';
// import logo from '../components/counvoImg/image.png'
import logo from '../components/counvoImg/Counvo Logo-01.png'
import Swal from 'sweetalert2';
import api from '../api';
import { Users } from 'lucide-react';

function Lawyersidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth >= 769) setSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const[missingmessage,setmissingmessage]=useState(0)
const[missingtext,setmissingtext]=useState('')
  useEffect(() => {
    socket.on('missedMessagesNotification', async (notifications) => {
      // Get unique client IDs to fetch
      const clientIds = [...new Set(notifications.map(n => n._id))];
  
      // Fetch clients data from API 
      const clientIdNameMap = {};
      await Promise.all(clientIds.map(async (id) => {
        try {
          const res = await api.get(`/api/user/${id}`);
          clientIdNameMap[id] = res.data.fullName || 'Client';
        } catch {
          clientIdNameMap[id] = 'Client'; // fallback
        }
      }));
  
      // Show notifications with correct names
      notifications.forEach(({ _id: clientId, count }) => {
        const name = clientIdNameMap[clientId] || clientId;
        setmissingmessage(count)
        setmissingtext(`You have ${count} unread message${count > 1 ? 's' : ''} from ${name}.`)
        
        // const name = clientIdNameMap[clientId] || clientId;
        // Swal.fire({
        //   icon: 'info',
        //   title: 'Unread Messages',
        //   text: `You have ${count} unread message${count > 1 ? 's' : ''} from ${name}.`,
        //   timer: 4000,
        //   showConfirmButton: true,
        // });
      });
    });
  
    return () => socket.off('missedMessagesNotification');
  }, []);

  const showmissingmessage=()=>
  {
    //  socket.on('missedMessagesNotification', async (notifications) => {
    //   // Get unique client IDs to fetch
    //   const clientIds = [...new Set(notifications.map(n => n._id))];
  
    //   // Fetch clients data from API 
    //   const clientIdNameMap = {};
    //   await Promise.all(clientIds.map(async (id) => {
    //     try {
    //       const res = await api.get(`/api/user/${id}`);
    //       clientIdNameMap[id] = res.data.fullName || 'Client';
    //     } catch {
    //       clientIdNameMap[id] = 'Client'; // fallback
    //     }
    //   }));
  
    //   // Show notifications with correct names
    //   notifications.forEach(({ _id: clientId, count }) => {
    //     const name = clientIdNameMap[clientId] || clientId;
        Swal.fire({
          icon: 'info',
          title: 'Unread Messages',
          text: missingtext,
          timer: 4000,
          showConfirmButton: true,
        }).then(()=>
        {
          navigate('/lawyerchathistory')
        });
      
 
  
    // return () => socket.off('missedMessagesNotification');

  }


  useEffect(() => {
    const handleReceive = () => setHasNewMessages(true);
    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, []);

  const isActiveMenuItem = (path) =>
    path && (location.pathname === path || location.pathname.includes(path));

  // Sidebar menu with Notifications/Logout as items
  const menuItems = [
    { label: 'Dashboard', icon: '■', path: '/Lawyerdashboard' },
    { label: 'Profile', icon: '◉', path: '/LawyerDashboard/completelawyerprofile' },
    { label: 'Clients', icon: '◎', path: '/lawyerchathistory' },
    { label: 'Support', icon: '◐', path: '/supports' },
    { label: 'Notifications', icon: '◍',  badge: missingmessage || null },
    { label: 'Logout', icon: '◌', logout: true },
  ];

  const handleMenuClick = (item) => {
    if (item.logout) {
      localStorage.removeItem('lawyerDetails');
      navigate('/login');
        Swal.fire({
            icon: 'success',
            title: 'Logout Successfull',
            text: 'You are Successfully Logout..!',
            showConfirmButton: true,
          });
      return;
    }
      if (item.label==="Notifications") {
     showmissingmessage()
    }
    if (item.label === 'Messages') setHasNewMessages(false);
    if (item.path) navigate(item.path);
    if (screenWidth < 769) setSidebarOpen(false);
  };

    // const handleLogout = () => {
    //   socket.disconnect();
    //   localStorage.removeItem('userDetails');
    //   navigate('/login');
    // };

  // Backdrop for mobile sidebar
  const renderBackdrop = () =>
    screenWidth < 769 && sidebarOpen ? (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', zIndex: 998,
        }}
        onClick={() => setSidebarOpen(false)}
      />
    ) : null;

  return (
    <div>
      <style>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
        }
        .dashboard-container {
          display: grid;
          grid-template-areas: "header header" "sidebar main";
          grid-template-columns: 250px 1fr;
          grid-template-rows: 70px 1fr;
          min-height: 100vh;
          background: #f8fafc;
        }
        header {
          grid-area: header;
          background: white;
          color: black;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          position: fixed;
          top: 0; left: 0; right: 0; height: 70px; z-index:1001;
          width: 100%;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          display:flex;
          align-items:center;
          gap:.75rem;
          color: black;
        }
        .hamburger {
          display: none;
          font-size: 2rem;
          cursor: pointer;
          color: black;
          background:white;
          border:none;
        }

        aside {
          grid-area: sidebar;
          background: white;
          overflow-y: auto;
          box-shadow: 4px 0 6px -1px rgba(108,104,104,.5);
          position: fixed;
          top: 40px;
          left: 0;
          width: 250px;
          height: calc(100vh - 40px);
          z-index: 999;
          transition: transform 0.25s;
          transform: translateX(0);
        }
        .sidebar-menu {
          list-style: none;
          padding: 1rem 0;
        }
        .sidebar-item {
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          color: black;
          font-weight: 500;
          transition: all 0.3s;
          border-left: 3px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.25rem 0;
        }
        .sidebar-item:hover, .sidebar-item.active {
          background: linear-gradient(90deg,rgba(4, 0, 0, 1),rgba(0, 0, 0, 0.05));
          color: #fff;
          border-left-color: #fff;
          font-weight: 600;
        }
        .sidebar-item span:first-child {
          font-size: 1.2rem;
        }
        .sidebar-badge {
          
          background: #ef4444;
          color: white;
          border-radius: 9999px;
          padding: 0.10rem 0.47rem;
          font-size: 0.75rem; font-weight:600;
          margin-left: .5rem;
          animation: pulse 2s infinite;
        }
        .new-message-indicator {
          width: 8px; height: 8px; background: #ef4444;
          border-radius: 50%; margin-left: auto;
          animation: pulse 2s infinite; box-shadow: 0 0 6px #ef4444;
        }
        @keyframes pulse { 0%,100% {opacity:1;} 50%{opacity:.7;} }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-container { grid-template-columns: 0 1fr;}
          aside {
          color:black;
         background: white;
            left: 0;
            width: 75vw; max-width: 280px;
            height: calc(100vh - 70px);
            transform: translateX(-101%);
            box-shadow: 4px 0 16px 2px rgba(20,20,20,0.25);
            transition: transform .28s cubic-bezier(.5,1,.7,1);
          }
          aside.mobile-open {
            display: block;
            background:white;
            transform: translateX(0);
            z-index: 999;
          }
          .hamburger { display: block !important;}
        }
        @media (max-width: 600px) {
          .logo-text { font-size: 1.09rem;}
          aside { width: 80vw;color:black; background: white; }
        }
      `}</style>
      <header>
        <div className="logo-text">
          <img src={logo} style={{ height: "150px" }} alt="logo" />
         
        </div>
        {screenWidth < 769 && (
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
        )}
      </header>
      {renderBackdrop()}
      <aside className={sidebarOpen && screenWidth < 769 ? 'mobile-open' : ''}>
         {/* <div className="logo-text">
                  <img src={logo} style={{ height: "50px" }} alt="logo" />
                </div> */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`sidebar-item ${isActiveMenuItem(item.path) ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.label === 'Messages' && hasNewMessages && (
                <span className="new-message-indicator"></span>
              )}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Lawyersidebar;
