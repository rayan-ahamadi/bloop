import { Server, Socket } from "socket.io";
import { ChatHandler } from "./handlers/chatHandler";
import { ChatService } from "../services/ChatService";
import { config } from "../config";

export class SocketManager {
  private chatHandler: ChatHandler;
  private chatService: ChatService;

  constructor(private io: Server) {
    this.chatHandler = new ChatHandler(io);
    this.chatService = new ChatService();
    this.setupMiddleware();
  }

  /**
   * Configure les middlewares Socket.io
   */
  private setupMiddleware(): void {
    // Middleware d'authentification
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error("Token manquant"));
        }

        // Valider le token via Symfony
        const user = await this.chatService.validateUser(token);

        if (!user) {
          return next(new Error("Token invalide"));
        }

        // Stocker les données utilisateur dans le socket
        socket.data.user = user;
        socket.data.rooms = new Set();

        next();
      } catch (error) {
        console.error("❌ Erreur authentification:", error);
        next(new Error("Erreur authentification"));
      }
    });

    // Middleware de logging
    this.io.use((socket, next) => {
      if (config.DEBUG) {
        console.log(`🔗 Tentative de connexion: ${socket.handshake.address}`);
      }
      next();
    });
  }

  /**
   * Gère une nouvelle connexion Socket.io
   */
  public handleConnection(socket: Socket): void {
    this.chatHandler.handleConnection(socket);
  }
}
