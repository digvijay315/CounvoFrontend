import React from "react";
import { Outlet } from "react-router-dom";
import "./authLayout.css";
import LogoHorizontal from "../components/counvoImg/LogoHorizontal.png";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left Side - Form Area */}
      <div className="auth-left">
        <div className="auth-form-container">
          {/* Logo/Brand */}
          <div className="auth-brand">
            <img
              src={LogoHorizontal}
              alt="Counvo Logo"
              height={60}
              width={180}
              objectFit="contain"
            />
          </div>

          {/* Form Content via Outlet */}
          <div className="auth-form-wrapper">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>&copy; 2025 Counvo. All rights reserved.</p>
            <div className="auth-footer-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <span>•</span>
              <a href="/termsandconditions">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Design/Visual */}
      <div className="auth-right">
        <div className="auth-right-content">
          {/* Animated Background Shapes */}
          <div className="auth-bg-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>

          {/* Main Content */}
          <div className="auth-right-inner">
            <div className="auth-illustration ">
              <div className="d-flex space-x-4">
                <div
                  className="illustration-icon glass-bg rounded-xl p-1"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.28)",
                  }}
                >
                  ⚖️
                </div>
                <h2 className="auth-tagline">
                  Your Legal Journey <br />
                  <span className="gradient-text">Starts Here</span>
                </h2>
              </div>
              <p className="auth-description">
                Connect with verified legal professionals instantly. Get expert
                advice, manage cases, and secure your legal matters with
                confidence.
              </p>

              {/* Feature List */}
              <div className="auth-features">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">
                    <strong>Verified Lawyers</strong>
                    <p>Connect with certified legal professionals</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">
                    <strong>Instant Chat</strong>
                    <p>Real-time communication with your lawyer</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-text">
                    <strong>Secure Payments</strong>
                    <p>Safe and encrypted payment gateway</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
