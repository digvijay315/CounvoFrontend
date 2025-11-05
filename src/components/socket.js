// socket.js
import { io } from 'socket.io-client';
import { APP_CONFIG } from "../_constants/config";

const socket = io(APP_CONFIG.SOCKET_URL, {
  autoConnect: false, // important: don't auto-connect immediately
});

export default socket;
