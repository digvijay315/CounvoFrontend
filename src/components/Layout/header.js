import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from '../../components/counvoImg/Counvo - LOGO (1).png';
import logo from '../../components/counvoImg/Counvo Logo-01.png'
import Swal from 'sweetalert2';
import api from '../../api';
import socket from '../socket';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userDetails'));

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    Swal.fire({
      icon: 'success',
      title: 'Logout Successfull',
      text: 'You are Successfully Logout..!',
      showConfirmButton: true,
    });
    navigate('/');
    setMenuOpen(false);
  };

  // Helper to check active path (for subpaths)
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };


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
            const res = await api.get(`/api/lawyer/getlawyer/${id}`);
            clientIdNameMap[id] = res.data.firstName || 'Lawyer';
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
            navigate('/clientchathistory')
          });
        
   
    
      // return () => socket.off('missedMessagesNotification');
  
    }

  return (
    <>
      <style>{`
        .header {
          display: flex;
          align-items: flex-start;
          height: 80px; 
          justify-content: space-between;
          background: #fff;
          padding: 10px 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo {
          margin-top:-70px;
          height: 200px;
          cursor: pointer;
          object-fit: contain;
        }
          .logo1 {
          height: 50px;
          cursor: pointer;
          margin-left:-100
        }

        .nav-links {
          margin-top:10px !important;
          color: black;
          display: flex;
          gap: 30px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links li {
        
          cursor: pointer;
          font-weight: 500;
          position: relative;
          transition: color 0.2s;
        }

        .nav-links li.active {
          color: #1956d2;
        }

        .nav-links li.active::after {
          content: '';
          display: block;
          margin: 0 auto;
          width: 60%;
          border-bottom: 3px solid #1956d2;
          border-radius: 2px;
          animation: underlineGrow 0.3s cubic-bezier(.4,0,.2,1);
        }

        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 60%; }
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
        }

        .hamburger span {
          width: 25px;
          height: 3px;
          background: #333;
        }

        @media (max-width: 768px) {
          .nav-links {
            position: fixed;
            top:70px;
            left: 0;
            right: 0;
            background: #fff;
            flex-direction: column;
            gap: 20px;
            padding: 30px;
            transform: translateY(-120%);
            transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          }

           .logo {
           margin-top:-40px;
          height: 150px;
          cursor: pointer;
          object-fit: contain;
        }

          .nav-links.open {
            transform: translateY(0);
          }

          .hamburger {
          margin-top:30px !important;
            display: flex;
          }
        }
      `}</style>

      <header className="header">
            <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => { navigate('/'); setMenuOpen(false); }}
        />
      
       

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li
            className={isActive('/') ? 'active' : ''}
            onClick={() => { navigate('/'); setMenuOpen(false); }}
          >
            Home
          </li>
          <li
            className={isActive('/about') ? 'active' : ''}
            onClick={() => { navigate('/aboutus'); setMenuOpen(false); }}
          >
            About
          </li>
          <li
            className={isActive('/contact') ? 'active' : ''}
            onClick={() => { navigate('/contactus'); setMenuOpen(false); }}
          >
            Contact
          </li>
{userData?.user && (
  <li 
    style={{ position: 'relative', cursor: 'pointer' }} 
    onClick={() => setSubmenuOpen(!submenuOpen)}
  >
    <span style={{ fontWeight: 'bold', color: 'blue' }}>
      {userData.user.fullName} &#9662; {/* ▼ icon */}
    </span>
   <ul style={{
  width: "200px",
  position: 'absolute',
  top: '100%',
  right: 0,                  // change this!
  background: '#fff',
  listStyle: 'none',
  padding: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  display: submenuOpen ? 'block' : 'none',
  zIndex: 1000
}}>

      <li onClick={() => { navigate('/findlawyer'); setMenuOpen(false); setSubmenuOpen(false); }}>Find Lawyer</li>
      <li onClick={() => { navigate('/clientprofile'); setMenuOpen(false); setSubmenuOpen(false); }}>Profile</li>
      {/* <li onClick={() => { navigate('/supports'); setMenuOpen(false); setSubmenuOpen(false); }}>Supports</li> */}
      <li onClick={() => { navigate('/clientchathistory'); setMenuOpen(false); setSubmenuOpen(false); }}>History</li>
      {/* <li onClick={() => { navigate('/termsandconditions'); setMenuOpen(false); setSubmenuOpen(false); }}>Terms & Conditions</li> */}
       <li onClick={() => { showmissingmessage(); setMenuOpen(false); setSubmenuOpen(false); }}>Notifications <span style={{color:"red",fontWeight:"bold"}}>{missingmessage}</span> </li>
        {/* Dropdown Help Menu */}
      <li
        style={{ position: "relative", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(); // prevent menu close
          setHelpOpen(!helpOpen);
        }}
      >
        Help ▾
        {helpOpen && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              background: "white",
              border: "1px solid #ddd",
              padding: "5px 10px",
              listStyle: "none",
              minWidth: "180px",
              zIndex: 1000
            }}
          >
            <li onClick={() => { navigate('/privacy-policy'); setMenuOpen(false); setSubmenuOpen(false); }}>Privacy Policy</li>
            <li onClick={() => { navigate('/supports'); setMenuOpen(false); setSubmenuOpen(false); }}>Support</li>
            <li onClick={() => { navigate('/termsandconditions'); setMenuOpen(false); setSubmenuOpen(false); }}>Terms & Conditions</li>
          </ul>
        )}
      </li>
     
      <li onClick={() => { handleLogout(); setMenuOpen(false); setSubmenuOpen(false); }}>Logout</li>
    </ul>
  </li>
)}


          <li
            onClick={() => { navigate('/login'); setMenuOpen(false); }}
            style={{ display: userData?.user ? "none" : "block" }}
            className={isActive('/login') ? 'active' : ''}
          >
            Login
          </li>
        </ul>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
    </>
  );
}
