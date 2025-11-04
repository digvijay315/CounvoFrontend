
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
//import Register from './components/register';
//import AuthTabs from './components/demo';
//import Header from './components/header';
import ClientDashboard from './components/ClientDashboard';
import LawyerDashboard from './components/LawyerDashboard';
import AdminPanel from './components/AdminPanel';
import LawyerProfileModal from './components/LawyerProfileModel';
import PendingLawyersTable from './components/Admin/pendinglawyer';
import Clients from './components/Admin/clients';
import Findalawyer from './components/Client/findalawyer';
import Support from './components/support';
import ClientProfileModal from './components/Client/clientprofile';
import OnlineLawyerConsultation from './components/landingpage';
import Clientchathistory from './components/Client/clientchathistory';
import TermsAndConditions from './components/terms&condition';
import ProtectedRoute from './components/authguard';
import ProtectedRoute1 from './components/authgurard1';
import AboutUs from './components/aboutus';
import ContactUs from './components/contactus';
import Allchat from './components/Admin/allchat';
import { LawyerFeedbackForm } from './components/lawyerfeedback';
import CustomerFeedbackForm from './components/customerfeedback';
import LawyerChatHistory from './components/lawyerchathistory';
import Privacyolicy from './components/privacy_policy';
import ShippingPolicy from './components/shipping_policy';
import CancelliationPolicy from './components/cancellation_policy';
import AdminReport from './components/Admin/AdminReport';





function App() {
  return (
    <BrowserRouter>
    <div>
     <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/ClientDashboard' element={<ProtectedRoute><ClientDashboard/></ProtectedRoute>}></Route>
      <Route path='/LawyerDashboard' element={<ProtectedRoute1><LawyerDashboard/></ProtectedRoute1>}></Route>
      <Route path='/AdminPanel' element={<AdminPanel/>}></Route>
      <Route path='LawyerDashboard/completelawyerprofile' element={<LawyerProfileModal/>}></Route>
      <Route path='/pendinglawyers' element={<PendingLawyersTable/>}></Route>
      <Route path='/allclients' element={<Clients/>}></Route>
      <Route path='/findlawyer' element={<Findalawyer/>}></Route>
      <Route path='/supports' element={<Support/>}></Route>
      <Route path='/clientprofile' element={<ClientProfileModal/>}></Route>
      <Route path='/clientchathistory' element={<Clientchathistory/>}></Route>
      <Route path='/termsandconditions' element={<TermsAndConditions/>}></Route>
      <Route path='/aboutus' element={<AboutUs/>}></Route>
      <Route path='/contactus' element={<ContactUs/>}></Route>
      <Route path='/allchat' element={<Allchat/>}></Route>
      <Route path='/lawyerchathistory' element={<ProtectedRoute1><LawyerChatHistory/></ProtectedRoute1>}></Route>
      <Route path='/privacy-policy' element={<Privacyolicy/>}></Route>
      <Route path='/shipping-policy' element={<ShippingPolicy/>}></Route>
      <Route path='/cancellation-policy' element={<CancelliationPolicy/>}></Route>
      <Route path='/admin-report' element={<AdminReport/>}></Route>
    </Routes>  

   </div>
   </BrowserRouter>
  );
}

export default App;
