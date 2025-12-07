
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Home from './components/home';
import Login from "./components/login";
import LawyerDashboard from "./components/LawyerDashboard";
import AdminPanel from "./components/AdminPanel";
import LawyerProfileModal from "./components/LawyerProfileModel";
import PendingLawyersTable from "./components/Admin/pendinglawyer";
import Clients from "./components/Admin/clients";
import Findalawyer from "./components/Client/findalawyer";
import Support from "./components/support";
import ClientProfile from "./components/Client/ClientProfile";
import Clientchathistory from "./components/Client/clientchathistory";
import TermsAndConditions from "./components/terms&condition";
import ProtectedRoute from "./components/authguard";
import ProtectedRoute1 from "./components/authgurard1";
import AboutUs from "./components/aboutus";
import ContactUs from "./components/contactus";
import Allchat from "./components/Admin/allchat";
import LawyerChatHistory from "./components/lawyerchathistory";
import Privacyolicy from "./components/privacy_policy";
import ShippingPolicy from "./components/shipping_policy";
import CancelliationPolicy from "./components/cancellation_policy";
import AdminReport from "./components/Admin/AdminReport";
import Payment from "./components/Client/Payment";
import AuthLayout from "./layouts/AuthLayout";
import SignInForm from "./components/Auth/SignInForm";
import SignUpForm from "./components/Auth/SignUpForm";
import DashboardLayout from "./layouts/DashboardLayout";
import { Dashboard } from "@mui/icons-material";
import DashboardContent from "./components/dashboard/DashboardContent";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Auth Layout Routes - Beautiful split-screen design */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignInForm />} />
            <Route path="signup" element={<SignUpForm />} />
          </Route>

          {/* To be Removed */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>

          {/* Public Routes */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/aboutus" element={<AboutUs />}></Route>
          <Route path="/contactus" element={<ContactUs />}></Route>
          <Route path="/privacy-policy" element={<Privacyolicy />}></Route>
          <Route path="/shipping-policy" element={<ShippingPolicy />}></Route>
          <Route
            path="/cancellation-policy"
            element={<CancelliationPolicy />}
          />

          {/* Private Application Routes */}

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardContent />}></Route>
            <Route path="findlawyer" element={<Findalawyer />}></Route>
            <Route path="history" element={<Clientchathistory />}></Route>
            <Route path="profile" element={<ClientProfile />}></Route>
            <Route path="supports" element={<Support />}></Route>
          </Route>

          {/* Regular Routes */}

          <Route
            path="/LawyerDashboard"
            element={
              <ProtectedRoute1>
                <LawyerDashboard />
              </ProtectedRoute1>
            }
          ></Route>
          <Route path="/AdminPanel" element={<AdminPanel />}></Route>
          <Route
            path="LawyerDashboard/completelawyerprofile"
            element={<LawyerProfileModal />}
          ></Route>
          <Route
            path="/pendinglawyers"
            element={<PendingLawyersTable />}
          ></Route>
          <Route path="/allclients" element={<Clients />}></Route>
          <Route path="/findlawyer" element={<Findalawyer />}></Route>
          <Route path="/supports" element={<Support />}></Route>
          <Route path="/clientprofile" element={<ClientProfile />}></Route>
          <Route
            path="/clientchathistory"
            element={<Clientchathistory />}
          ></Route>
          <Route
            path="/termsandconditions"
            element={<TermsAndConditions />}
          ></Route>
          <Route path="/allchat" element={<Allchat />}></Route>
          <Route
            path="/lawyerchathistory"
            element={
              <ProtectedRoute1>
                <LawyerChatHistory />
              </ProtectedRoute1>
            }
          ></Route>

          <Route path="/admin-report" element={<AdminReport />}></Route>
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
