import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";

const GuestRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to={NAVIGATION_CONSTANTS.DASHBOARD_PATH} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

