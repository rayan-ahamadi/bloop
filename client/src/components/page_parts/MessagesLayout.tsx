"use client"

import { useMessageStore } from "@/stores/messages.store"
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
        leaveRoom
    } = useMessageStore();

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
                            <span className="font-bold text-2xl">{roomName}</span>
                        </div>
                    ) : (
                        <span className="font-bold text-2xl">Messages</span>
                    )}
                </div>
                <div className="close">
                    <Close className="w-6 h-6 cursor-pointer" onClick={() => setDisplayMessageLayout(false)} />
                </div>
            </div>

            <div className="layout-content overflow-y-scroll">
                {loading && <div className="loading">Chargement...</div>}
                {error && <div className="error">Erreur: {error}</div>}
                {!loading && !error && roomID && roomMessageList.length === 0 && (
                    <div className="no-messages p-4">Aucun message dans cette conversation.</div>
                )}

                {!loading && !error && !roomID && roomList.length === 0 && (
                    <div className="no-rooms p-4">Aucune conversation trouvée.</div>
                )}

                {/* Affichage des messages ou de la liste des conversations */}
                {roomID && roomMessageList.length > 0 && (
                    <div className="messages-list">
                        {roomMessageList.map((message, index) => (
                            <div key={index} className="message-item">
                                {message}
                            </div>
                        ))}
                    </div>
                )}

                {!roomID && roomList.length > 0 && (
                    <div className="rooms-list">
                        {roomList.map((room, index) => (
                            <Room roomData={room} key={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}