import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user.types";

type messageState = {
  displayMessageLayout: boolean;
  roomID: number | null;
  roomIdentifier: string | null;
  roomList: any[];
  roomMessageList: string[];
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
    roomMembers: string[],
    roomMessageList?: string[]
  ) => void;
  enterRoom: (roomName: string) => void;
  leaveRoom: () => void;
  //   sendMessage: (roomID: number, message: string) => Promise<void>;
  fetchMessages: (roomID: number) => Promise<void>;
  fetchRooms: () => Promise<void>;
};

export const useMessageStore = create<messageState>()(
  persist(
    (set) => ({
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
        roomMembers: string[],
        roomMessageList: string[] = []
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
          const roomName = "";
          set({ roomID, roomName, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      leaveRoom: async () => {
        set({ loading: true, error: null });
        try {
          // Logic to leave a room
          set({ roomID: null, roomName: null, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },

      // sendMessage: async (roomID: number, message: string) => {
      //   set({ loading: true, error: null });
      //   try {
      //     // Logic to send a message
      //     set({ loading: false });
      //   } catch (error) {
      //     set({
      //       error: error instanceof Error ? error.message : String(error),
      //       loading: false,
      //     });
      //   }
      // },
      fetchMessages: async (roomID: number) => {
        set({ loading: true, error: null });
        try {
          // Logic to fetch messages for a room
          const messages: string[] = []; // Replace with actual fetch logic
          set({ roomMessageList: messages, loading: false });
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
          // Logic to fetch rooms
          const rooms: any[] = []; // Replace with actual fetch logic
          set({ roomList: rooms, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : String(error),
            loading: false,
          });
        }
      },
    }),
    {
      name: "message-storage",
    }
  )
);
