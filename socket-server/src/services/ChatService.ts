import axios, { AxiosInstance } from "axios";
import { config } from "../config";
import { User, RoomMessage } from "../types/socketEvents";

export class ChatService {
  private api: AxiosInstance;
  private roomsCache = new Map<number, string>();

  constructor() {
    this.api = axios.create({
      baseURL: config.SYMFONY_API_URL,
      timeout: 10000,
    });
  }

  /**
   * Valide un token JWT et récupère les infos utilisateur
   */
  async validateUser(token: string): Promise<User | null> {
    try {
      const response = await this.api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur validation token:", error);
      return null;
    }
  }

  /**
   * Récupère les rooms d'un utilisateur
   */
  async getUserRooms(token: string): Promise<any[]> {
    try {
      const response = await this.api.get("/message/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rooms = response.data;

      // Mettre en cache les identifiers
      rooms.forEach((roomData: any) => {
        const roomId = roomData.room.id;
        const identifier = roomData.room.identifier || `room_${roomId}`;
        this.roomsCache.set(roomId, identifier);
      });

      return rooms;
    } catch (error) {
      console.error("❌ Erreur récupération rooms:", error);
      return [];
    }
  }

  /**
   * Récupère l'identifier d'une room à partir de son ID
   */
  getRoomIdentifier(roomId: number): string {
    return this.roomsCache.get(roomId) || `room_${roomId}`;
  }

  /**
   * Envoie un message via l'API Symfony
   */
  async sendMessage(
    roomId: number,
    content: string,
    image: string | undefined,
    token: string
  ): Promise<RoomMessage | null> {
    try {
      // Envoyer en JSON simple, image est une URL (string) ou undefined
      const payload: any = { content, type: "reply", parent_post_id: null };
      if (image) {
        payload.image = image; // image doit être une URL (string)
      }

      const response = await this.api.post(
        `/message/rooms/${roomId}/messages`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur envoi message:", error);
      return null;
    }
  }

  /**
   * Marque un message comme lu
   */
  async markMessageAsRead(messageId: number, token: string): Promise<boolean> {
    try {
      await this.api.post(
        `/message/messages/${messageId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return true;
    } catch (error) {
      console.error("❌ Erreur marquer comme lu:", error);
      return false;
    }
  }

  /**
   * Vérifie si un utilisateur a accès à une room
   */
  async hasRoomAccess(roomId: number, token: string): Promise<boolean> {
    try {
      const rooms = await this.getUserRooms(token);
      return rooms.some((roomData) => roomData.room.id === roomId);
    } catch {
      return false;
    }
  }

  /**
   * Crée un DM avec un autre utilisateur
   */
  async createDirectMessage(
    targetUserId: number,
    token: string
  ): Promise<any | null> {
    try {
      const response = await this.api.post(
        "/message/rooms",
        {
          type: "DM",
          participant_ids: [targetUserId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur création DM:", error);
      return null;
    }
  }

  /**
   * Crée un groupe de chat
   */
  async createGroupChat(
    name: string,
    participantIds: number[],
    token: string
  ): Promise<any | null> {
    try {
      const response = await this.api.post(
        "/message/rooms",
        {
          type: "Group",
          name: name,
          participant_ids: participantIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur création groupe:", error);
      return null;
    }
  }

  /**
   * Met à jour le cache des identifiers
   */
  updateRoomCache(roomId: number, identifier: string): void {
    this.roomsCache.set(roomId, identifier);
  }
}
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur création groupe:", error);
      return null;
    }
  }

  /**
   * Met à jour le cache des identifiers
   */
  updateRoomCache(roomId: number, identifier: string): void {
    this.roomsCache.set(roomId, identifier);
  }
}
