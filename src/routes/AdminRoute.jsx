import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRouteBasedOnUserType } from "../utils";

const AdminRoute = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to={getRouteBasedOnUserType(user?.role)} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
