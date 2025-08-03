import { useEffect } from "react";
import { useMessageStore } from "@/stores/messages.store";
import { useUserStore } from "@/stores/user.stores";

/**
 * Hook pour initialiser le système de messages
 * À utiliser dans les composants principaux de l'application
 */
export const useMessageInit = () => {
  const { fetchRooms, displayMessageLayout } = useMessageStore();
  const { user } = useUserStore();

  useEffect(() => {
    // Charger les rooms seulement si l'utilisateur est connecté
    if (user && displayMessageLayout) {
      fetchRooms();
    }
  }, [user, displayMessageLayout, fetchRooms]);

  return {
    // Peut retourner des utilitaires si nécessaire
  };
};

/**
 * Hook pour créer rapidement un DM avec un utilisateur
 */
export const useCreateDM = () => {
  const { createDirectMessage, setDisplayMessageLayout } = useMessageStore();

  const startDMWith = async (userId: number) => {
    try {
      setDisplayMessageLayout(true); // S'assurer que le layout est visible
      await createDirectMessage(userId);
    } catch (error) {
      console.error("Erreur lors de la création du DM:", error);
    }
  };

  return { startDMWith };
};
