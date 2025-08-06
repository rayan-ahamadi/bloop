export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface RoomMessage {
  id: number;
  content: string;
  image?: string;
  user: User;
  createdAt: string;
  room_id: number;
}

export interface ClientToServerEvents {
  // Gestion des rooms
  join_room: (data: { roomId: number }) => void;
  leave_room: (data: { roomId: number }) => void;

  // Création de rooms
  create_dm: (data: { targetUserId: number }) => void;
  create_group: (data: { name: string; participantIds: number[] }) => void;

  // Messages
  send_message: (data: {
    roomId: number;
    content: string;
    image?: string;
  }) => void;

  // Indicateurs de frappe
  typing_start: (data: { roomId: number }) => void;
  typing_stop: (data: { roomId: number }) => void;

  // Marquer comme lu
  mark_message_read: (data: { messageId: number }) => void;
}

export interface ServerToClientEvents {
  // Nouveaux messages
  new_message: (data: { message: RoomMessage; roomId: number }) => void;

  // Confirmations
  message_sent: (data: {
    success: boolean;
    message?: RoomMessage;
    error?: string;
  }) => void;

  // Création de rooms
  dm_created: (data: {
    success: boolean;
    room: any;
    roomId: number;
    roomIdentifier: string;
  }) => void;

  group_created: (data: {
    success: boolean;
    room: any;
    roomId: number;
    roomIdentifier: string;
  }) => void;

  // Notifications
  new_room_added: (data: {
    roomId: number;
    roomIdentifier: string;
    message: string;
  }) => void;

  // Gestion des rooms
  user_joined_room: (data: { user: User; roomId: number }) => void;
  user_left_room: (data: { userId: number; roomId: number }) => void;

  // Indicateurs de frappe
  user_typing: (data: { user: User; roomId: number }) => void;
  user_stopped_typing: (data: { userId: number; roomId: number }) => void;

  // Messages lus
  message_read: (data: { messageId: number; userId: number }) => void;

  // Erreurs
  error: (data: { message: string; code?: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: User;
  rooms: Set<number>; // Set des IDs de rooms
  roomIdentifiers: Map<number, string>; // Mapping roomId -> identifier
}
