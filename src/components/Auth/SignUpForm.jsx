import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle, Users, Scale } from 'lucide-react';
import Swal from 'sweetalert2';
import { register as registerUser, clearError, selectIsLoading, selectError } from '../../redux/slices/authSlice';
import './authForms.css';
import api from "../../api";

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redux selectors
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      userType: "customer",
    },
  });

  const password = watch('password');
  const userType = watch("userType");

  const handleUserTypeToggle = (type) => {
    setValue("userType", type, { shouldValidate: true });
  };

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error,
      });
    }
  }, [error]);

  const [showOtp, setShowOtp] = useState(false);
const [otp, setOtp] = useState("");
const [otpLoading, setOtpLoading] = useState(false);
const [formData, setFormData] = useState(null);


console.log(formData);


  const onSubmit = async (data) => {
  try {

    setLoading(true)
    dispatch(clearError());


    setFormData(data); 

    const response = await api.post("api/auth/register", data);

    // const result = await response.json();
    // if (!response.ok) {
    //   throw new Error(result.message);
    // }

    Swal.fire({
      icon: "info",
      title: "OTP Sent",
      text: "Please check your email for OTP",
    });

    setShowOtp(true); // open OTP modal
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: error.response.data.message || "Registration failed",
    });
  } finally
  {
    setLoading(false)
  }
};


const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkScreen(); // 👈 run once on mount

  window.addEventListener("resize", checkScreen);
  return () => window.removeEventListener("resize", checkScreen);
}, []);

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: isMobile ? 0 : -200,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",   // move to left
  alignItems: "center",           // keep vertical center
  paddingLeft: "40px",            // space from left
  zIndex: 1000,
};


const modalContent = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "8px",
  width: "350px",
  position: "relative",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};

const closeButton = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const buttonStyle = {
  backgroundColor: '#eab308',
  color: 'white',
  padding: '12px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.3s',
  marginTop: '20px',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};


  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
  };


const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await api.post(
      "api/auth/verify-otp",
      {
        email: formData.email,
        otp,
      }
    );

     Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text:data.message || "Registration successful!",
        showConfirmButton: true,
      });
   
    setShowOtp(false);
    setOtp("");

  } catch (error) {
    console.error("OTP Verify Error:", error);

    const errorMessage =
      error.response?.data?.message || "OTP verification failed";

    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

console.log(userType);


  return (
    <div className="auth-form">
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Join Counvo to get started</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Type Toggle */}
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={16} />
            Register as
          </label>
          <div className="toggle-button-group">
            <button
              type="button"
              className={`toggle-option ${
                userType === "customer" ? "active" : ""
              }`}
              onClick={() => handleUserTypeToggle("customer")}
              disabled={isLoading}
            >
              <User size={20} />
              <span>Client</span>
            </button>
            <button
              type="button"
              className={`toggle-option ${
                userType === "lawyer" ? "active" : ""
              }`}
              onClick={() => handleUserTypeToggle("lawyer")}
              disabled={isLoading}
            >
              <Scale size={20} />
              <span>Lawyer</span>
            </button>
          </div>
          <input
            type="hidden"
            value={userType}
            {...register("userType", { required: "Please select user type" })}
          />
          {errors.userType && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.userType.message}
            </span>
          )}
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label
            htmlFor="fullName"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <User size={16} />
            Full Name
          </label>
          <div className="input-with-icon">
            <input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              disabled={isLoading}
              placeholder="John Doe"
              className={errors.fullName ? "input-error" : ""}
            />
          </div>
          {errors.fullName && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label
            htmlFor="email"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Mail size={16} />
            Email Address
          </label>
          <div className="input-with-icon">
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              disabled={isLoading}
              placeholder="you@example.com"
              className={errors.email ? "input-error" : ""}
            />
          </div>
          {errors.email && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Mobile */}
        <div className="form-group">
          <label
            htmlFor="mobile"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Phone size={16} />
            Mobile Number
          </label>
          <div className="input-with-icon">
            <input
              type="tel"
              id="mobile"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message:
                    "Invalid mobile number (10 digits starting with 6-9)",
                },
              })}
              disabled={isLoading}
              placeholder="9876543210"
              className={errors.mobile ? "input-error" : ""}
            />
          </div>
          {errors.mobile && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.mobile.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label
            htmlFor="password"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Lock size={16} />
            Password
          </label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              disabled={isLoading}
              placeholder="Create a password"
              className={errors.password ? "input-error" : ""}
            />
            <button
              type="button"
              tabIndex={-1}
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label
            htmlFor="confirmPassword"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Lock size={16} />
            Confirm Password
          </label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              disabled={isLoading}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "input-error" : ""}
            />
          </div>
          {errors.confirmPassword && (
            <span className="error-message">
              <AlertCircle size={14} />
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {loading ? (
            <>
              <Loader2 size={18} className="spinner-icon" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </button>

        {/* Sign In Link */}
        <div className="form-footer-text">
          <p>
            Already have an account?{" "}
            <Link to="/auth/signin" className="form-link">
              Sign in
            </Link>
          </p>
        </div>
      </form>

      {showOtp && (
  <div style={modalOverlay}>
    <div style={modalContent}>
      <h2 style={{ marginBottom: "10px" }}>Verify OTP</h2>

      <p style={{ fontSize: "14px", marginBottom: "15px" }}>
        OTP has been sent to <b>{formData?.email}</b>
      </p>

      <form onSubmit={handleVerifyOtp}>
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
          maxLength={6}
          required
        />

        <button type="submit" style={buttonStyle}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <button
        onClick={() => setShowOtp(false)}
        style={closeButton}
      >
        ✖
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default SignUpForm;