import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientProfileModal = ({ userDetails, onClose }) => {
  const navigate = useNavigate();

  if (!userDetails) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <p>Loading profile...</p>
          <button onClick={onClose} style={styles.closeButton}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>
          User Profile
          <button onClick={onClose} style={styles.closeIcon}>×</button>
        </h2>
        <div><strong>Full Name:</strong> {userDetails.fullName}</div>
        <div><strong>Username:</strong> {userDetails.username}</div>
        <div><strong>Email:</strong> {userDetails.email}</div>
        

        <button
          onClick={() => {
            onClose();
            navigate('/settings');
          }}
          style={styles.editButton}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: 'white', padding: '30px', borderRadius: '10px',
    width: '400px', maxWidth: '90%', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
  },
  header: {
    marginBottom: '20px', color: '#0052cc',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  closeIcon: {
    background: 'none', border: 'none', fontSize: '20px',
    cursor: 'pointer', color: '#666'
  },
  closeButton: {
    marginTop: '20px', padding: '10px 15px',
    backgroundColor: '#ccc', border: 'none',
    borderRadius: '5px', cursor: 'pointer'
  },
  editButton: {
    backgroundColor: '#0052cc', color: 'white',
    border: 'none', padding: '10px 15px',
    borderRadius: '5px', cursor: 'pointer',
    marginTop: '20px'
  }
};

export default ClientProfileModal;
