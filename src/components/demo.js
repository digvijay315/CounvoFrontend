import React, { useState } from 'react';
import Header from '../components/header';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState('login');

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
    margin: '50px auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    overflow: 'hidden',
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    background: '#f0f0f0',
  };

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: '15px 20px',
    fontSize: '16px',
    fontWeight: '600',
    background: isActive ? '#007bff' : 'none',
    color: isActive ? '#fff' : '#000',
    border: 'none',
    borderBottom: isActive ? '3px solid #0056b3' : 'none',
    cursor: 'pointer',
    transition: '0.3s ease',
  });

  const formContainerStyle = {
    padding: '85px 50px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  };

  return (

    <div>
      <Header/>
    <div style={containerStyle}>
    
      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab('login')}
          style={tabButtonStyle(activeTab === 'login')}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={tabButtonStyle(activeTab === 'register')}
        >
          Register
        </button>
      </div>

      <div style={formContainerStyle}>
        {activeTab === 'login' ? (
          <form style={formStyle}>
            <h4 style={{ color: '#333', marginTop:'-40px'}}>Welcome Back!</h4>
            <input type="text" placeholder="Username" required style={inputStyle} />
            <input type="password" placeholder="Password" required style={inputStyle} />
            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>
        ) : (
          <form style={formStyle}>
            <h4 style={{ color: '#333', marginTop:'-40px'}}>Create Account</h4>
            <input type="text" placeholder="Full Name" required style={inputStyle} />
            <input type="email" placeholder="Email" required style={inputStyle} />
            <input type="text" placeholder="Username" required style={inputStyle} />
            <input type="password" placeholder="Password" required style={inputStyle} />
            <input type="password" placeholder="Confirm Password" required style={inputStyle} />
            <button type="submit" style={buttonStyle}>
              Register
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
};

export default AuthTabs;
