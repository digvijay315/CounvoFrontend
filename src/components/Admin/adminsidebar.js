import React, { useState,useEffect } from 'react';
import '../../css/adminpanel.css';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
  FaUserTie, FaGavel, FaUsers, FaFolderOpen, FaCalendarAlt,
  FaDollarSign, FaCog, FaClock, FaBell, FaEnvelope,
  FaChartBar, FaSignOutAlt, FaBars
} from 'react-icons/fa';

const Adminsidebar = () => {

    const [pendingLawyers, setPendingLawyers] = useState([]);
        const [lawyers, setLawyers] = useState([]);
 const fetchlawyers=async()=>
  {
    try {
      const resp=await api.get('api/lawyer/getalllawyerprofile')
      setLawyers(resp.data.filter((item)=>(item.status==="verified")))
      setPendingLawyers(resp.data.filter((item)=>(item.status!=="verified")))
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    fetchlawyers();
  }, []);

  


    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate(); // 🧭 for routing

    const toggleSidebar = () => setIsOpen(!isOpen);



  const menuItems = [
    { icon: <FaUserTie />, label: 'Dashboard',route:'/Adminpanel' },
    // { icon: <FaGavel />, label: 'Cases' },
    { icon: <FaUsers />, label: 'Clients', route: '/allclients', },
    // { icon: <FaFolderOpen />, label: 'Documents' },
    // { icon: <FaCalendarAlt />, label: 'Appointments' },
    { icon: <FaDollarSign />, label: 'Payments' },
    { icon: <FaCog />, label: 'Settings' },
    {
      icon: <FaClock />,
      label: 'Pending Approvals',
      route: '/pendinglawyers',
      badge: pendingLawyers.length
    },
    { icon: <FaBell />, label: 'Notifications' },
    { icon: <FaEnvelope />, label: 'Messages',route: '/allchat', },
    { icon: <FaChartBar />, label: 'Reports',route:'/admin-report' },
    { icon: <FaSignOutAlt />, label: 'Logout',route: '/login' }
  ];



  return (
    <div className={`sidebar-modern ${isOpen ? 'open' : 'closed'}`} style={{zIndex:"9999"}}>
      {/* Header */}
      <div className="sidebar-header" style={{marginTop:"5px"}}>
        <h2 style={{color:"white"}}>{isOpen ? 'Admin Panel' : 'AP'}</h2>
        <FaBars className="toggle-icon" onClick={toggleSidebar} />
      </div>

      {/* Scrollable Menu */}
      <div className="menu-scroll">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => item.route && navigate(item.route)}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && (
              <>
                <span className="label">{item.label}</span>
                {item.badge && (
                  <span className="badge" style={{color:"red"}}>{item.badge}</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Adminsidebar;

