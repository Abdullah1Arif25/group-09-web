
import { io } from "socket.io-client";

const SOCKET_URL = "https://group-09-web-backend.onrender.com"; 

export const socket = io(SOCKET_URL);
