import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { SocketManager } from "./SocketManager";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "../types/socketEvents";
import { config } from "../config";

export const initSocket = (server: HTTPServer): Server => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: config.CORS_ORIGINS,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const manager = new SocketManager(io);

  io.on("connection", (socket) => {
    manager.handleConnection(socket);
  });

  console.log(
    `🔌 Socket.io initialized with CORS origins: ${config.CORS_ORIGINS.join(
      ", "
    )}`
  );

  return io;
};
