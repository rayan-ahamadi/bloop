/**
 * Exemple d'utilisation du système de chat
 * 
 * Ce fichier montre comment utiliser les nouvelles fonctionnalités de chat
 * dans l'application.
 */

import { useMessageStore } from '@/stores/messages.store';
import { useCreateDM } from '@/hooks/useMessage';

// Exemple 1: Afficher le composant de chat dans une page
export function ExampleChatPage() {
    const { setDisplayMessageLayout, displayMessageLayout } = useMessageStore();

    return (
        <div>
            <button onClick={() => setDisplayMessageLayout(!displayMessageLayout)}>
                {displayMessageLayout ? 'Masquer' : 'Afficher'} les messages
            </button>

            {/* Le composant MessagesLayout s'affichera automatiquement 
          si displayMessageLayout est true */}
        </div>
    );
}

// Exemple 2: Créer un DM avec un utilisateur depuis un profil
export function ExampleProfilePage({ userId }: { userId: number }) {
    const { startDMWith } = useCreateDM();

    const handleStartChat = async () => {
        await startDMWith(userId);
        // Le chat s'ouvre automatiquement sur la conversation
    };

    return (
        <div>
            <button onClick={handleStartChat}>
                Envoyer un message
            </button>
        </div>
    );
}

// Exemple 3: Envoyer un message depuis n'importe où
export function ExampleSendMessage({ roomId }: { roomId: number }) {
    const { sendMessage, enterRoom } = useMessageStore();

    const handleQuickMessage = async () => {
        await sendMessage(roomId, "Message rapide!");
        // Optionnellement ouvrir la conversation
        await enterRoom(roomId);
    };

    return (
        <button onClick={handleQuickMessage}>
            Envoyer message rapide
        </button>
    );
}

// Exemple 4: Créer un groupe de chat
export function ExampleCreateGroup() {
    const { createGroupChat } = useMessageStore();

    const handleCreateGroup = async () => {
        const participantIds = [2, 3, 4]; // IDs des utilisateurs à ajouter
        await createGroupChat("Mon groupe de chat", participantIds);
        // Le groupe s'ouvre automatiquement
    };

    return (
        <button onClick={handleCreateGroup}>
            Créer un groupe
        </button>
    );
}

// Exemple 5: Utiliser dans le layout principal de l'app
export function ExampleAppLayout({ children }: { children: React.ReactNode }) {
    // Le hook d'initialisation peut être appelé ici
    // useMessageInit(); // Commenté car le fichier n'est qu'un exemple

    return (
        <div>
            {children}
            {/* MessagesLayout s'affiche automatiquement si displayMessageLayout = true */}
        </div>
    );
}

/**
 * APIs disponibles:
 * 
 * Store Actions:
 * - fetchRooms() : Récupère toutes les conversations
 * - enterRoom(roomId) : Entre dans une conversation
 * - leaveRoom() : Quitte la conversation actuelle
 * - sendMessage(roomId, content, image?) : Envoie un message
 * - createDirectMessage(userId) : Crée un DM
 * - createGroupChat(name, participantIds) : Crée un groupe
 * - markAsRead(messageId) : Marque un message comme lu
 * - setDisplayMessageLayout(boolean) : Affiche/masque le chat
 * 
 * Store State:
 * - roomList : Liste des conversations avec derniers messages
 * - roomID : ID de la conversation actuelle
 * - roomName : Nom de la conversation actuelle  
 * - roomMessageList : Messages de la conversation actuelle
 * - loading : État de chargement
 * - error : Erreur éventuelle
 * 
 * Hooks:
 * - useMessageInit() : Initialise le chat (à appeler dans App)
 * - useCreateDM() : Hook pour créer des DMs facilement
 */
