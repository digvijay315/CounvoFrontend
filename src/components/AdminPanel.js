import React, { useState, useEffect } from 'react';
import api from '../api';
import { Offcanvas, Button, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../css/adminpanel.css'
import Adminsidebar from './Admin/adminsidebar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';
import { FaCheck, FaTimes, FaEye, FaClock, FaUsers, FaUserTie, FaChartLine } from 'react-icons/fa';
import LawyerProfileTabs from './viewlawyerinfo';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentLawyers, setRecentLawyers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [loginActivityData, setLoginActivityData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminSessionStart] = useState(Date.now());

  // Time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
    
  }, []);

  const getSessionDuration = () => {
    return ((Date.now() - adminSessionStart) / (1000 * 60 * 60)).toFixed(1);
  };


  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  // Generate realistic session data
  const generateSessionData = () => {
    const hours = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date();
      hour.setHours(hour.getHours() - i);
      hours.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        activeSessions: Math.floor(Math.random() * 50) + 10,
        newLogins: Math.floor(Math.random() * 15) + 2,
      });
    }
    return hours;
  };

  // Generate login activity data
  const generateLoginActivityData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toLocaleDateString(),
        lawyers: Math.floor(Math.random() * 20) + 5,
        users: Math.floor(Math.random() * 50) + 15,
        totalLogins: Math.floor(Math.random() * 70) + 20,
      });
    }
    return days;
  };

  useEffect(() => {
    setSessionData(generateSessionData());
    setLoginActivityData(generateLoginActivityData());
    
    // Update session data every 5 minutes
    const interval = setInterval(() => {
      setSessionData(generateSessionData());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

   
  // Your existing fetch functions...
  const fetchlawyers = async () => {
    try {
      const resp = await api.get('api/lawyer/getalllawyerprofile');
      setLawyers(resp.data.filter((item) => (item.status === "verified")));
      setPendingLawyers(resp.data.filter((item) => (item.status !== "verified")));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchusers = async () => {
    try {
      const resp = await api.get('api/user');
      setUsers(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchlawyers();
    fetchusers();
  }, []);

  // Your existing functions...
  const groupByMonth = (data) => {
    const counts = {};
    data.forEach((item) => {
      const date = new Date(item.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      counts[month] = (counts[month] || 0) + 1;
    });
    return counts;
  };

  const generateChartData = (lawyers, users) => {
    const lawyerCounts = groupByMonth(lawyers);
    const userCounts = groupByMonth(users);
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = allMonths.map(month => ({
      month,
      lawyers: lawyerCounts[month] || 0,
      users: userCounts[month] || 0,
    }));

    return chartData;
  };

  useEffect(() => {
    if (lawyers.length && users.length) {
      const data = generateChartData(lawyers, users);
      setChartData(data);
    }
  }, [lawyers, users]);

  // Your existing handler functions...
  const handleApprove = async (lawyer) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to approve ${lawyer.firstName} ${lawyer.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      try {
        const resp = await api.put(`api/lawyer/approvedlawyer/${lawyer._id}`, { status: "verified" });
        if (resp.status === 200) {
          setLawyers(prev => [...prev]);
          Swal.fire({
            icon: 'success',
            title: 'Approved!',
            text: 'Lawyer approved successfully.',
            showConfirmButton: true,
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong while approving the lawyer.',
        });
      }
    }
  };

  const [show, setShow] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [lawyerprofile, setlawyerprofile] = useState([]);
  const [activeTab1, setActiveTab1] = useState('dashboard');

  const handleview = async (lawyerid) => {
    try {
      const resp = await api.get(`api/lawyer/getlawyer/${lawyerid}`);
      if (resp.status === 200) {
        handleShow(resp.data);
        setlawyerprofile(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShow = (lawyer) => {
    setSelectedLawyer(lawyer);
    setActiveTab1('basic');
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedLawyer(null);
  };

  const handleReject = (lawyerId) => {
    const lawyerToReject = pendingLawyers.find(l => l.id === lawyerId);
    setPendingLawyers(pendingLawyers.filter(l => l.id !== lawyerId));
    alert(`Lawyer ${lawyerToReject.name} rejected!`);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div>
      <style>{`
        .enhanced-admin-panel {
          background: #f8fafc;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-header-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem 2rem;
          margin: 1rem 0 2rem 0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-subtitle {
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .session-info {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }

        .session-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .enhanced-stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .enhanced-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .enhanced-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .enhanced-card.blue::before { background: linear-gradient(90deg, #3b82f6, #1e40af); }
        .enhanced-card.purple::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
        .enhanced-card.green::before { background: linear-gradient(90deg, #10b981, #059669); }
        .enhanced-card.orange::before { background: linear-gradient(90deg, #f59e0b, #d97706); }

        .enhanced-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .card-icon {
          font-size: 2rem;
          opacity: 0.8;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .card-label {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-change {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .card-change.positive { color: #10b981; }
        .card-change.negative { color: #ef4444; }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-section {
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

        .full-width-chart {
          grid-column: 1 / -1;
        }

        .enhanced-table {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .enhanced-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .enhanced-table th,
        .enhanced-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .enhanced-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .enhanced-table tr:hover {
          background: #f9fafb;
        }

        .icon-btn {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 0.5rem;
          margin: 0 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .icon-btn.green { color: #10b981; border-color: #10b981; }
        .icon-btn.red { color: #ef4444; border-color: #ef4444; }
        .icon-btn.black { color: #374151; border-color: #374151; }

        .icon-btn.green:hover { background: #ecfdf5; }
        .icon-btn.red:hover { background: #fef2f2; }
        .icon-btn.black:hover { background: #f9fafb; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .charts-grid,
          .grid-2 {
            grid-template-columns: 1fr;
          }

          .session-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .enhanced-stats-cards {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>

      {/* <Adminpanelheader /> */}
      <div>
        <nav>
          <Adminsidebar />
        </nav>
      </div>

      <main className="content enhanced-admin-panel" style={{ marginLeft: "15%", marginTop: "0%" }}>
        {/* Enhanced Header Section */}
        <div className="admin-header-info">
          <h1 className="admin-title">
            <FaChartLine />
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">
            Welcome back! Here's what's happening with your platform today.
          </p>
          <div className="session-info">
            <div className="session-item">
              <FaClock />
              <span>Current Time: {currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="session-item">
              <FaUsers />
              <span>Session Duration: {getSessionDuration()} hours</span>
            </div>
            <div className="session-item">
              <FaUserTie />
              <span>Status: Online</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="enhanced-stats-cards">
          <div className="enhanced-card blue">
            <div className="card-header">
              <div className="card-icon">👨‍⚖️</div>
            </div>
            <div className="card-value">{lawyers.length}</div>
            <div className="card-label">Total Lawyers</div>
            <div className="card-change positive">↗ +12% from last month</div>
          </div>

          <div className="enhanced-card purple">
            <div className="card-header">
              <div className="card-icon">👥</div>
            </div>
            <div className="card-value">{users.length}</div>
            <div className="card-label">Total Users</div>
            <div className="card-change positive">↗ +8% from last week</div>
          </div>

          <div className="enhanced-card green">
            <div className="card-header">
              <div className="card-icon">⏳</div>
            </div>
            <div className="card-value">{pendingLawyers.length}</div>
            <div className="card-label">Pending Approvals</div>
            <div className="card-change negative">↘ -3% from yesterday</div>
          </div>

          <div className="enhanced-card orange">
            <div className="card-header">
              <div className="card-icon">📊</div>
            </div>
            <div className="card-value">{sessionData.reduce((sum, item) => sum + item.activeSessions, 0)}</div>
            <div className="card-label">Active Sessions</div>
            <div className="card-change positive">↗ +15% today</div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="charts-grid">
          <div className="chart-section">
            <h3 className="chart-title">📈 Registration Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Total Users', value: chartData.reduce((sum, item) => sum + item.users, 0), fill: '#8884d8' },
                    { name: 'Total Lawyers', value: chartData.reduce((sum, item) => sum + item.lawyers, 0), fill: '#82ca9d' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-section">
            <h3 className="chart-title">🕐 24-Hour Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionData.slice(-12)}>
                <defs>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="activeSessions" stroke="#3b82f6" fill="url(#sessionGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Login Activity Chart */}
        <div className="chart-section full-width-chart">
          <h3 className="chart-title">📅 Weekly Login Activity</h3>
         <ResponsiveContainer width="100%" height={300}>
  <AreaChart data={loginActivityData}>
    <defs>
      <linearGradient id="lawyersGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
      </linearGradient>
    </defs>
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
    />
    <Legend />
    <Area 
      type="monotone" 
      dataKey="lawyers" 
      stackId="1" 
      stroke="#82ca9d" 
      fill="url(#lawyersGradient)" 
      name="Lawyers"
    />
    <Area 
      type="monotone" 
      dataKey="users" 
      stackId="1" 
      stroke="#8884d8" 
      fill="url(#usersGradient)" 
      name="Users"
    />
  </AreaChart>
</ResponsiveContainer>

        </div>

        {/* Enhanced Pending Lawyers Table */}
        <div className="enhanced-table">
          <div className="table-header">
            <h2 className="table-title">
              📝 Pending Lawyer Approvals
            </h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Last Login</th>
                <th>Reg. Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLawyers.map(lawyer => (
                <tr key={lawyer._id}>
                  <td>{lawyer.firstName} {lawyer.lastName}</td>
                  <td>{lawyer.email}</td>
                  <td>{lawyer.phone}</td>
                  <td>{formatLastLogin(lawyer.lastLogin)}</td>
                  <td>{new Date(lawyer.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="icon-btn green" onClick={() => handleApprove(lawyer)}><FaCheck /></button>
                    <button className="icon-btn red" onClick={() => handleReject(lawyer.id)}><FaTimes /></button>
                    <button className="icon-btn black" onClick={() => handleview(lawyer._id)}><FaEye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Recent Registrations */}
        <div className="grid-2">
          <div className="enhanced-table">
            <div className="table-header">
              <h2 className="table-title">
                🕵️‍♂️ Recent Lawyer Registrations
              </h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last Login</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...lawyers]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((lawyer, index) => (
                    <tr key={index}>
                      <td>{lawyer.firstName}</td>
                      <td>{formatLastLogin(lawyer.lastLogin)}</td>
                      <td>
                        {new Date(lawyer.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="enhanced-table">
            <div className="table-header">
              <h2 className="table-title">
                🙋‍♀️ Recent User Registrations
              </h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last Login</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...users]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((user, index) => (
                    <tr key={index}>
                      <td>{user.fullName}</td>
                      <td>{formatLastLogin(user.lastLogin)}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Activities Table */}
        <div className="enhanced-table">
          <div className="table-header">
            <h2 className="table-title">
              📢 Recent Activities
            </h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>✅ {activity}</td>
                  <td>{formatLastLogin(new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000))}</td>
                  <td><span style={{ color: '#10b981', fontWeight: '600' }}>Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Offcanvas Panel */}
      <Offcanvas show={show} onHide={handleClose} placement="end" className="lawyer-offcanvas">
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedLawyer && <LawyerProfileTabs selectedLawyer={selectedLawyer} />}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default AdminPanel;
