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
import Payment from "../components/Client/Payment";
import AdminReport from "../components/Admin/AdminReport";
import Home from "../components/home";
import ShippingPolicy from "../components/shipping_policy";
import CancelliationPolicy from "../components/cancellation_policy";
import Privacyolicy from "../components/privacy_policy";
import ContactUs from "../components/contactus";
import AboutUs from "../components/aboutus";
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
import TermsAndConditions from "../components/terms&condition";
import ManageBlogs from "../components/Admin/ManageBlogs";

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
/* <Route path="/" element={<Home />}></Route>
              <Route path="/aboutus" element={<AboutUs />}></Route>
              <Route path="/contactus" element={<ContactUs />}></Route>
              <Route path="/privacy-policy" element={<Privacyolicy />}></Route>
              <Route
                path="/shipping-policy"
                element={<ShippingPolicy />}
              ></Route>
              <Route
                path="/cancellation-policy"
                element={<CancelliationPolicy />}
              /> */
const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/privacy-policy", element: <Privacyolicy /> },
      { path: "/termsandconditions", element: <TermsAndConditions /> },
      { path: "/shipping-policy", element: <ShippingPolicy /> },
      { path: "/cancellation-policy", element: <CancelliationPolicy /> },
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
          { path: NAVIGATION_CONSTANTS.PAYMENT_PATH, element: <Payment /> },
          { path: NAVIGATION_CONSTANTS.REPORT_PATH, element: <AdminReport /> },
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
        ],
      },
    ],
  },
]);

export default router;
