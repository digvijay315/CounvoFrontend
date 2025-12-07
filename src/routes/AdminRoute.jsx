import { Navigate, Outlet } from "react-router-dom";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to={NAVIGATION_CONSTANTS.DASHBOARD_PATH} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

