import React from 'react';
import Footer from './Layout/footer';
import Header from './Layout/header';

const Privacyolicy = () => {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Privacy Policy</h1>
        
        <p className="text-gray-700 mb-4">
          Counvo (“Company,” “we,” “our,” or “us”) is committed to protecting the privacy of visitors and users (“you,” “your”) of our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By accessing or using Counvo, you agree to this Privacy Policy. If you do not agree, please do not use our services.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>
          <p className="text-gray-700 mb-2">We may collect the following types of information:</p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Personal Information</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Name, email address, phone number, and account details.</li>
                <li>Information you provide while registering or updating your profile.</li>
              </ul>
            </li>
            <li>
              <strong>Usage Data</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Log data such as IP address, browser type, device information, and access times.</li>
                <li>Pages visited, features used, and interactions on the platform.</li>
              </ul>
            </li>
            <li>
              <strong>Communication Data</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Chat and call logs made through the platform (stored securely for quality, compliance, and dispute resolution).</li>
              </ul>
            </li>
            <li>
              <strong>Payment Data</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Transaction details processed via third-party payment gateways (we do not store card/banking details).</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-2">We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Provide and improve our platform services.</li>
            <li>Connect users with verified legal professionals.</li>
            <li>Facilitate chat, call, and payment functions.</li>
            <li>Prevent fraud, scams, and misuse of the platform.</li>
            <li>Communicate updates, service notices, and promotional offers (with consent).</li>
            <li>Comply with applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Sharing of Information</h2>
          <p className="text-gray-700 mb-2">We do not sell or rent your personal information. Information may be shared only with:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Lawyers/Legal Professionals you choose to connect with.</li>
            <li>Service Providers (payment processors, hosting providers, analytics).</li>
            <li>Government Authorities if required by law, regulation, or legal process.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Retention</h2>
          <p className="text-gray-700">Personal data is retained only as long as necessary for service delivery, compliance, or dispute resolution. Chat and call logs may be stored securely for limited durations as required by law. Users may request deletion of their account and associated data (subject to legal obligations).</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Your Rights</h2>
          <p className="text-gray-700 mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Access, update, or correct your personal data.</li>
            <li>Request deletion of your data.</li>
            <li>Withdraw consent for certain uses of your information.</li>
            <li>Contact us for questions regarding data usage.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Security</h2>
          <p className="text-gray-700">We implement reasonable technical and organizational measures to safeguard your personal data. However, no system is completely secure, and we cannot guarantee absolute security.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Third-Party Links</h2>
          <p className="text-gray-700">Our platform may contain links to third-party websites. We are not responsible for the privacy practices of such websites.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Children’s Privacy</h2>
          <p className="text-gray-700">Our services are not directed to children under the age of 18. We do not knowingly collect personal information from minors.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Changes to This Policy</h2>
          <p className="text-gray-700">We may update this Privacy Policy from time to time. Changes will be notified via our website or email. Continued use of our services after changes indicates acceptance.</p>
        </section>

        <p className="text-gray-700 italic text-center mt-8">
          ⚖️ Legal Disclaimer: Counvo is a technology platform that connects users with independent legal professionals. Counvo does not provide legal advice or services and is not a law firm.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Privacyolicy;
