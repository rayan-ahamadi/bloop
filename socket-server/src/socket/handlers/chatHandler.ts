import { Server, Socket } from "socket.io";
import { ChatService } from "../../services/ChatService";
import { config } from "../../config";

export class ChatHandler {
  private io: Server;
  private chatService: ChatService;

  // Map pour gérer les utilisateurs qui tapent
  private typingUsers = new Map<string, Set<number>>(); // roomIdentifier -> Set<userId>

  constructor(io: Server) {
    this.io = io;
    this.chatService = new ChatService();
  }

  /**
   * Gère une nouvelle connexion
   */
  public handleConnection(socket: Socket): void {
    const user = socket.data.user;
    console.log(
      `✅ ${user.name} (${user.id}) connected with socket ${socket.id}`
    );

    // Faire rejoindre l'utilisateur à ses rooms
    this.joinUserRooms(socket);

    // Écouter les événements
    socket.on("join_room", (data) => this.handleJoinRoom(socket, data));
    socket.on("create_dm", (data) => this.handleCreateDM(socket, data)); // ← NOUVEAU
    socket.on("create_group", (data) => this.handleCreateGroup(socket, data));
    socket.on("leave_room", (data) => this.handleLeaveRoom(socket, data));
    socket.on("send_message", (data) => this.handleSendMessage(socket, data));
    socket.on("typing_start", (data) => this.handleTypingStart(socket, data));
    socket.on("typing_stop", (data) => this.handleTypingStop(socket, data));
    socket.on("mark_message_read", (data) => this.handleMarkRead(socket, data));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  /**
   * Fait rejoindre l'utilisateur à toutes ses rooms au démarrage
   */
  private async joinUserRooms(socket: Socket): Promise<void> {
    try {
      const token = socket.handshake.auth.token;
      const rooms = await this.chatService.getUserRooms(token);

      // Stocker les IDs ET les identifiers
      socket.data.rooms = new Set(); // Set<roomId>
      socket.data.roomIdentifiers = new Map(); // Map<roomId, identifier>

      for (const roomData of rooms) {
        const roomId = roomData.room.id;
        const roomIdentifier = roomData.room.identifier || `room_${roomId}`;

        // Utiliser l'identifier pour Socket.io
        socket.join(roomIdentifier);

        // Stocker les mappings
        socket.data.rooms.add(roomId);
        socket.data.roomIdentifiers.set(roomId, roomIdentifier);

        if (config.DEBUG) {
          console.log(
            `📥 ${socket.data.user.name} joined ${roomIdentifier} (ID: ${roomId})`
          );
        }
      }
    } catch (error) {
      console.error("❌ Erreur joinUserRooms:", error);
    }
  }

  /**
   * Gère la création d'un DM avec un autre utilisateur
   */
  private async handleCreateDM(
    socket: Socket,
    data: { targetUserId: number }
  ): Promise<void> {
    const { targetUserId } = data;
    const user = socket.data.user;
    const token = socket.handshake.auth.token;

    try {
      // Créer le DM via l'API Symfony
      const createdRoom = await this.chatService.createDirectMessage(
        targetUserId,
        token
      );

      if (!createdRoom) {
        socket.emit("error", {
          message: "Erreur lors de la création du DM",
          code: "CREATE_DM_FAILED",
        });
        return;
      }

      const roomId = createdRoom.room.id;
      const roomIdentifier =
        createdRoom.room.identifier ||
        `dm_${Math.min(user.id, targetUserId)}_${Math.max(
          user.id,
          targetUserId
        )}`;

      // Mettre à jour le cache
      this.chatService.updateRoomCache(roomId, roomIdentifier);

      // Faire rejoindre l'utilisateur à la room
      socket.join(roomIdentifier);
      socket.data.rooms.add(roomId);
      socket.data.roomIdentifiers.set(roomId, roomIdentifier);

      // Confirmer la création
      socket.emit("dm_created", {
        success: true,
        room: createdRoom,
        roomId,
        roomIdentifier,
      });

      // Si l'autre utilisateur est connecté, le faire rejoindre aussi
      this.notifyUserAboutNewRoom(targetUserId, roomId, roomIdentifier);

      console.log(
        `💬 DM created between ${user.name} and user ${targetUserId} (${roomIdentifier})`
      );
    } catch (error) {
      console.error("❌ Erreur handleCreateDM:", error);
      socket.emit("error", {
        message: "Erreur serveur lors de la création du DM",
        code: "SERVER_ERROR",
      });
    }
  }

  /**
   * Gère la création d'un groupe de chat
   */
  private async handleCreateGroup(
    socket: Socket,
    data: { name: string; participantIds: number[] }
  ): Promise<void> {
    const { name, participantIds } = data;
    const user = socket.data.user;
    const token = socket.handshake.auth.token;

    try {
      // Créer le groupe via l'API Symfony
      const createdRoom = await this.chatService.createGroupChat(
        name,
        participantIds,
        token
      );

      if (!createdRoom) {
        socket.emit("error", {
          message: "Erreur lors de la création du groupe",
          code: "CREATE_GROUP_FAILED",
        });
        return;
      }

      const roomId = createdRoom.room.id;
      const roomIdentifier = createdRoom.room.identifier || `group_${roomId}`;

      // Mettre à jour le cache
      this.chatService.updateRoomCache(roomId, roomIdentifier);

      // Faire rejoindre le créateur à la room
      socket.join(roomIdentifier);
      socket.data.rooms.add(roomId);
      socket.data.roomIdentifiers.set(roomId, roomIdentifier);

      // Confirmer la création
      socket.emit("group_created", {
        success: true,
        room: createdRoom,
        roomId,
        roomIdentifier,
      });

      // Notifier tous les participants
      participantIds.forEach((participantId) => {
        if (participantId !== user.id) {
          this.notifyUserAboutNewRoom(participantId, roomId, roomIdentifier);
        }
      });

      console.log(
        `👥 Group "${name}" created by ${user.name} (${roomIdentifier})`
      );
    } catch (error) {
      console.error("❌ Erreur handleCreateGroup:", error);
      socket.emit("error", {
        message: "Erreur serveur lors de la création du groupe",
        code: "SERVER_ERROR",
      });
    }
  }

  /**
   * Notifie un utilisateur connecté qu'il a été ajouté à une nouvelle room
   */
  private notifyUserAboutNewRoom(
    userId: number,
    roomId: number,
    roomIdentifier: string
  ): void {
    // Trouver les sockets de cet utilisateur
    this.io.sockets.sockets.forEach((socket) => {
      if (socket.data.user?.id === userId) {
        // Faire rejoindre l'utilisateur à la room
        socket.join(roomIdentifier);
        socket.data.rooms.add(roomId);
        socket.data.roomIdentifiers.set(roomId, roomIdentifier);

        // Notifier l'utilisateur
        socket.emit("new_room_added", {
          roomId,
          roomIdentifier,
          message: "Vous avez été ajouté à une nouvelle conversation",
        });

        console.log(`📥 User ${userId} automatically joined ${roomIdentifier}`);
      }
    });
  }

  /**
   * Gère l'événement join_room
   */
  private async handleJoinRoom(
    socket: Socket,
    data: { roomId: number }
  ): Promise<void> {
    const { roomId } = data;
    const user = socket.data.user;
    const token = socket.handshake.auth.token;

    // Vérifier l'accès à la room
    const hasAccess = await this.chatService.hasRoomAccess(roomId, token);
    if (!hasAccess) {
      socket.emit("error", {
        message: "Accès refusé à cette room",
        code: "ACCESS_DENIED",
      });
      return;
    }

    // Récupérer l'identifier
    const roomIdentifier = this.chatService.getRoomIdentifier(roomId);

    // Rejoindre la room avec l'identifier
    socket.join(roomIdentifier);
    socket.data.rooms.add(roomId);
    socket.data.roomIdentifiers.set(roomId, roomIdentifier);

    // Notifier les autres participants
    socket.to(`room_${roomId}`).emit("user_joined_room", { user, roomId });

    console.log(`📥 ${user.name} joined room ${roomId}`);
  }

  /**
   * Gère l'événement leave_room
   */
  private handleLeaveRoom(socket: Socket, data: { roomId: number }): void {
    const { roomId } = data;
    const user = socket.data.user;

    // Récupérer l'identifier
    const roomIdentifier =
      socket.data.roomIdentifiers?.get(roomId) || `room_${roomId}`;

    socket.leave(roomIdentifier);
    socket.data.rooms.delete(roomId);
    socket.data.roomIdentifiers?.delete(roomId);

    // Nettoyer les indicateurs de frappe
    this.removeUserFromTyping(roomIdentifier, user.id);

    // Notifier les autres participants
    socket
      .to(roomIdentifier)
      .emit("user_left_room", { userId: user.id, roomId });

    console.log(`📤 ${user.name} left room ${roomId}`);
  }

  /**
   * Gère l'envoi de message
   */
  private async handleSendMessage(
    socket: Socket,
    data: { roomId: number; content: string; image?: string }
  ): Promise<void> {
    const { roomId, content, image } = data; // image doit être une URL (string) ou undefined
    const user = socket.data.user;
    const token = socket.handshake.auth.token;

    try {
      // Vérifier l'accès à la room
      if (!socket.data.rooms.has(roomId)) {
        socket.emit("error", {
          message: "Vous n'êtes pas dans cette room",
          code: "NOT_IN_ROOM",
        });
        return;
      }

      // Récupérer l'identifier
      const roomIdentifier =
        socket.data.roomIdentifiers?.get(roomId) || `room_${roomId}`;

      // Sauvegarder le message via l'API Symfony (utilise l'ID)
      const savedMessage = await this.chatService.sendMessage(
        roomId,
        content,
        image,
        token
      );

      if (!savedMessage) {
        socket.emit("message_sent", {
          success: false,
          error: "Erreur lors de la sauvegarde",
        });
        return;
      }

      // Diffuser le message aux autres participants (utilise l'identifier)
      socket.to(roomIdentifier).emit("new_message", {
        message: savedMessage,
        roomId,
      });

      // Confirmer l'envoi à l'expéditeur
      socket.emit("message_sent", { success: true, message: savedMessage });

      // Arrêter l'indicateur de frappe si actif
      this.removeUserFromTyping(roomIdentifier, user.id);

      console.log(`💬 Message sent by ${user.name} in room ${roomId}`);
    } catch (error) {
      console.error("❌ Erreur handleSendMessage:", error);
      socket.emit("message_sent", { success: false, error: "Erreur serveur" });
    }
  }

  /**
   * Gère le début de frappe
   */
  private handleTypingStart(socket: Socket, data: { roomId: number }): void {
    const { roomId } = data;
    const user = socket.data.user;

    // Vérifier que l'utilisateur est dans la room
    if (!socket.data.rooms.has(roomId)) {
      return;
    }

    // Récupérer l'identifier
    const roomIdentifier =
      socket.data.roomIdentifiers?.get(roomId) || `room_${roomId}`;

    // Ajouter l'utilisateur aux personnes qui tapent
    if (!this.typingUsers.has(roomIdentifier)) {
      this.typingUsers.set(roomIdentifier, new Set());
    }
    this.typingUsers.get(roomIdentifier)!.add(user.id);

    // Notifier les autres participants
    socket.to(roomIdentifier).emit("user_typing", { user, roomId });

    console.log(
      `⌨️ ${user.name} is typing in ${roomIdentifier} (ID: ${roomId})`
    );
  }

  /**
   * Gère l'arrêt de frappe
   */
  private handleTypingStop(socket: Socket, data: { roomId: number }): void {
    const { roomId } = data;
    const user = socket.data.user;

    // Récupérer l'identifier
    const roomIdentifier =
      socket.data.roomIdentifiers?.get(roomId) || `room_${roomId}`;

    this.removeUserFromTyping(roomIdentifier, user.id);

    // Notifier les autres participants
    socket
      .to(roomIdentifier)
      .emit("user_stopped_typing", { userId: user.id, roomId });

    console.log(
      `⌨️ ${user.name} stopped typing in ${roomIdentifier} (ID: ${roomId})`
    );
  }

  /**
   * Gère le marquage comme lu
   */
  private async handleMarkRead(
    socket: Socket,
    data: { messageId: number }
  ): Promise<void> {
    const { messageId } = data;
    const user = socket.data.user;
    const token = socket.handshake.auth.token;

    try {
      const success = await this.chatService.markMessageAsRead(
        messageId,
        token
      );

      if (success) {
        // Notifier tous les participants concernés
        for (const roomId of socket.data.rooms) {
          const roomIdentifier =
            socket.data.roomIdentifiers?.get(roomId) || `room_${roomId}`;
          socket
            .to(roomIdentifier)
            .emit("message_read", { messageId, userId: user.id });
        }

        console.log(`✅ Message ${messageId} marked as read by ${user.name}`);
      }
    } catch (error) {
      console.error("❌ Erreur handleMarkRead:", error);
    }
  }

  /**
   * Gère la déconnexion
   */
  private handleDisconnect(socket: Socket): void {
    const user = socket.data.user;

    // Nettoyer les indicateurs de frappe pour toutes les rooms
    if (socket.data.rooms && socket.data.roomIdentifiers) {
      for (const roomId of socket.data.rooms) {
        const roomIdentifier =
          socket.data.roomIdentifiers.get(roomId) || `room_${roomId}`;

        this.removeUserFromTyping(roomIdentifier, user.id);
        socket
          .to(roomIdentifier)
          .emit("user_left_room", { userId: user.id, roomId });
      }
    }

    console.log(`❌ ${user.name} (${user.id}) disconnected`);
  }

  /**
   * Retire un utilisateur des personnes qui tapent
   */
  private removeUserFromTyping(roomIdentifier: string, userId: number): void {
    const typingSet = this.typingUsers.get(roomIdentifier);
    if (typingSet) {
      typingSet.delete(userId);
      if (typingSet.size === 0) {
        this.typingUsers.delete(roomIdentifier);
      }
    }
  }
}
