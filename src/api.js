import axios from "axios";
import { APP_CONFIG } from "./_constants/config";

let token = localStorage.getItem("authToken") || null;
const api = axios.create({
  baseURL: APP_CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});
export default api;
