import axios from "axios";
import { APP_CONFIG } from "./_constants/config";
import { toast } from "react-toastify";
import { NAVIGATION_CONSTANTS } from "./_constants/navigationConstants";
import { store } from "./redux/store";
import { clearUser } from "./redux/slices/authSlice";

const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  // baseURL: "https://api.counvo.in/",
});

api.interceptors.request.use(async (config) => {
  let token =
    store.getState()?.auth?.token || localStorage.getItem("authToken") || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {

      store.dispatch(clearUser());
      localStorage.removeItem("authToken");
      localStorage.removeItem("persist:root");
      window.location.href = NAVIGATION_CONSTANTS.LOGIN_PATH;

      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      toast.error("You are not authorized to access this resource.");
      return Promise.reject(error);
    }
    if (error.response.status === 404) {
      toast.error("Resource not found.");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
