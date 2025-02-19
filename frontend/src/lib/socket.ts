import { io, type ManagerOptions } from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD 
  ? "https://spotify-backend-3idi.onrender.com"
  : "http://localhost:5000";

const socketOptions: Partial<ManagerOptions> = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ["polling", "websocket"],
  withCredentials: true,
  path: "/socket.io/",
};

export const socket = io(SOCKET_URL, socketOptions);

// Add error handling
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  // On error, force polling only
  socket.io.opts.transports = ["polling"];
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

export default socket; 