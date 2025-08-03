import { User } from "./user.types";

export interface ChatRoom {
  id: number;
  type: "DM" | "GROUP";
  identifier: string;
  name?: string;
  createdAt: string;
  participants: RoomParticipant[];
}

export interface RoomParticipant {
  user: User;
  joinedAt: string;
}

export interface RoomMessage {
  id: number;
  content: string;
  image?: string;
  sentAt: string;
  user: User;
}

export interface RoomWithLastMessage {
  room: ChatRoom;
  last_message?: RoomMessage;
  unread_count: number;
}

export interface MessagesPagination {
  messages: RoomMessage[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateRoomRequest {
  type: "DM" | "GROUP";
  name?: string;
  participant_ids: number[];
}

export interface CreateMessageRequest {
  content: string;
  image?: string;
}

export interface AddParticipantsRequest {
  user_ids: number[];
}

export interface CreateRoomResponse {
  message: string;
  room: ChatRoom;
}

export interface CreateMessageResponse {
  message: string;
  data: RoomMessage;
}
