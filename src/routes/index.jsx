import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInForm from "../components/Auth/SignInForm";
import SignUpForm from "../components/Auth/SignUpForm";
import DashboardContent from "../components/dashboard/DashboardContent";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import Findalawyer from "../components/Client/FindLawyer";
import ClientConsultationHistory from "../components/Client/ClientConsultationHistory";
import Support from "../components/Support";
import AdminPanel from "../components/AdminPanel";
import LawyerDashboard from "../components/LawyerDashboard";
import LawyerConsultationHistory from "../components/Lawyer/LawyerConsultationHistory";
import AdminReport from "../components/Admin/AdminReport";
import useAuth from "../hooks/useAuth";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import LawyerProfile from "../components/Lawyer/LawyerProfile";
import ClientProfile from "../components/Client/ClientProfile";
import LawyerProfilePage from "../components/Client/LawyerProfilePage";
import ManageApprovals from "../components/Admin/ManageApprovals";
import AdminManageUsers from "../components/Admin/AdminManageUsers";
import ChatPage from "../components/shared/ChatPage";
import LawyerClients from "../components/LawyerClients";
import ManageBlogs from "../components/Admin/ManageBlogs";
import AdminManagePayments from "../components/Admin/AdminManagePayments";
import ErrorPage from "./ErrorPage";

const RoleBasedRoutes = ({ UserElement, LawyerElement, AdminElement }) => {
  const { user } = useAuth();
  switch (user?.role) {
    case "admin":
      return AdminElement ?? null;
    case "lawyer":
      return LawyerElement ?? null;
    default:
      return UserElement ?? null;
  }
};

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { path: NAVIGATION_CONSTANTS.LOGIN_PATH, element: <SignInForm /> },
          { path: NAVIGATION_CONSTANTS.REGISTER_PATH, element: <SignUpForm /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        path: NAVIGATION_CONSTANTS.DASHBOARD_PATH,
        children: [
          {
            path: NAVIGATION_CONSTANTS.DASHBOARD_PATH,
            element: (
              <RoleBasedRoutes
                UserElement={<DashboardContent />}
                LawyerElement={<LawyerDashboard />}
                AdminElement={<AdminPanel />}
              />
            ),
          },
          {
            path: NAVIGATION_CONSTANTS.PROFILE_PATH,
            element: (
              <RoleBasedRoutes
                UserElement={<ClientProfile />}
                LawyerElement={<LawyerProfile />}
              />
            ),
          },
          {
            path: NAVIGATION_CONSTANTS.FIND_LAWYER_PATH,
            element: <RoleBasedRoutes UserElement={<Findalawyer />} />,
          },
          {
            path: `${NAVIGATION_CONSTANTS.LAWYER_PUBLIC_PROFILE_PATH}/:lawyerId`,
            element: <RoleBasedRoutes UserElement={<LawyerProfilePage />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.CLIENTS_PATH,
            element: <RoleBasedRoutes LawyerElement={<LawyerClients />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.MESSAGES_PATH,
            element: (
              <RoleBasedRoutes
                UserElement={<ChatPage userType="customer" />}
                LawyerElement={<ChatPage userType="lawyer" />}
              />
            ),
          },
          {
            path: NAVIGATION_CONSTANTS.HISTORY_PATH,
            element: (
              <RoleBasedRoutes
                UserElement={<ClientConsultationHistory />}
                LawyerElement={<LawyerConsultationHistory />}
              />
            ),
          },

          { path: NAVIGATION_CONSTANTS.SUPPORT_PATH, element: <Support /> },
          {
            path: NAVIGATION_CONSTANTS.REPORT_PATH,
            element: <RoleBasedRoutes AdminElement={<AdminReport />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.MANAGE_APPROVALS_PATH,
            element: <RoleBasedRoutes AdminElement={<ManageApprovals />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.MANAGE_BLOGS_PATH,
            element: <RoleBasedRoutes AdminElement={<ManageBlogs />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.MANAGE_USERS_PATH,
            element: <RoleBasedRoutes AdminElement={<AdminManageUsers />} />,
          },
          {
            path: NAVIGATION_CONSTANTS.MANAGE_PAYMENTS_PATH,
            element: <RoleBasedRoutes AdminElement={<AdminManagePayments />} />,
          },
        ],
      },
    ],
  },
]);

export default router;
