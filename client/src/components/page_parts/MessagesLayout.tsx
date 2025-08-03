"use client"

import { useMessageStore } from "@/stores/messages.store"
import { useEffect } from "react";
import ArrowLeft from "@/components/icons/arrow-left.svg"
import Close from "@/components/icons/close.svg"
import Image from "next/image"
import Room from "./Room"

// Composants pour les messages en desktop
export default function MessageLayout() {
    const {
        roomID,
        roomName,
        roomAvatar,
        roomMessageList,
        roomList,
        loading,
        error,
        setDisplayMessageLayout,
        leaveRoom,
        fetchRooms
    } = useMessageStore();

    // Charger les rooms au montage du composant
    useEffect(() => {
        if (roomList.length === 0) {
            fetchRooms();
        }
    }, [fetchRooms, roomList.length]);

    return (
        <div className="none md:fixed right-10 bottom-5 border-2 border-secondary-dark bg-secondary rounded-md h-[48vh] max-h-[48vh] w-[25vw] shadow-[4px_4px_0_0_black]">
            <div className="layout-header bg-primary py-4 px-2 rounded-t-md border-b-3 border-secondary-dark flex items-center justify-between">
                <div className="content">
                    {roomName || roomID ? (
                        <div className="flex items-center">
                            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => leaveRoom()} />
                            {roomAvatar && (
                                <Image
                                    src={roomAvatar}
                                    alt="Room Avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full border-2 border-secondary-dark ml-2"
                                />
                            )}
                            <span className="font-bold text-2xl ml-2">{roomName}</span>
                        </div>
                    ) : (
                        <span className="font-bold text-2xl">Messages</span>
                    )}
                </div>
                <div className="close">
                    <Close className="w-6 h-6 cursor-pointer" onClick={() => setDisplayMessageLayout(false)} />
                </div>
            </div>

            <div className="layout-content overflow-y-scroll h-full">
                {loading && (
                    <div className="loading p-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2">Chargement...</p>
                    </div>
                )}

                {error && (
                    <div className="error p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        Erreur: {error}
                    </div>
                )}

                {!loading && !error && roomID && roomMessageList.length === 0 && (
                    <div className="no-messages p-4 text-center text-gray-500">
                        Aucun message dans cette conversation.
                    </div>
                )}

                {!loading && !error && !roomID && roomList.length === 0 && (
                    <div className="no-rooms p-4 text-center text-gray-500">
                        Aucune conversation trouvée.
                    </div>
                )}

                {/* Affichage des messages */}
                {roomID && roomMessageList.length > 0 && (
                    <div className="messages-list p-4 space-y-4">
                        {roomMessageList.map((message) => (
                            <div key={message.id} className="message-item">
                                <div className="flex items-start space-x-3">
                                    <Image
                                        src={message.user.avatarUrl || '/default-avatar.png'}
                                        alt={message.user.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full border border-secondary-dark"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{message.user.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(message.sentAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-1">{message.content}</p>
                                        {message.image && (
                                            <Image
                                                src={message.image}
                                                alt="Message image"
                                                width={200}
                                                height={150}
                                                className="mt-2 rounded border border-secondary-dark"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Affichage de la liste des conversations */}
                {!roomID && roomList.length > 0 && (
                    <div className="rooms-list">
                        {roomList.map((room) => (
                            <Room roomData={room} key={room.room.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}