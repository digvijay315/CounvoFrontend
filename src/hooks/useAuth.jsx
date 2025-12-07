import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserRole,
  selectUser,
  selectAuth,
  clearUser,
} from "../redux/slices/authSlice";

/**
 * Custom hook to access authentication state from Redux store
 * Replaces direct localStorage access for user data
 * 
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const userRole = useSelector(selectUserRole);
  const user = useSelector(selectUser);
  const token = useSelector(state => state.auth.token);
  const userId = user?._id;

  // Backward compatibility: matches localStorage.getItem('userDetails') pattern
  const getUserData = () => {
    if (!user || !token) return null;
    return {
      user,
      token,
    };
  };

  // Get user full name
  const userFullName = user?.fullName || '';

  // Get user email
  const userEmail = user?.email || '';

  // Get user mobile
  const userMobile = user?.mobile || '';

  const handleLogout = () => {
    dispatch(clearUser());
  };
  return {
    // Redux dispatch
    dispatch,
    
    // Auth state
    isAuthenticated,
    isLoading,
    error,
    
    // User data
    user,
    userId,
    userRole,
    userFullName,
    userEmail,
    userMobile,
    token,
    
    // Backward compatibility
    getUserData,
    userData: getUserData(), // Direct access to userData object
    handleLogout,
  };
};

export default useAuth;