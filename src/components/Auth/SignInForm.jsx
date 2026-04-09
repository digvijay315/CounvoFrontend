import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  login,
  clearError,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectUserRole,
} from "../../redux/slices/authSlice";
import "./authForms.css";
import { getRouteBasedOnUserType } from "../../utils";
import api from "../../api";

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Redux selectors
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Login successful",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(getRouteBasedOnUserType(userRole));
      });
    }
  }, [isAuthenticated, navigate, userRole]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error,
      });
    }
  }, [error]);

  const onSubmit = async (data) => {
    // Clear any previous errors
    dispatch(clearError());

    // Dispatch login action
    dispatch(
      login({
        email: data.email,
        password: data.password,
      }),
    );
  };

  // ================== forgot password code=========================

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    try {
      const response = await api.post("/api/v2/auth/reset-password", {
        email: email,
      });
      if (response.status === 200) {
        Swal.fire("Success", "OTP sent to your email", "success");
        setStep(2);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to send OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResetting(true);
    if (!otp || !newPassword || !confirmPassword) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      const response = await api.post(
        "/api/v2/auth/verify-otp-reset-password",
        {
          email: email,
          otp: otp,
          newPassword: newPassword,
        },
      );

      if (response.status === 200) {
        Swal.fire("Success", "Password reset successful", "success");
      }

      // Reset everything
      setShowForgotModal(false);
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire("Error", "Reset failed", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Sign in to continue to Counvo</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className="form-group">
          <label
            htmlFor="signin-email"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Mail size={16} />
            Email Address
          </label>
          <div className="input-with-icon">
            <input
              type="email"
              id="signin-email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              autoComplete="username"
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

        {/* Password Input */}
        <div className="form-group">
          <label
            htmlFor="signin-password"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Lock size={16} />
            Password
          </label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              id="signin-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              autoComplete="current-password"
              disabled={isLoading}
              placeholder="Your password"
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

        {/* Remember Me & Forgot Password */}
        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" {...register("rememberMe")} />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="form-link-small cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner-icon" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} />
              Sign In
            </>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="form-footer-text">
          <p>
            Don't have an account?{" "}
            <Link to="/auth/signup" className="form-link">
              Sign up
            </Link>
          </p>
        </div>
      </form>

      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Reset Password</h3>

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleResetPassword} disabled={isResetting}>
                  {isResetting ? (
                    <>
                      <Loader2 size={16} className="spinner-icon" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </>
            )}

            <button onClick={() => setShowForgotModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
