import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Loader2, AlertCircle, Users, Scale } from 'lucide-react';
import Swal from 'sweetalert2';
import { register as registerUser, clearError, selectIsLoading, selectError } from '../../redux/slices/authSlice';
import './authForms.css';

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  
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

  const onSubmit = async (data) => {
    // Clear any previous errors
    dispatch(clearError());
    console.log(data);
    // Dispatch register action
    const resultAction = await dispatch(
      registerUser({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        userType: data.userType,
      })
    );

    // Check if registration was successful
    if (registerUser.fulfilled.match(resultAction)) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please sign in to continue",
        confirmButtonColor: "#667eea",
      }).then(() => {
        navigate("/auth/signin");
      });
    }
  };

  return (
    <div className="auth-form">
      <h2 className="form-title">Create Account</h2>
      <p className="form-subtitle">Join Counvo to get started</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* User Type Toggle */}
        <div className="form-group">
          <label>
            <Users size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          <label htmlFor="fullName">
            <User size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          <label htmlFor="email">
            <Mail size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          <label htmlFor="mobile">
            <Phone size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          <label htmlFor="password">
            <Lock size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          <label htmlFor="confirmPassword">
            <Lock size={16} style={{ display: "inline-block", marginRight: "5px" }} />
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
          {isLoading ? (
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
    </div>
  );
};

export default SignUpForm;