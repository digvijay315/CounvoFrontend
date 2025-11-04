import React, { useState,useEffect } from 'react';
import Header from './Layout/header';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // adjust the path as needed
import Swal from 'sweetalert2';
import Lottie from "lottie-react";

const Login = () => {

     const [isLoading, setIsLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);
    useEffect(() => {
    fetch("https://assets6.lottiefiles.com/packages/lf20_usmfx6bp.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);



  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('user'); // For registration
  const [loginRole, setLoginRole] = useState('user'); // For login
  const navigate = useNavigate();
  const [acceptterms, setacceptterms] = useState(false); // checkbox state

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    barRegistrationNumber: '',
    practiceAreas: '',
    yearsOfExperience: '',
    profilepic: [],
  });

  const [loginData, setLoginData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilepic') {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, profilepic: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

 

const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Passwords do not match.',
    });
    return;
  }

  try {
    setIsLoading(true)
    if (role === 'user') {
      const response = await api.post(
        'api/user',
        {
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: 'user',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = response.data;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data.message,
      });

      setActiveTab('login');
    } else {
      const fd = new FormData();
      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('email', formData.email);
      fd.append('username', formData.username);
      fd.append('password', formData.password);
      fd.append('phone', formData.phone);
      // fd.append('barRegistrationNumber', formData.barRegistrationNumber);
      fd.append(
        'practiceAreas',
        JSON.stringify(formData.practiceAreas.split(',').map((p) => p.trim()))
      );
      fd.append('yearsOfExperience', formData.yearsOfExperience);

      for (let i = 0; i < formData.profilepic.length; i++) {
        fd.append('profilepic', formData.profilepic[i]);
      }

      const response = await api.post('api/lawyer/register/lawyer', fd);

      const data = response.data;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data.message,
      });

      setActiveTab('login');
    }
  } catch (err) {
    console.error('Registration error:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err?.response?.data?.message || err.message || 'Something went wrong',
    });
  }finally
  {
    setIsLoading(false)
  }
};


  const containerStyle = {
    width: '100%',
    maxWidth: '500px',
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
    padding: '55px 60px',
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

  const selectStyle = {
    ...inputStyle,
    backgroundColor: '#fff',
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




const handleLogin = async (e) => {
  e.preventDefault();
if( !acceptterms)
{
  return   Swal.fire({
                icon: 'error',
                title: 'Accept Terms & Condition!',
                text: "Please Accept Terms And Condition For Login...",
                showConfirmButton: true,
              });
}
     const credentialsadmin = loginRole === 'admin' ? 
           { email: loginData.email, password: loginData.password }:""

           if(credentialsadmin)
           {
            if(credentialsadmin.email==="admin@gmail.com" && credentialsadmin.password==="admin123")
            {
               Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: "Welcome Admin...",
                showConfirmButton: true,
              });
              navigate('/adminpanel')
            }
            else
            {
                 Swal.fire({
                icon: 'error',
                title: 'Login Error!',
                text: "invalid admin id",
                showConfirmButton: true,
              });
              
            }
            
           }
           

if(!credentialsadmin)
{
  try {
    setIsLoading(true);
    const endpoint = loginRole === 'user'
      ? '/api/user/login'
      : '/api/lawyer/login';

    const credentials = loginRole === 'user'
      ? { username: loginData.username, password: loginData.password }
      : { email: loginData.email, password: loginData.password };

       

    const response = await api.post(endpoint, credentials);
    const data = response.data;
 
    if(response.status === 200) {
      // Set current login time BEFORE showing success message
      const currentLoginTime = new Date().toISOString();
      localStorage.setItem('currentLoginTime', currentLoginTime);
      
      // Get and store previous login time for "last login" display
      const previousLogin = localStorage.getItem('lastLogin');
      if (previousLogin) {
        localStorage.setItem('previousLogin', previousLogin);
      }
      
      // Update last login time
      localStorage.setItem('lastLogin', currentLoginTime);
      
      // Initialize session tracking
      localStorage.setItem('sessionStartTime', Date.now().toString());
      
      // Initialize daily time tracking
      const today = new Date().toLocaleDateString();
      const dailyTimeData = JSON.parse(localStorage.getItem('dailyTimeSpent') || '[]');
      
      // Check if today's entry exists, if not create it
      const todayExists = dailyTimeData.find(d => d.date === today);
      if (!todayExists) {
        dailyTimeData.push({ date: today, hours: 0, loginTime: currentLoginTime });
        localStorage.setItem('dailyTimeSpent', JSON.stringify(dailyTimeData));
      }

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: data.message,
        showConfirmButton: true,
      });
    
      if (loginRole === 'user') {
        localStorage.setItem('userDetails', JSON.stringify(data));
        // navigate('/ClientDashboard');
         navigate('/');
      } else {
        localStorage.setItem('lawyerDetails', JSON.stringify(data));
        navigate('/LawyerDashboard');
      }
    }

  } catch (err) {
    console.error('Login error:', err);
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert('Something went wrong during login');
    }
  } finally {
    setIsLoading(false);
  }
}
}



  return (
    <div>
      <Header />
      <div style={containerStyle}>
        <div style={tabsStyle}>
          <button onClick={() => setActiveTab('login')} style={tabButtonStyle(activeTab === 'login')}>
            Login
          </button>
          <button onClick={() => setActiveTab('registration')} style={tabButtonStyle(activeTab === 'registration')}>
            Registration
          </button>
        </div>

        <div style={formContainerStyle}>
          {activeTab === 'login' ? (
            <form style={formStyle} onSubmit={handleLogin}>
              <h3>Welcome Back!</h3>
              <select 
                value={loginRole} 
                onChange={(e) => setLoginRole(e.target.value)} 
                style={selectStyle}
              >
                <option value="user">Login as User</option>
                <option value="lawyer">Login as Lawyer</option>
                <option value="admin">Login as Admin</option>
              </select>

              {loginRole === 'user' ? (
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  value={loginData.username} 
                  onChange={handleLoginInputChange} 
                  required 
                  style={inputStyle} 
                />
              ) : (
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={loginData.email} 
                  onChange={handleLoginInputChange} 
                  required 
                  style={inputStyle} 
                />
              )}

              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={loginData.password} 
                onChange={handleLoginInputChange} 
                required 
                style={inputStyle} 
              />
              {/* ✅ Checkbox */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={acceptterms}
              onChange={(e) => setacceptterms(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            I accept terms and conditions, and Privacy policy
          </label>
        </div>
              <button type="submit" style={buttonStyle}>
                {loginRole === 'user' ? 'Login as User' : loginRole === 'lawyer'?'Login as Lawyer':"Login as Admin"}
              </button>
            </form>
          ) : (
            <form style={formStyle} onSubmit={handleRegister} encType="multipart/form-data">
              <h2>Create Account</h2>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={selectStyle}>
                <option value="user">Register as User</option>
                <option value="lawyer">Register as Lawyer</option>
              </select>

              {role === 'user' ? (
                <>
                  <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} style={inputStyle} required />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                  <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} style={inputStyle} required />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} style={inputStyle} required />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} style={inputStyle} required />
                </>
              ) : (
                <>
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} style={inputStyle} required />
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} style={inputStyle} required />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
                  <input type="username" name="username" placeholder="username" value={formData.username} onChange={handleInputChange} style={inputStyle} required />
                  <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} required />
                  {/* <input type="text" name="barRegistrationNumber" placeholder="Bar Registration Number" value={formData.barRegistrationNumber} onChange={handleInputChange} style={inputStyle} required /> */}
                  <input type="text" name="practiceAreas" placeholder="Practice Areas (comma-separated)" value={formData.practiceAreas} onChange={handleInputChange} style={inputStyle} required />
                  <input type="number" name="yearsOfExperience" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleInputChange} style={inputStyle} required />
                  <input type="file" name="profilepic" multiple onChange={handleInputChange} style={inputStyle} />
                  <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} style={inputStyle} required />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} style={inputStyle} required />
                </>
              )}
              <button type="submit" style={buttonStyle}>Register</button>
            </form>
          )}
        </div>
      </div>

          <>
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          // background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}>
          <div style={{
            // backgroundColor: "rgba(0,0,0,0.75)",
            padding: "40px 60px",
            borderRadius: "20px",
            // boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
          }}>
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ height: '120px', width: '120px', marginBottom: '20px' }}
            />
            <div style={{ fontSize: "18px", fontWeight: 500 }}>
              Logging...
            </div>
          </div>
        </div>
      )}
          </>

    </div>
  );
};

export default Login;
