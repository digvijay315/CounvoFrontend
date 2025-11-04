import React, { useState } from 'react';
import logo1 from '../components/counvoImg/Counvo - LOGO (1).png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userDetails'));

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    Swal.fire({
      icon: 'success',
      title: 'Logout Successfull',
      text:  'You are Successfully Logout..!',
      showConfirmButton: true,
    });
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <style>
        {`
        .header-main {
          padding: 10px 30px;
          background: #fff;
          color: #222;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 38px;
          height: 38px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2002;
        }
        .hamburger-btn span {
          display: block;
          width: 28px;
          height: 3px;
          background: #1956d2;
          margin: 4px 0;
          border-radius: 2px;
          transition: 0.3s;
        }
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #fff;
          z-index: 2001;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 30px 24px 24px 24px;
          animation: slideInMenu 0.2s;
        }
        @keyframes slideInMenu {
          from { left: -100vw; }
          to { left: 0; }
        }
        .close-mobile-menu {
          background: none;
          border: none;
          font-size: 2.2rem;
          position: absolute;
          top: 18px;
          right: 24px;
          color: #1956d2;
          cursor: pointer;
          z-index: 2003;
        }
        .mobile-menu-list {
          margin-top: 40px;
          width: 100%;
          padding: 0;
          list-style: none;
        }
        .mobile-menu-list li {
          padding: 16px 0;
          border-bottom: 1px solid #eee;
          font-size: 1.12rem;
          color: #222;
          cursor: pointer;
          width: 100%;
        }
        .mobile-menu-list li:last-child {
          border-bottom: none;
        }
        @media (max-width: 900px) {
          .fl-mega-menu.nav-menu,
          .link-reg {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
        `}
      </style>

      <header className="header-main">
        {/* Hamburger Icon (Mobile Only) */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo */}
        <div className="nav-logo d-flex align-items-center">
          <img
            src={logo1}
            alt="Logo"
            style={{ height: '60px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>

        {/* Navigation Menu (Desktop Only) */}
        <nav className="fl-mega-menu nav-menu" style={{ flexGrow: 1, marginLeft: '35%' }}>
          <ul
            id="menu-main-menu-1"
            className="menu nav-menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '45px',
              listStyle: 'none',
              margin: 0,
            }}
          >
            <li className="nav-item">
              <a
                onClick={() => navigate('/')}
                className="menu-link main-menu-link item-title"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="menu-link main-menu-link item-title" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="menu-link main-menu-link item-title" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Contact
              </a>
            </li>
            <li className="nav-item dropdown" style={{ display: userData?.user ? 'block' : 'none' }}>
              <a
                className="menu-link main-menu-link item-title dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', color: "blue", fontWeight: "bold" }}
              >
                {userData?.user?.fullName} <span style={{ fontSize: '14px' }}>▼</span>
              </a>
              <ul className="dropdown-menu" aria-labelledby="userDropdown" style={{ cursor: "pointer" }}>
                <li><a className="dropdown-item" onClick={() => navigate('/')}>Home</a></li>
                <li><a className="dropdown-item" onClick={() => navigate('/findlawyer')}>Find Lawyer</a></li>
                <li><a className="dropdown-item" onClick={() => navigate('/clientprofile')}>Profile</a></li>
                <li><a className="dropdown-item" onClick={() => navigate('/supports')}>Supports</a></li>
                <li><a className="dropdown-item" onClick={() => navigate('/clientchathistory')}>History</a></li>
                <li><a className="dropdown-item" onClick={() => navigate('/termsandconditions')}>Terms & Conditions</a></li>
                <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Login / Sign Up Button aligned to right (Desktop Only) */}
        <div className="link-reg" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Login / Sign Up
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <button
              className="close-mobile-menu"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              &times;
            </button>
            <ul className="mobile-menu-list">
              <li onClick={() => { setMobileMenuOpen(false); navigate('/'); }}>Home</li>
              <li>About Us</li>
              <li>Contact</li>
              {userData?.user && (
                <>
                  <li style={{ fontWeight: 'bold', color: 'blue' }}>{userData.user.fullName}</li>
                  <li onClick={() => { setMobileMenuOpen(false); navigate('/findlawyer'); }}>Find Lawyer</li>
                  <li onClick={() => { setMobileMenuOpen(false); navigate('/clientprofile'); }}>Profile</li>
                  <li onClick={() => { setMobileMenuOpen(false); navigate('/supports'); }}>Supports</li>
                  <li onClick={() => { setMobileMenuOpen(false); navigate('/clientchathistory'); }}>History</li>
                  <li onClick={() => { setMobileMenuOpen(false); navigate('/termsandconditions'); }}>Terms & Conditions</li>
                  <li onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>Logout</li>
                </>
              )}
              {!userData?.user && (
                <li onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Login / Sign Up</li>
              )}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;