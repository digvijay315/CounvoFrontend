import React from 'react'

function Adminpanelheader() {
  return (
    <div>
      <header className="header">
        <h1 style={{ color: 'white' }}>⚖️ LawFirm Admin Panel</h1>
        <div className="user-menu">
          {/* <span>Welcome, Admin</span> */}
          {/* <button className="logout-btn">Logout</button> */}
          {/* <div className="avatar">A</div> */}
        </div>
      </header>

        <style jsx>{`
        .admin-panel {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #2c3e50;
          color: white;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logout-btn {
          background: #e67e22;
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s ease;
        }
        .logout-btn:hover {
          background: #d35400;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3498db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .layout {
          display: flex;
          min-height: calc(100vh - 72px);
        }
        .sidebar {
          width: 250px;
          background: #34495e;
          color: white;
          padding: 1rem 0;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar li {
          padding: 1rem 2rem;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }
        .sidebar li:hover {
          background: #2c3e50;
        }
        .sidebar li.active {
          background: #3498db;
        }
        .pending-count {
          position: absolute;
          right: 1rem;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .content {
          flex: 1;
          padding: 2rem;
          background: #ecf0f1;
        }
        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        .card {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-size: 1.2rem;
          text-align: center;
        }
        .table-container {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background: #f8f9fa;
          font-weight: 600;
        }
        .actions {
          width:150px;
          display: flex;
          gap: 0.5rem;
        }
        .approve-btn {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .reject-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>

    
  )
}

export default Adminpanelheader
