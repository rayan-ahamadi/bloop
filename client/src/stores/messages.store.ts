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
} from "@/services/API/messages.api";

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
  enterRoom: (roomId: number) => Promise<void>;
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

      enterRoom: async (roomId: number) => {
        set({ loading: true, error: null });
        try {
          // Récupérer les détails de la room à partir de la liste
          const { roomList } = get();
          const roomData = roomList.find((r) => r.room.id === roomId);

          if (roomData) {
            const { room } = roomData;
            let roomName = room.name || "";
            let roomAvatar = "";

            // Pour les DMs, utiliser le nom de l'autre participant
            if (room.type === "DM" && room.participants.length === 2) {
              const otherParticipant = room.participants[0]; // Simplification
              roomName = otherParticipant.user.name;
              roomAvatar = otherParticipant.user.avatarUrl || "";
            }

            set({
              roomID: roomId,
              roomName,
              roomAvatar,
              roomType: room.type,
              roomMembers: room.participants.map((p) => p.user),
              roomIdentifier: room.identifier,
              loading: false,
            });

            // Charger les messages de la room
            await get().fetchMessages(roomId);
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

      sendMessage: async (roomID: number, content: string, image?: string) => {
        set({ loading: true, error: null });
        try {
          const messageData: CreateMessageRequest = { content };
          if (image) messageData.image = image;

          await sendMessage(roomID, messageData);

          // Recharger les messages après envoi
          await get().fetchMessages(roomID);
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
          const response = await createDM(userId);

          // Recharger la liste des rooms
          await get().fetchRooms();

          // Entrer dans la nouvelle room
          await get().enterRoom(response.room.id);

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
          const response = await createGroup(name, participantIds);

          // Recharger la liste des rooms
          await get().fetchRooms();

          // Entrer dans la nouvelle room
          await get().enterRoom(response.room.id);

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
