import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      auth: {
        token, // Si tu veux envoyer un JWT ou autre
      },
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket() first.");
  }
  return socket;
};
