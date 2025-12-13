import { Navigate, Outlet } from "react-router-dom";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { getUserDetails } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      dispatch(getUserDetails());
    }
  }, [token]);

  if (!token) {
    return <Navigate to={NAVIGATION_CONSTANTS.LOGIN_PATH} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

