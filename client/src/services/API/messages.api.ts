import axios from "@/services/configs/axios";
import {
  RoomWithLastMessage,
  MessagesPagination,
  CreateRoomRequest,
  CreateRoomResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  AddParticipantsRequest,
  RoomParticipant,
} from "@/types/chat.types";

/**
 * Récupère toutes les rooms de l'utilisateur avec le dernier message et le nombre de messages non lus
 */
export const getUserRooms = async (): Promise<RoomWithLastMessage[]> => {
  try {
    const response = await axios.get("/message/rooms");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des rooms:", error);
    throw error;
  }
};

/**
 * Récupère les messages d'une room avec pagination
 */
export const getRoomMessages = async (
  roomId: number,
  page: number = 1,
  limit: number = 50
): Promise<MessagesPagination> => {
  try {
    const response = await axios.get(`/message/rooms/${roomId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    throw error;
  }
};

/**
 * Crée une nouvelle room (DM ou GROUP)
 */
export const createRoom = async (
  roomData: CreateRoomRequest
): Promise<CreateRoomResponse> => {
  try {
    const response = await axios.post("/message/rooms", roomData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la room:", error);
    throw error;
  }
};

/**
 * Envoie un message dans une room
 */
export const sendMessage = async (
  roomId: number,
  messageData: CreateMessageRequest
): Promise<CreateMessageResponse> => {
  try {
    const response = await axios.post(
      `/message/rooms/${roomId}/messages`,
      messageData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    throw error;
  }
};

/**
 * Ajoute des participants à une room de groupe
 */
export const addParticipants = async (
  roomId: number,
  participantsData: AddParticipantsRequest
): Promise<{ message: string; added_participants: RoomParticipant[] }> => {
  try {
    const response = await axios.post(
      `/message/rooms/${roomId}/participants`,
      participantsData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout des participants:", error);
    throw error;
  }
};

/**
 * Marque un message comme lu
 */
export const markMessageAsRead = async (
  messageId: number
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`/message/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du marquage du message comme lu:", error);
    throw error;
  }
};

/**
 * Crée un DM avec un utilisateur spécifique
 * Helper function qui simplifie la création d'un DM
 */
export const createDM = async (userId: number): Promise<CreateRoomResponse> => {
  return createRoom({
    type: "DM",
    participant_ids: [userId], // L'utilisateur actuel sera ajouté automatiquement côté serveur
  });
};

/**
 * Crée une room de groupe
 * Helper function qui simplifie la création d'un groupe
 */
export const createGroup = async (
  name: string,
  participantIds: number[]
): Promise<CreateRoomResponse> => {
  return createRoom({
    type: "GROUP",
    name,
    participant_ids: participantIds,
  });
};

/**
 * Upload une image pour un message
 */
export const uploadMessageImage = async (
  imageFile: File
): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw error;
  }
};
