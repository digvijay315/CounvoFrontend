import axios from "axios";
import { APP_CONFIG } from "./_constants/config";
const instance = axios.create({
  baseURL: APP_CONFIG.API_URL,
});
export default instance;
