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
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
