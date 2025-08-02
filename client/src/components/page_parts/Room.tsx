import { User } from "@/types/user.types";
import { useMessageStore } from "@/stores/messages.store";
import { useUserStore } from "@/stores/user.stores";
import Image from "next/image";

type RoomProps = {
    roomData: {
        id: number;
        name: string;
        avatarUrl: string;
        type: string;
        user: User | null;
        lastMessage?: string;
        lastMessageSender?: User | null;
        sendAt?: string;
        read?: boolean;
    };
};

export default function Room({ roomData }: RoomProps) {
    const {
        enterRoom,
    } = useMessageStore();
    const { user } = useUserStore();

    const handleEnterRoom = () => {
        enterRoom(roomData.name);
    };

    return (
        <div className="w-full border-2 border-secondary-dark hover:bg-secondary-dark/20 p-4 cursor-pointer" onClick={handleEnterRoom}>
            <div className="flex items-start gap-2">
                {roomData.type === "group" ? (
                    <Image
                        src={roomData.avatarUrl}
                        alt={`${roomData.name} Avatar`}
                        width={40}
                        height={40}
                        className=" rounded-full border-2 border-secondary-dark"
                    />
                ) : (
                    <Image
                        src={roomData?.user?.avatarUrl || "/default-avatar.png"}
                        alt={`${roomData?.user?.name} Avatar`}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-secondary-dark"
                    />
                )}

                <div className="flex flex-col items-start">
                    {roomData.type === "group" ? (
                        <p className="font-bold">{roomData.name} • {roomData.sendAt}</p>

                    ) : (
                        <p>
                            <span className="font-bold">{roomData?.user?.name} </span>
                            <span className="font-medium text-secondary-dark/70">@{roomData?.user?.username}</span>
                            <span className="text-secondary-dark/70"> • {roomData.sendAt}</span>
                        </p>
                    )}

                    <p className="text-secondary-dark/70 {roomData.read ? 'font-normal' : 'font-bold'}">
                        {roomData.type === "group" ? `${roomData.lastMessageSender?.name || "Quelqu'un"}: ` : ""}
                        {roomData.lastMessage || "Aucun message"}
                    </p>
                </div>
            </div>
        </div>
    )
}