"use client"

import { useMessageStore } from "@/stores/messages.store"
import { useEffect } from "react";
import ArrowLeft from "@/components/icons/arrow-left.svg"
import Close from "@/components/icons/close.svg"
import ImageIcon from "@/components/icons/image-icon.svg"
import PaperPlane from "@/components/icons/paperPlane.svg"
import Image from "next/image"
import Room from "./Room"
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { constrainedMemory } from "process";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user.stores";

const schema = z.object({
    message: z.string().min(1, { message: "Le message ne peut pas être vide" }),
    image: z
        .instanceof(File)
        .optional()
        .refine(file => !file || file.size <= 2 * 1024 * 1024, {
            message: "L'image doit faire moins de 2 Mo",
        }),
});



// Composants pour les messages en desktop
import { useRef, useState } from "react";

export default function MessageLayout() {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
            image: undefined,
        },
    });

    const { socket } = useUserStore();

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
        fetchRooms,
        sendMessage,
        fetchMessages
    } = useMessageStore();

    // Pour gérer l'image uploadée et le preview
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Charger les rooms au montage du composant
    useEffect(() => {
        if (roomList.length === 0) {
            fetchRooms();
        }
    }, [fetchRooms, roomList.length]);

    // Gestion du changement d'image
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Soumission du formulaire d'envoi de message
    const onSubmit = async (values: z.infer<typeof schema>) => {
        if (!roomID) return;
        try {
            await sendMessage(roomID, values.message, values.image);
            form.reset();
            setPreviewImage(null);
        } catch (err) {
            // Optionnel: gestion d'erreur UI
        }
    };

    useEffect(() => {
        if (!socket) return;

        // Handler pour l'event "new_message"
        const handleNewMessage = (data) => {
            console.log("Nouveau message reçu:", data);
            const messageData = data.message.data
            // const messageDataUser = data.user;
            if (data.roomId === roomID) {
                // Ajoute le message à la liste courante
                useMessageStore.setState((state) => ({
                    roomMessageList: [...state.roomMessageList, messageData],
                }));
            } else {
                // Optionnel: afficher une notification ou mettre à jour la liste des rooms
                toast.success("Nouveau message : " + data.message.content);
            }
        };

        socket.on("new_message", handleNewMessage);

        // Nettoyage à l'unmount
        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, roomID]);

    useEffect(() => {
        if (roomID) {
            fetchMessages(roomID);
        }
        // Nettoyage à l'unmount
        return () => {
            useMessageStore.setState({ roomMessageList: [] });
        };
    }, [roomID, fetchMessages]);

    // useEffect(() => {
    //     if (!socket) return;

    //     const handleTypingStart = (data) => {
    //         console.log("Typing start:", data);
    //         // Handle typing start logic here
    //     };

    //     const handleTypingStop = (data) => {
    //         console.log("Typing stop:", data);
    //         // Handle typing stop logic here
    //     };

    //     socket.on("typing_start", handleTypingStart);
    //     socket.on("typing_stop", handleTypingStop);

    //     return () => {
    //         socket.off("typing_start", handleTypingStart);
    //         socket.off("typing_stop", handleTypingStop);
    //         socket.off("mark_message_read", handleMarkRead);
    //     };
    // }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const handleMarkRead = async () => {
            if (roomID) {
                for (const message of roomMessageList) {
                    if (!message.read) {
                        const success = await socket.emit("mark_message_read", { messageId: message.id });
                        if (success) {
                            useMessageStore.setState((state) => ({
                                roomMessageList: state.roomMessageList.map((msg) =>
                                    msg.id === message.id ? { ...msg, read: true } : msg
                                ),
                                roomList: state.roomList.map((room) =>
                                    room.room.id === roomID
                                        ? {
                                            ...room,
                                            unreadCount: room.unreadCount > 0 ? room.unreadCount - 1 : 0,
                                        }
                                        : room
                                ),
                            }));
                        } else {
                            console.error("Failed to mark message as read:", message.id);
                        }
                    }
                }
            }
        };

        handleMarkRead();
        // Nettoyage à l'unmount
        return () => {
            socket.off("mark_message_read", handleMarkRead);
        };
    }, [roomID]);

    return (
        <div className="none md:fixed right-10 bottom-5 border-2 border-secondary-dark bg-secondary rounded-md h-[48vh] max-h-[48vh] w-[25vw] shadow-[4px_4px_0_0_black]">
            <div className="layout-header bg-primary py-4 px-2 rounded-t-md border-b-3 border-secondary-dark flex items-center justify-between">
                <div className="content">
                    {roomName || roomID ? (
                        <div className="flex items-center">
                            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => leaveRoom()} />
                            {roomAvatar && (
                                <Image
                                    src={"https://localhost:8000" + roomAvatar + `?${new Date().getTime()}`}
                                    alt="Room Avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-md border-2 border-secondary-dark ml-2"
                                />
                            )}
                            <p className="font-bold text-2xl ml-2">
                                {roomName}
                            </p>
                        </div>
                    ) : (
                        <span className="font-bold text-2xl">Messages</span>
                    )}
                </div>
                <div className="close">
                    <Close className="w-6 h-6 cursor-pointer" onClick={() => setDisplayMessageLayout(false)} />
                </div>
            </div>

            <div className="layout-content overflow-y-scroll flex flex-col justify-between h-[85%]">
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
                    <div className="no-messages p-4 text-center text-gray-500 flex-grow-1">
                        Aucun message dans cette conversation.
                    </div>
                )}

                {!loading && !error && !roomID && roomList.length === 0 && (
                    <div className="no-rooms p-4 text-center text-gray-500 flex-grow-1">
                        Aucune conversation trouvée.
                    </div>
                )}

                {/* Affichage des messages */}
                {roomID && roomMessageList.length > 0 && (
                    <div className="messages-list p-4 space-y-4 flex-grow-1 overflow-y-auto">
                        {roomMessageList.map((message) => (
                            <div key={message.id} className="message-item">
                                <div className={"flex items-center" + (message.user.id === useUserStore.getState().user?.id ? " justify-end" : "justify-start")}>
                                    <div className={"flex flex-col rounded-md shadow-[4px_4px_0_0_black] border-2 border-secondary-dark " + (message.user.id === useUserStore.getState().user?.id ? " bg-accent rounded-br-none" : " bg-primary rounded-bl-none")}>
                                        <div className="py-2 px-4 h-auto w-auto">
                                            <span className="text-[20px] font-medium">
                                                {message?.content}
                                            </span>
                                        </div>
                                        {message?.image && (
                                            <div className="message-image border-t-3 border-secondary-dark">
                                                <Image
                                                    src={"https://localhost:8000" + message?.image + `?${new Date().getTime()}`}
                                                    alt="Message image"
                                                    width={200}
                                                    height={150}
                                                    className=""
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* <Image
                                        src={"https://localhost:8000" + message?.user.avatarUrl}
                                        alt={message?.user.name}
                                        width={32}
                                        height={32}
                                        className="rounded-md border-2 border-secondary-dark"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{message?.user.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(message?.sentAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-1">{message?.content}</p>
                                        {message?.image && (
                                            <Image
                                                src={message?.image}
                                                alt="Message image"
                                                width={200}
                                                height={150}
                                                className="mt-2 rounded border border-secondary-dark"
                                            />
                                        )}
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Affichage de l'input d'envoi de message */}
                {roomID && (
                    <div className="message-input p-2 border-t-2 border-secondary-dark gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="imageplaceholder">
                                    {previewImage && (
                                        <div className="relative">
                                            <Image
                                                src={previewImage + `?${new Date().getTime()}`}
                                                alt="Preview"
                                                width={200}
                                                height={150}
                                                className="rounded border border-secondary-dark"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    form.setValue('image', null);
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-around gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <ImageIcon
                                        className="h-6 cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Écrire un message..."
                                                        className="w-full"
                                                        rows={2}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="submit"
                                        className="send-button text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
                                        disabled={form.formState.isSubmitting}
                                    >
                                        <PaperPlane className="h-6" />
                                    </button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}

                {/* Affichage de la liste des conversations */}
                {
                    !roomID && roomList.length > 0 && (
                        <div className="rooms-list">
                            {roomList.map((room) => (
                                <Room roomData={room} key={room.room.id} />
                            ))}
                        </div>
                    )
                }
            </div >
        </div >
    )
}