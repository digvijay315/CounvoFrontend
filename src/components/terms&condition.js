import React from "react";
import "../css/TermsAndConditions.css"; // Place the CSS below in this file or use a <style> tag
import Header from "./Layout/header";
import Footer from "./Layout/footer";

const TermsAndConditions = () => (
    <div>
    <Header/>
  <section className="terms-section">
    <div className="terms-container">
      <h1 className="terms-title">Terms &amp; Conditions</h1>
      <p className="terms-updated">Last Updated: May 25, 2025</p>
      <p>
        Welcome to <b>Counvo</b> (“we”, “our”, or “the Platform”). By accessing or using our website, services, or features, you agree to these Terms &amp; Conditions. If you do not agree, please refrain from using the Platform.
      </p>
      <p>
        <b>These terms apply to:</b>
        <ul>
          <li><b>Clients/Users:</b> Individuals seeking legal consultations.</li>
          <li><b>Lawyers/Advocates:</b> Legal professionals offering services on the Platform.</li>
        </ul>
      </p>
      <ol className="terms-list">
        <li>
          <b>Platform Overview</b>
          <p>
            Counvo is a technology-driven platform that connects users with verified advocates for consultation via chat, call, and appointment booking. We serve strictly as a facilitator and do not provide legal advice.
          </p>
        </li>
        <li>
          <b>Account Registration</b>
          <ul>
            <li>
              <b>Clients:</b>
              <ul>
                <li>Must be at least 18 years old and legally capable of entering into contracts.</li>
                <li>Must provide accurate and complete information.</li>
              </ul>
            </li>
            <li>
              <b>Lawyers:</b>
              <ul>
                <li>Must be registered advocates with a valid Bar Council ID.</li>
                <li>Must consent to display their profile and accept client engagements.</li>
                <li>Must promptly update any changes in credentials or availability.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <b>Nature of Services</b>
          <ul>
            <li>The Platform does not guarantee outcomes of legal matters.</li>
            <li>Legal advice is provided solely by registered lawyers.</li>
            <li>We only intervene for technical support or to enforce policy violations.</li>
          </ul>
        </li>
        <li>
          <b>Fees &amp; Payments</b>
          <ul>
            <li>
              <b>Clients:</b>
              <ul>
                <li>Platform facilitation fees may apply for chat, call, or bundled services.</li>
                <li>A convenience fee may be added to lawyer payments.</li>
                <li>Fees are disclosed transparently before payment.</li>
                <li>The 5-minute free chat/call policy applies once per lawyer per day.</li>
              </ul>
            </li>
            <li>
              <b>Lawyers:</b>
              <ul>
                <li>No fees during the first six months of onboarding.</li>
                <li>Post-onboarding, subscription or pay-per-use fees may apply.</li>
                <li>Bypassing the payment system or sharing personal contact details directly with users is prohibited.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <b>Cancellations &amp; Refunds</b>
          <ul>
            <li>Platform fees are non-refundable once services are initiated.</li>
            <li>If a lawyer fails to respond in a reasonable time after payment, users may request rescheduling or reassignment.</li>
            <li>All refund decisions are at the sole discretion of Counvo.</li>
          </ul>
        </li>
        <li>
          <b>Data Privacy &amp; Consent</b>
          <ul>
            <li>Users and lawyers must agree to our Privacy Policy before using the Platform.</li>
            <li>Lawyers consent to display their name, photo, court of practice, and reviews.</li>
            <li>Chat and call records may be stored for internal audit and quality review.</li>
          </ul>
        </li>
        <li>
          <b>Lawyer Conduct &amp; Availability</b>
          <ul>
            <li>Lawyers must maintain at least six hours/day of availability when marked online.</li>
            <li>Repeated non-responsiveness may lead to profile suspension.</li>
            <li>Paid consultations must be honored as booked.</li>
          </ul>
        </li>
        <li>
          <b>Ratings &amp; Reviews</b>
          <ul>
            <li>Users may rate and review lawyers after consultations.</li>
            <li>Manipulating ratings or reviews is strictly prohibited.</li>
            <li>Reviews are moderated to ensure compliance and quality.</li>
          </ul>
        </li>
        <li>
          <b>Prohibited Activities</b>
          <ul>
            <li>Users and lawyers must not:
              <ul>
                <li>Exchange personal contact information outside the Platform.</li>
                <li>Circumvent payment systems.</li>
                <li>Misrepresent credentials or impersonate others.</li>
                <li>Use the Platform for unlawful purposes.</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <b>Intellectual Property</b>
          <p>
            All content on Counvo, including design, logo, UI, and software, is protected by intellectual property laws. Unauthorized use is prohibited.
          </p>
        </li>
        <li>
          <b>Limitation of Liability</b>
          <ul>
            <li>Counvo is not liable for:
              <ul>
                <li>The quality or outcome of legal advice.</li>
                <li>Misrepresentation by any party.</li>
                <li>Losses from unauthorized access, data breaches, or downtime.</li>
              </ul>
            </li>
            <li>Our liability is limited to the amount of the platform fee charged.</li>
          </ul>
        </li>
        <li>
          <b>Modifications to Terms</b>
          <p>
            We may update these Terms at any time. Continued use of the Platform constitutes acceptance of revised Terms. Notifications of changes will be provided via website or email.
          </p>
        </li>
        <li>
          <b>Governing Law &amp; Dispute Resolution</b>
          <p>
            These Terms are governed by the laws of India. Disputes fall under the exclusive jurisdiction of the Delhi courts.
          </p>
        </li>
        <li>
          <b>Contact Information</b>
          <ul>
            <li>Email: <a href="mailto:support@counvo.com">admin@counvo.in</a></li>
            <li>Phone: +91-97736 76088</li>
            <li>Address:PLOT NO 6,GROUND FLOOR KH NO.10/2 AND 9 VILLAGE BAPROLA. DELHI 110041</li>
          </ul>
        </li>
      </ol>
      <p className="terms-thankyou">Thank you for choosing Counvo.</p>
    </div>
  </section>
  <Footer/>
  </div>
);

export default TermsAndConditions;
