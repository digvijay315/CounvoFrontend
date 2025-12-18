import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store, persistor } from "./redux/store";
import theme from "./theme/theme";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <RouterProvider router={router} />
          {/* <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="signin" element={<SignInForm />} />
                <Route path="signup" element={<SignUpForm />} />
              </Route>

              <Route path="/login" element={<Login />}></Route>
              <Route path="/home" element={<Home />}></Route>

              <Route path="/" element={<Home />}></Route>
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
              />


              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardContent />}></Route>
                <Route path="findlawyer" element={<FindLawyer />}></Route>
                <Route path="history" element={<ClientChathistory />}></Route>
                <Route
                  path="messages"
                  element={<ClientConsultationHistory />}
                ></Route>
                <Route path="profile" element={<ClientProfile />}></Route>
                <Route path="support" element={<Support />}></Route>
                <Route path="clients" element={<LawyerChatHistory />}></Route>
              </Route>


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
              <Route path="/findlawyer" element={<FindLawyer />}></Route>
              <Route path="/supports" element={<Support />}></Route>
              <Route path="/clientprofile" element={<ClientProfile />}></Route>
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
          </BrowserRouter> */}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
