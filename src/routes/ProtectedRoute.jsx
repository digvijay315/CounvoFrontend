import { Navigate, Outlet } from "react-router-dom";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={NAVIGATION_CONSTANTS.LOGIN_PATH} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

