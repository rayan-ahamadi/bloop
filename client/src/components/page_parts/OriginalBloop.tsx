"use client"

import Image from "next/image";
import { User } from "@/types/user.types";
import { useUserStore } from "@/stores/user.stores";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import ImageIcon from "@/components/icons/image-icon.svg";
import ChatIcon from "@/components/icons/chat.svg";
import HeartIcon from "@/components/icons/heart.svg";
import PaperPlaneIcon from "@/components/icons/paperPlane.svg";
import FloppyIcon from "@/components/icons/floppy.svg";
import React from "react";




const bloopSchema = z.object({
    content: z.string().min(1, "Le contenu ne peut pas être vide"),
    image: z.instanceof(File).optional(),
    parent_post_id: z.number().optional(),
});

type Post = {
    post: {
        id: number;
        user: Partial<User>;
        content: string;
        type: string;
        parentPost: Post | null;
        language: string;
        likesCount: number;
        retweetsCount: number;
        savedCount: number;
        viewsCount: number;
        impressionsCount: number;
        clicksCount: number;
        engagementScore: number;
        isPinned: boolean;
        status: string;
        imageUrl: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        likes: Partial<User>[];
        reposts: Partial<User>[];
        savedPosts: Partial<User>[];
    }
    hasLiked?: boolean;
    hasReposted?: boolean;
    hasSaved?: boolean;
}

type componentsProps = {
    postData: Partial<Post>;
    onReply?: (formData: { content: string; image?: File | null, parent_post_id: number }) => void;
    onLike: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
    onRepost: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
    onSave: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
};

export default function OriginalBloop({ postData, onLike, onRepost, onSave, onReply }: componentsProps) {

    type BloopState = {
        id: number;
        profilePicture: string;
        name: string;
        username: string;
        bloopedAt: string;
        content: string;
        image: string | null;
        likes: number;
        rebloops: number;
        replies: number;
        hasSaved: boolean;
        hasLiked: boolean;
        hasReposted: boolean;
    };

    const [bloopState, setBloopState] = React.useState<BloopState>({
        id: postData?.post?.id || 0,
        profilePicture: "https://localhost:8000" + (postData?.post?.user?.avatarUrl || "/uploads/avatars/user.png"),
        name: postData?.post?.user?.name || "Error User",
        username: postData?.post?.user?.username || "@error_user",
        bloopedAt: postData?.post?.createdAt || new Date().toLocaleString(),
        content: postData?.post?.content || "No content available",
        image: postData?.post?.imageUrl ? "https://localhost:8000" + postData?.post?.imageUrl : null,
        likes: postData?.post?.likesCount || 0,
        rebloops: postData?.post?.retweetsCount || 0,
        replies: postData?.post?.impressionsCount || 0,
        hasSaved: postData?.hasSaved || false,
        hasLiked: postData?.hasLiked || false,
        hasReposted: postData?.hasReposted || false,
    });
    console.log("Bloop State:", bloopState);


    const {
        id,
        profilePicture,
        name,
        username,
        bloopedAt,
        content,
        image,
        likes,
        rebloops,
        replies,
        hasSaved,
        hasLiked,
        hasReposted,
    } = bloopState;

    const form = useForm({
        resolver: zodResolver(bloopSchema),
        defaultValues: {
            content: "",
            image: undefined,
            parent_post_id: id,
        },
    });

    // Calcule le le temps écoulé depuis la publication du bloop. 
    // TODO : mettre dans un fichier utils
    const elapsedTime = (date) => {
        const now = new Date();
        const bloopedDate = new Date(date);
        const diff = now - bloopedDate; // Différence en millisecondes
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days} jour${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} heure${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        }
    };

    const { user, loading } = useUserStore();

    return (
        <div className="flex flex-col gap-4 bg-white w-full">
            <div className="bloopscontent flex flex-row gap-4 items-start p-4">
                <Image
                    src={profilePicture}
                    alt={name + " Avatar"}
                    width={45}
                    height={45}
                    className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto"
                />

                <div className="bloop-user-data flex flex-col gap-2">
                    <div className="user flex flex-row items-center gap-2">
                        <p>
                            <b>
                                {name}
                            </b>
                        </p>
                        <p className="text-secondary-dark/60">
                            @{username}
                        </p>
                        <p className="text-secondary-dark/30 text-sm">
                            {elapsedTime(bloopedAt)}
                        </p>
                    </div>
                    <div className="bloop-content flex flex-col gap-2">
                        <p className="text-3xl break-words">
                            {content}
                        </p>
                        {image && (
                            <Image
                                src={image}
                                alt="Bloop Image"
                                width={500}
                                height={300}
                                className="mt-2 rounded-md shadow-[4px_4px_0_0_black]"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="bloopsstatsbuttons flex flex-row items-center justify-start gap-4 border-y-1 p-4 border-secondary-dark">

                <Dialog>
                    <DialogTrigger className="w-1/3" variant="text">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="font-bold">{rebloops}</span>
                            <span>Rebloops</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Utilisateurs ayant rebloopés</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {postData?.post?.reposts && postData.post.reposts.map((user, index) => (
                                <div key={index} className="flex items-center gap-4 bg-primary p-2 rounded-md mb-2 border-2 border-secondary-dark shadow-[4px_4px_0_0_black]">
                                    <Image
                                        src={"https://localhost:8000" + (user.user_id.avatarUrl || "/uploads/avatars/user.png")}
                                        alt={user.user_id.name || "User Avatar"}
                                        width={45}
                                        height={45}
                                        className="rounded-md border-1 border-secondary-dark"
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-bold text-lg text-secondary-dark">{user.user_id.name || "Unknown User"}</p>
                                        <p className="text-secondary-dark/80">@{user.user_id.username || "unknown_user"}</p>
                                    </div>
                                </div>
                            ))}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger className="w-1/3" variant="text">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="font-bold">{likes}</span>
                            <span>Likes</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Utilisateurs ayant likés</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {postData?.post?.likes && postData.post.likes.map((user, index) => (
                                <div key={index} className="flex items-center gap-4 bg-primary p-2 rounded-md mb-2 border-2 border-secondary-dark shadow-[4px_4px_0_0_black]">
                                    <Image
                                        src={"https://localhost:8000" + (user.user_id.avatarUrl || "/uploads/avatars/user.png")}
                                        alt={user.user_id.name || "User Avatar"}
                                        width={45}
                                        height={45}
                                        className="rounded-md border-1 border-secondary-dark"
                                    />
                                    <div className="flex flex-col">
                                        <p className="font-bold text-lg text-secondary-dark">{user.user_id.name || "Unknown User"}</p>
                                        <p className="text-secondary-dark/80">@{user.user_id.username || "unknown_user"}</p>
                                    </div>
                                </div>
                            ))}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>

                <div className="flex items-center gap-2">
                    <span className="font-bold">
                        {replies}
                    </span>
                    <span>
                        Réponses
                    </span>
                </div>

            </div>
            <div className="bloopsstats flex flex-row items-center justify-center w-full  border-secondary-dark p-4">
                <div className="stats-container border-2  border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] w-[93%] m-auto flex flex-row justify-around items-center gap-6 p-2 ">
                    <span className="flex items-center gap-1">
                        <ChatIcon className="inline-block cursor-pointer hover:fill-accent/90" />
                        {replies}
                    </span>
                    <span className="flex items-center gap-1">
                        <HeartIcon
                            className={"inline-block cursor-pointer hover:fill-accent/90 " + (hasLiked ? "text-accent fill-accent" : "")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onLike(bloopState.id, bloopState, setBloopState);
                            }}
                        />
                        {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <PaperPlaneIcon
                            className={"inline-block cursor-pointer hover:fill-accent/90 " + (hasReposted ? "text-accent fill-accent" : "")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRepost(bloopState.id, bloopState, setBloopState)
                            }
                            }
                        />
                        {rebloops}
                    </span>
                    <span className="flex items-center gap-1">
                        <FloppyIcon
                            className={"inline-block cursor-pointer hover:fill-accent/90 " + (hasSaved === true ? "text-accent fill-accent" : "")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSave(bloopState.id, bloopState, setBloopState)
                            }}
                        />
                    </span>
                </div>
            </div>
            <div className="replyForm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(data => {
                            if (onReply) onReply(data);
                        })
                        }
                        className="inputs flex flex-col items-start gap-2 p-4 border-y-1 border-secondary-dark"
                    >
                        <div className="flex flex-row gap-2 items-start justify-left w-full">
                            <Image
                                src={
                                    "https://localhost:8000" +
                                    (user?.avatarUrl || "/uploads/avatars/user.png")
                                }
                                alt={"Avatar"}
                                width={45}
                                height={45}
                                className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto bg-accent"
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Textarea
                                                placeholder="Quelque chose à dire ?"
                                                {...field}
                                                className="w-full flex-grow-1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row justify-around w-full items-center mt-2">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="image-upload" className="sr-only">
                                            Ajouter une image
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    field.onChange(e.target.files?.[0]);
                                                }}
                                            />
                                        </FormControl>
                                        <ImageIcon
                                            className="cursor-pointer hover:fill-accent/80"
                                            onClick={() => document.getElementById("image-upload")?.click()}
                                        />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="size-fit py-[6px] px-[20px] font-bold text-[16px] ml-auto"
                                disabled={loading}
                            >
                                Répondre
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    );
}