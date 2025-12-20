import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRouteBasedOnUserType } from "../utils";

const GuestRoute = () => {
  const { token, userRole } = useAuth();
  const currentPath = window.location.pathname;
  const isAuthRoute = currentPath.startsWith("/auth");

  if (token && isAuthRoute) {
    return <Navigate to={getRouteBasedOnUserType(userRole)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

