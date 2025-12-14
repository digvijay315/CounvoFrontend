import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getRouteBasedOnUserType } from "../utils";

const GuestRoute = () => {
  const { token, userRole } = useAuth();

  if (token) {
    return <Navigate to={getRouteBasedOnUserType(userRole)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

