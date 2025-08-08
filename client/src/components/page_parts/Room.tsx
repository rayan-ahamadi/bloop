import { RoomWithLastMessage } from "@/types/chat.types";
import { useMessageStore } from "@/stores/messages.store";
import { useUserStore } from "@/stores/user.stores";
import Image from "next/image";

type RoomProps = {
    roomData: RoomWithLastMessage;
};

export default function Room({ roomData }: RoomProps) {
    const { enterRoom } = useMessageStore();
    const { user: currentUser } = useUserStore();

    // Déterminer le nom et l'avatar à afficher
    const getRoomDisplay = () => {
        const { room } = roomData;

        if (room.type === 'DM') {
            // Pour un DM, afficher l'autre participant
            const otherParticipant = room.participants.find(
                p => p.user.id !== currentUser?.id
            );

            return {
                name: otherParticipant?.user.name || 'Utilisateur inconnu',
                avatarUrl: otherParticipant?.user.avatarUrl || '/default-avatar.png'
            };
        } else {
            // Pour un groupe, utiliser le nom de la room
            return {
                name: room.name || 'Groupe sans nom',
                avatarUrl: '/default-group-avatar.png'
            };
        }
    };

    const handleRoomClick = () => {
        console.log("Room clicked:", roomData.room);
        enterRoom(roomData.room.identifier);
    };

    const { name, avatarUrl } = getRoomDisplay();
    const { last_message, unread_count } = roomData;

    const formatLastMessageTime = (dateString?: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit'
            });
        }
    };

    return (
        <div
            className="room-item p-3 border-b-2 border-secondary-dark cursor-pointer hover:bg-secondary-light transition-colors"
            onClick={handleRoomClick}
        >
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Image
                        src={"https://localhost:8000" + avatarUrl + `?${new Date().getTime()}`}
                        alt={name}
                        width={33}
                        height={33}
                        className="rounded-md border-2 border-secondary-dark"
                    />
                    {unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unread_count > 9 ? '9+' : unread_count}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg truncate">{name}</h3>
                        {last_message && (
                            <span className="text-sm text-gray-500">
                                {formatLastMessageTime(last_message.sentAt)}
                            </span>
                        )}
                    </div>

                    {last_message && (
                        <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600 font-medium">
                                {last_message.user.name}:
                            </span>
                            <p className="text-sm text-gray-600 truncate">
                                {last_message.image ? '📷 Image' : last_message.content}
                            </p>
                        </div>
                    )}

                    {!last_message && (
                        <p className="text-sm text-gray-500 italic">
                            Aucun message
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}