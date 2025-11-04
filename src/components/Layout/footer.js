import React from 'react';
import {  FaFacebook, FaInstagram, FaYoutube,FaEnvelope,FaLinkedin } from 'react-icons/fa';


const accent = "#1fa2ff"; // Brand accent color

const footerStyles = {
  background: "linear-gradient(135deg, #232526 0%, #1fa2ff 100%)",
  color: "#fff",
  padding: "3rem 1rem 1rem 1rem",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "1rem",
  letterSpacing: "0.01em",
};

const containerStyles = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "2rem",
};

const sectionStyles = {
  flex: "1 1 220px",
  minWidth: "220px",
};

const linkStyles = {
  color: accent,
  textDecoration: "none",
  transition: "color 0.2s",
  fontWeight: 500,
};

const iconLinkStyles = {
  color: "#fff",
  marginRight: "1rem",
  fontSize: "1.4em",
  transition: "color 0.2s",
};

const ulStyles = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const headingStyles = {
  fontSize: "1.15em",
  marginBottom: "0.7em",
  fontWeight: 700,
  letterSpacing: "0.03em",
  color: accent,
};

const dividerStyles = {
  border: 0,
  borderTop: "1px solid #ffffff22",
  margin: "2rem 0 1rem 0",
};

const copyrightStyles = {
  textAlign: "center",
  color: "#b5c6e0",
  fontSize: "0.95em",
  marginTop: "0.5rem",
  letterSpacing: "0.02em",
};

const Footer = () => (
  <footer style={footerStyles}>
    <div style={containerStyles}>
      <div style={sectionStyles}>
        <h4 style={headingStyles}>About Counvo</h4>
        <p>
          Counvo is a technology platform connecting users with verified legal professionals across India. <br />
          <span style={{ color: accent, fontWeight: 500 }}>We do not provide legal advice or represent clients.</span>
        </p>
      </div>
      <div style={sectionStyles}>
        <h4 style={headingStyles}>Disclaimer</h4>
        <p>
          All legal services are rendered solely by independent lawyers.<br />
          Counvo does not interfere with the lawyer-client relationship or share professional fees.
        </p>
      </div>
      <div style={sectionStyles}>
        <h4 style={headingStyles}>Compliance</h4>
        <p>
          Counvo operates in full compliance with Bar Council of India regulations and applicable laws.
        </p>
      </div>
      <div style={sectionStyles}>
        <h4 style={headingStyles}>Quick Links</h4>
        <ul style={ulStyles}>
          <li>
            <a href="termsandconditions" style={linkStyles}>Terms and Conditions</a>
          </li>
          <li>
            <a href="/privacy-policy" style={linkStyles}>Privacy Policy</a>
          </li>
          {/* <li>
            <a href="#" style={linkStyles}>Cookies Policy</a>
          </li> */}
               <li>
            <a href="shipping-policy" style={linkStyles}>Shipping policy</a>
          </li>
             <li>
            <a href="/cancellation-policy" style={linkStyles}>Cancellation Policy</a>
          </li>
               <li>
            <a href="/contactus" style={linkStyles}>Contact us</a>
          </li>
        </ul>
      </div>
      <div style={sectionStyles}>
        <h4 style={headingStyles}>Contact</h4>
        <a href="mailto:admin@counvo.in" style={{ ...linkStyles, display: "inline-flex", alignItems: "center" }}>
          <FaEnvelope style={{ marginRight: 8 }} /> admin@counvo.in
        </a>
        <div style={{ marginTop: "1em" }}>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyles} title="Facebook">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyles} title="Twitter">
            <FaInstagram  />
          </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyles} title="Youtube">
            <FaYoutube  />
          </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={iconLinkStyles} title="Linkdin">
            <FaLinkedin  />
          </a>
        </div>
      </div>
    </div>
    <hr style={dividerStyles} />
    <div style={copyrightStyles}>
      &copy; {new Date().getFullYear()} Counvo. All rights reserved.
    </div>
    {/* Responsive CSS */}
    <style>
      {`
        @media (max-width: 900px) {
          .footer-container {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
        footer a:hover {
          color: #fff;
        }
        footer a[title]:hover {
          color: ${accent};
        }
      `}
    </style>
  </footer>
);

export default Footer;
