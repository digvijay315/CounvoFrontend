import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import socket from './socket';
import logo from '../components/counvoImg/Counvo - LOGO (1).png'

function Clientsidebar() {
   const [showProfileModal, setShowProfileModal] = useState(false);
   const [userDetails, setUserDetails] = useState(null);
   const [loading, setLoading] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
   const [hasNewMessages, setHasNewMessages] = useState(false);
   
   const navigate = useNavigate();
   const location = useLocation();
   const [screenWidth, setScreenWidth] = useState(window.innerWidth);

   const userData = JSON.parse(localStorage.getItem('userDetails'));

   useEffect(() => {
     const handleResize = () => setScreenWidth(window.innerWidth);
     window.addEventListener('resize', handleResize);

     const handleReceive = ({ from, message }) => {
       console.log('📨 New message from lawyer:', message);
       setHasNewMessages(true);
     };

     socket.on('receiveMessage', handleReceive);

     return () => {
       window.removeEventListener('resize', handleResize);
       socket.off('receiveMessage', handleReceive);
     };
   }, []);

   // Function to determine if a menu item is active
   const isActiveMenuItem = (path) => {
     if (!path) return false;
     return location.pathname === path || location.pathname.includes(path);
   };

   const menuItems = [
     { 
       label: 'Dashboard', 
       icon: (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
           <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
         </svg>
       ), 
       path: '/ClientDashboard' 
     },
     { 
       label: 'Find Lawyer', 
       icon: (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
         </svg>
       ), 
       path: '/findlawyer' 
     },
    //  { 
    //    label: 'Consultations', 
    //    icon: (
    //      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    //      </svg>
    //    ), 
    //    path: '/consultations' 
    //  },
    //  { 
    //    label: 'Messages', 
    //    icon: (
    //      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    //      </svg>
    //    ), 
    //    path: '/messages' 
    //  },
    //  { 
    //    label: 'Documents', 
    //    icon: (
    //      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    //      </svg>
    //    ), 
    //    path: '/documents' 
    //  },
    //  { 
    //    label: 'Payments', 
    //    icon: (
    //      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    //        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    //      </svg>
    //    ), 
    //    path: '/payments' 
    //  },
     { 
       label: 'Profile', 
       icon: (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
         </svg>
       ), 
       path: '/clientprofile' 
     },
     { 
       label: 'Support', 
       icon: (
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
         </svg>
       ), 
       path: '/supports' 
     },
   ];

   const handleLogout = () => {
     localStorage.removeItem('userDetails');
     navigate('/login');
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

         /* Header Styles */
         .client-header {
           background: linear-gradient(135deg,rgb(7, 25, 85) 0%, #3b82f6 100%);
           color: white;
           padding: 1rem 2rem;
           display: flex;
           justify-content: space-between;
           align-items: center;
           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
           width: 100%;
           height: 70px;
           z-index: 1000;
           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
         }

         .logo-text {
           font-size: 1.5rem;
           font-weight: 700;
           letter-spacing: -0.025em;
           display: flex;
           align-items: center;
           gap: 0.5rem;
         }

         .hamburger {
           display: none;
           flex-direction: column;
           cursor: pointer;
           padding: 0.5rem;
           border-radius: 0.375rem;
           transition: background-color 0.2s ease;
         }

         .hamburger:hover {
           background: rgba(255, 255, 255, 0.1);
         }

         .hamburger-line {
           width: 25px;
           height: 3px;
           background: white;
           margin: 2px 0;
           border-radius: 2px;
           transition: all 0.3s ease;
         }

         .profile-section {
           display: flex;
           align-items: center;
           gap: 1rem;
         }

         .profile-avatar {
           width: 42px;
           height: 42px;
           border-radius: 50%;
           background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
           color: white;
           font-weight: 700;
           font-size: 1rem;
           display: flex;
           align-items: center;
           justify-content: center;
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
           cursor: pointer;
           transition: transform 0.2s ease;
         }

         .profile-avatar:hover {
           transform: scale(1.05);
         }

         .profile-info {
           display: flex;
           flex-direction: column;
           align-items: flex-end;
         }

         .profile-name {
           font-size: 0.875rem;
           font-weight: 600;
           opacity: 0.9;
         }

         .profile-role {
           font-size: 0.75rem;
           opacity: 0.7;
         }

         /* Sidebar Styles */
         .client-sidebar {
           background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
           width: 250px;
           height: calc(100vh - 70px);
           position: fixed;
           top: 70px;
           left: 0;
           overflow-y: auto;
           box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.3);
           transition: transform 0.3s ease;
           z-index: 100;
         }

         .sidebar-menu {
           list-style: none;
           padding: 1.5rem 0;
         }

         .sidebar-item {
           padding: 0.875rem 1.5rem;
           cursor: pointer;
           color: #d1d5db;
           font-weight: 500;
           transition: all 0.3s ease;
           border-left: 3px solid transparent;
           display: flex;
           align-items: center;
           gap: 0.875rem;
           margin: 0.25rem 0;
           font-size: 0.95rem;
         }

         .sidebar-item:hover {
           background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%);
           color: #ffffff;
           border-left-color: #3b82f6;
           transform: translateX(4px);
           box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.1);
         }

         .sidebar-item.active {
           background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
           color: #ffffff;
           border-left-color: #3b82f6;
           font-weight: 600;
           box-shadow: inset 0 0 15px rgba(59, 130, 246, 0.15);
         }

         .sidebar-item svg {
           color: currentColor;
           transition: color 0.2s ease;
           flex-shrink: 0;
         }

         .new-message-indicator {
           width: 8px;
           height: 8px;
           background: #ef4444;
           border-radius: 50%;
           margin-left: auto;
           animation: pulse 2s infinite;
           box-shadow: 0 0 6px #ef4444;
         }

         .logout-section {
           margin-top: auto;
           border-top: 1px solid #374151;
           padding-top: 1rem;
         }

         .logout-item {
           color: #fca5a5;
         }

         .logout-item:hover {
           background: linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
           color: #ff6b6b;
           border-left-color: #ef4444;
         }

         /* Scrollbar styling */
         .client-sidebar::-webkit-scrollbar {
           width: 6px;
         }

         .client-sidebar::-webkit-scrollbar-track {
           background: #1f2937;
         }

         .client-sidebar::-webkit-scrollbar-thumb {
           background: #374151;
           border-radius: 3px;
         }

         .client-sidebar::-webkit-scrollbar-thumb:hover {
           background: #4b5563;
         }

         @keyframes pulse {
           0%, 100% { opacity: 1; }
           50% { opacity: 0.7; }
         }

         /* Mobile responsive */
         @media (max-width: 768px) {
           .hamburger {
             display: flex;
           }

           .profile-info {
             display: none;
           }

           .client-sidebar {
             transform: translateX(-100%);
           }

           .client-sidebar.mobile-open {
             transform: translateX(0);
           }

           .logo-text {
             font-size: 1rem;
           }
         }

         /* Backdrop for mobile */
         .sidebar-backdrop {
           display: none;
           position: fixed;
           top: 70px;
           left: 0;
           right: 0;
           bottom: 0;
           background: rgba(0, 0, 0, 0.5);
           z-index: 99;
         }

         .sidebar-backdrop.show {
           display: block;
         }
       `}</style>

       {/* Header */}
       <header className="client-header">
         <div className="logo-text">
           <span><img src={logo} style={{height:"40px"}}></img></span>
           <span>Client Portal</span>
         </div>

         <div 
           className="hamburger" 
           onClick={() => setSidebarOpen(!sidebarOpen)}
         >
           <div className="hamburger-line"></div>
           <div className="hamburger-line"></div>
           <div className="hamburger-line"></div>
         </div>

         <div className="profile-section">
           <div className="profile-info">
             <div className="profile-name">
               {userData?.user?.fullName || 'Client'}
             </div>
             <div className="profile-role">Client Account</div>
           </div>
           <div className="profile-avatar">
             {userData?.user?.fullName 
               ? userData.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
               : 'C'
             }
           </div>
         </div>
       </header>

       {/* Sidebar Backdrop for Mobile */}
       <div 
         className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
         onClick={() => setSidebarOpen(false)}
       ></div>

       {/* Sidebar */}
       <aside className={`client-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
         <ul className="sidebar-menu">
           {menuItems.map((item, index) => (
             <li
               key={index}
               className={`sidebar-item ${isActiveMenuItem(item.path) ? 'active' : ''}`}
               onClick={() => {
                 if (item.label === 'Messages') {
                   setHasNewMessages(false);
                 }
                 navigate(item.path);
                 setSidebarOpen(false);
               }}
             >
               {item.icon}
               <span>{item.label}</span>
               {item.label === 'Messages' && hasNewMessages && (
                 <span className="new-message-indicator"></span>
               )}
             </li>
           ))}
           
           <div className="logout-section">
             <li className="sidebar-item logout-item" onClick={handleLogout}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
               </svg>
               <span>Logout</span>
             </li>
           </div>
         </ul>
       </aside>
     </>
   );
}

export default Clientsidebar;
