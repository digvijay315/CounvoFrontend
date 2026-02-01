import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { getUserDetails } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const ProtectedRoute = () => {
  const { token, handleLogout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      dispatch(getUserDetails());
    } else {
      handleLogout();
      // navigate(NAVIGATION_CONSTANTS.LOGIN_PATH, { replace: true });
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
