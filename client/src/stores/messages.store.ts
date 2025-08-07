import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user.types";
import {
  RoomWithLastMessage,
  RoomMessage,
  ChatRoom,
  CreateMessageRequest,
  CreateRoomRequest,
} from "@/types/chat.types";
import {
  getUserRooms,
  getRoomMessages,
  sendMessage,
  createRoom,
  createDM,
  createGroup,
  markMessageAsRead,
  uploadMessageImage,
} from "@/services/API/messages.api";

import { useUserStore } from "./user.stores";

type messageState = {
  displayMessageLayout: boolean;
  roomID: number | null;
  roomIdentifier: string | null;
  roomList: RoomWithLastMessage[];
  roomMessageList: RoomMessage[];
  roomName: string | null;
  roomAvatar: string | null;
  roomType: string | null;
  roomMembers: User[];
  loading: boolean;
  error: string | null;
  setDisplayMessageLayout: (display: boolean) => void;
  setRoomInfo: (
    roomID: number,
    roomName: string,
    roomAvatar: string,
    roomType: string,
    roomMembers: User[],
    roomMessageList?: RoomMessage[]
  ) => void;
  enterRoom: (roomIdentifier: string) => Promise<void>;
  leaveRoom: () => void;
  sendMessage: (
    roomID: number,
    content: string,
    image?: string
  ) => Promise<void>;
  fetchMessages: (roomID: number, page?: number) => Promise<void>;
  fetchRooms: () => Promise<void>;
  createDirectMessage: (userId: number) => Promise<void>;
  createGroupChat: (name: string, participantIds: number[]) => Promise<void>;
  markAsRead: (messageId: number) => Promise<void>;
};

export const useMessageStore = create<messageState>()(
  persist(
    (set, get) => ({
      displayMessageLayout: true,
      roomID: null,
      roomIdentifier: null,
      roomList: [],
      roomMessageList: [],
      roomName: null,
      roomAvatar: null,
      roomType: null,
      roomMembers: [],
      loading: false,
      error: null,

      setDisplayMessageLayout: (display: boolean) =>
        set({ displayMessageLayout: display }),

      setRoomInfo: (
        roomID: number,
        roomName: string,
        roomAvatar: string,
        roomType: string,
        roomMembers: User[],
        roomMessageList: RoomMessage[] = []
      ) =>
        set({
          roomID,
          roomName,
          roomAvatar,
          roomType,
          roomMembers,
          roomMessageList,
        }),

      enterRoom: async (roomIdentifier: string) => {
        set({ loading: true, error: null });
        try {
          const socket = useUserStore.getState().socket;
          if (!socket) throw new Error("Socket non initialisé");
          // Demander au serveur de rejoindre la room
          socket.emit("join_room", { roomIdentifier });

          // Attendre la confirmation (optionnel, ici on continue sans attendre)
          // socket.once("joined_room", ...)

          // Récupérer les détails de la room à partir de la liste
          const { roomList } = get();
          const roomData = roomList.find(
            (r) => r.room.identifier === roomIdentifier
          );
          if (roomData) {
            const { room } = roomData;
            let roomName = room.name || "";
            let roomAvatar = "";
            if (room.type === "DM" && room.participants.length === 2) {
              const otherParticipant =
                room.participants[0].user.id ===
                useUserStore.getState().user?.id
                  ? room.participants[1]
                  : room.participants[0];
              roomName = otherParticipant.user.name;
              roomAvatar = otherParticipant.user.avatarUrl || "";
            }
            set({
              roomID: room.id,
              roomName,
              roomAvatar,
              roomType: room.type,
              roomMembers: room.participants.map((p) => p.user),
              roomIdentifier: room.identifier,
              loading: false,
            });
            await get().fetchMessages(room.id);
          } else {
            throw new Error("Room non trouvée");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      leaveRoom: () => {
        const socket = useUserStore.getState().socket;
        const roomIdentifier = get().roomIdentifier;
        // if (socket && roomIdentifier) {
        //   socket.emit("leave_room", { roomIdentifier }); // ne pas quitter la room pour recevoir les notifications
        // }
        set({
          roomID: null,
          roomName: null,
          roomAvatar: null,
          roomType: null,
          roomMembers: [],
          roomMessageList: [],
          roomIdentifier: null,
        });
      },

      sendMessage: async (roomID: number, content: string, image?: any) => {
        set({ loading: true, error: null });
        try {
          const socket = useUserStore.getState().socket;
          if (!socket) throw new Error("Socket non initialisé");
          let imageUrl;
          if (image) {
            imageUrl = await uploadMessageImage(image);
          }
          socket.emit("send_message", {
            roomId: roomID,
            content,
            image: imageUrl,
          });
          await new Promise<void>((resolve, reject) => {
            socket.once("message_sent", async (data) => {
              if (data.success) {
                await get().fetchMessages(roomID);
                resolve();
              } else {
                reject(data.error || "Erreur lors de l'envoi du message");
              }
            });
            socket.once("error", (err) =>
              reject(err.message || "Erreur socket")
            );
          });
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      fetchMessages: async (roomID: number, page: number = 1) => {
        set({ loading: true, error: null });
        try {
          const result = await getRoomMessages(roomID, page, 50);
          set({ roomMessageList: result.messages, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      fetchRooms: async () => {
        set({ loading: true, error: null });
        try {
          const rooms = await getUserRooms();
          set({ roomList: rooms, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      createDirectMessage: async (userId: number) => {
        set({ loading: true, error: null });
        try {
          const socket = useUserStore.getState().socket;
          if (!socket) throw new Error("Socket non initialisé");
          socket.emit("create_dm", { targetUserId: userId });
          await new Promise<void>((resolve, reject) => {
            socket.once("dm_created", async (data) => {
              if (data.success) {
                await get().fetchRooms();
                await get().enterRoom(data.roomId);
                resolve();
              } else {
                reject(data.message || "Erreur lors de la création du DM");
              }
            });
            socket.once("error", (err) =>
              reject(err.message || "Erreur socket")
            );
          });
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      createGroupChat: async (name: string, participantIds: number[]) => {
        set({ loading: true, error: null });
        try {
          const socket = useUserStore.getState().socket;
          if (!socket) throw new Error("Socket non initialisé");
          socket.emit("create_group", { name, participantIds });
          await new Promise<void>((resolve, reject) => {
            socket.once("group_created", async (data) => {
              if (data.success) {
                await get().fetchRooms();
                await get().enterRoom(data.roomId);
                resolve();
              } else {
                reject(data.message || "Erreur lors de la création du groupe");
              }
            });
            socket.once("error", (err) =>
              reject(err.message || "Erreur socket")
            );
          });
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      markAsRead: async (messageId: number) => {
        try {
          await markMessageAsRead(messageId);

          // Optionnellement recharger les rooms pour mettre à jour le compteur
          await get().fetchRooms();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    }),
    {
      name: "message-storage",
    }
  )
);
