import React, { useState,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api';
import Swal from 'sweetalert2';
import Clientsidebar from './clientsidebar';
import Header from './Layout/header';
// import { Support } from '@mui/icons-material';
import socket from './socket';
import Lawyersidebar from './lawyersidebar';

function Support() {

   const lawyerdetails = JSON.parse(localStorage.getItem('lawyerDetails'));
   
   useEffect(() => {
      if (!lawyerdetails?.lawyer?._id) return;
  
      if (!socket.connected) socket.connect();
  
      socket.on('connect', () => {
        const lawyerId = lawyerdetails.lawyer._id;
        socket.emit('lawyerOnline', lawyerId);
        socket.emit('getOnlineClients');
      });
        socket.on('onlineClientsList', ids => {
            // setOnlineClients(ids);
          });
        }
      )



  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle email chips
  const handleEmailInput = e => setEmailInput(e.target.value);
  const handleEmailKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ',') && emailInput.trim()) {
      e.preventDefault();
      if (!emails.includes(emailInput.trim())) {
        setEmails([...emails, emailInput.trim()]);
      }
      setEmailInput('');
    }
    if (e.key === 'Backspace' && !emailInput && emails.length) {
      setEmails(emails.slice(0, -1));
    }
  };
  const removeEmail = idx => setEmails(emails.filter((_, i) => i !== idx));

  // Dropzone for attachments
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: files => setAttachments([...attachments, ...files]),
    accept: { 'application/pdf': [], 'image/*': [], 'application/msword': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] },
    maxFiles: 5,
  });
  const removeAttachment = idx => setAttachments(attachments.filter((_, i) => i !== idx));

  // Send mail
  const sendMail = async e => {
    e.preventDefault();
    if (!subject || !message || emails.length === 0) {
      Swal.fire({ title: 'Missing Fields', text: 'Please fill all required fields.', icon: 'warning' });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', message);
    emails.forEach(email => formData.append('emails', email));
    attachments.forEach(file => formData.append('attachments', file));
    try {
      const resp = await api.post('contact/sendmail', formData);
      if (resp.status === 200) {
        Swal.fire({ title: 'Success!', text: 'Mail Sent Successfully!', icon: 'success' });
        setSubject(''); setMessage(''); setEmails([]); setAttachments([]);
      }
    } catch (error) {
      Swal.fire({ title: 'Error!', text: error?.response?.data || 'Something went wrong.', icon: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {/* <Clientsidebar/> */}
    {/* <Header/> */}
    <Lawyersidebar/>
      
    <div style={{
      maxWidth: 480,
      margin: '70px auto',
      background: 'rgba(255,255,255,0.96)',
      borderRadius: 18,
      boxShadow: '0 6px 32px 0 rgba(60,80,180,0.10)',
      padding: '32px 28px',
      position: 'relative',
    }}>
      <h2 style={{ marginBottom: 18, color: '#3b3b5c', letterSpacing: 1, fontWeight: 700}}>
        Send Mail
      </h2>
      <form onSubmit={sendMail} autoComplete="off">
        {/* Recipient emails */}
        <label style={{ fontWeight: 500, fontSize: 15, color: '#6366f1' }}>To</label>
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          border: '1.5px solid #b6c2e2', borderRadius: 8, padding: '6px 10px', marginBottom: 18, background: '#f6f8fa'
        }}>
          {emails.map((email, idx) => (
            <span key={idx} style={{
              background: '#6366f1', color: '#fff', borderRadius: 16,
              padding: '4px 12px', margin: '2px 6px 2px 0', display: 'inline-flex', alignItems: 'center', fontSize: 14
            }}>
              {email}
              <span onClick={() => removeEmail(idx)} style={{
                marginLeft: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15
              }}>&times;</span>
            </span>
          ))}
          <input
            type="email"
            value={emailInput}
            onChange={handleEmailInput}
            onKeyDown={handleEmailKeyDown}
            placeholder="support@gmail.com"
            style={{
              border: 'none', outline: 'none', fontSize: 15, minWidth: 120,
              background: 'transparent', padding: 4
            }}
          />
        </div>

        {/* Subject */}
        <label style={{ fontWeight: 500, fontSize: 15, color: '#6366f1' }}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          placeholder="Enter subject"
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 8,
            border: '1.5px solid #b6c2e2', marginBottom: 18, fontSize: 15, background: '#f6f8fa'
          }}
        />

        {/* Message */}
        <label style={{ fontWeight: 500, fontSize: 15, color: '#6366f1' }}>Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          placeholder="Type your message..."
          style={{
            width: '100%', minHeight: 100, padding: '10px 12px', borderRadius: 8,
            border: '1.5px solid #b6c2e2', marginBottom: 18, fontSize: 15, background: '#f6f8fa', resize: 'vertical'
          }}
        />

        {/* Attachments */}
        <label style={{ fontWeight: 500, fontSize: 15, color: '#6366f1' }}>Attachments</label>
        <div {...getRootProps()} style={{
          border: '1.5px dashed #b6c2e2', borderRadius: 8, padding: '18px 0',
          textAlign: 'center', color: '#64748b', background: '#f8fafc', cursor: 'pointer', marginBottom: 10
        }}>
          <input {...getInputProps()} />
          <span style={{ fontSize: 14 }}>Drag & drop files here, or click to select (max 5)</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {attachments.map((file, idx) => (
            <span key={idx} style={{
              background: '#e0e7ff', borderRadius: 12, padding: '6px 12px',
              fontSize: 14, color: '#3b3b5c', display: 'flex', alignItems: 'center'
            }}>
              {file.name}
              <span onClick={() => removeAttachment(idx)} style={{
                marginLeft: 8, color: '#ef4444', cursor: 'pointer', fontWeight: 700
              }}>&times;</span>
            </span>
          ))}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10,
            background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
            color: '#fff', fontWeight: 700, fontSize: 17, border: 'none',
            boxShadow: '0 2px 12px 0 rgba(80,120,220,0.10)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            letterSpacing: 1, transition: 'background 0.2s, transform 0.1s'
          }}
        >
          {isLoading ? 'Sending...' : 'Send Mail'}
        </button>
      </form>
    </div>
      </>
  );
}

export default Support;
