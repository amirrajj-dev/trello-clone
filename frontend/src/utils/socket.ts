// socket.ts - Improved version
import { io, Socket } from "socket.io-client";
import { getCookie } from "@/helpers/get-cookie";
import { ENV } from "./env";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const initializeSocket = (userId: string): Socket => {
  if (socket && (currentUserId !== userId || !socket.connected)) {
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }

  if (!socket) {
    const token = getCookie();
    socket = io(ENV.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000", {
      query: { userId },
      auth: { token },
      withCredentials: true,
    });

    currentUserId = userId;

    socket.on("connect", () => {
      console.log("Socket connected for user:", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }
};
