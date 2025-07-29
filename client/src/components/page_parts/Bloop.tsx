"use client"

import React from "react";
import Image from "next/image";
import ChatIcon from "@/components/icons/chat.svg";
import HeartIcon from "@/components/icons/heart.svg";
import PaperPlaneIcon from "@/components/icons/paperPlane.svg";
import FloppyIcon from "@/components/icons/floppy.svg";
import { User } from "@/types/user.types";
import BloopDropdown from "./BloopDropdown";



// Bloop = l'équivalent d'un tweet sur Twitter.
/**
 * Bloop component.
 *
 * @param props - The props for the Bloop component.
 * @param props.bloopContent - The content to be displayed in the Bloop component.
 */

interface BloopContent {
    post: {
        id?: number;
        type?: string;
        user?: Partial<User>;
        createdAt?: string | Date;
        content?: string;
        imageUrl?: string;
        replies?: number;
        likesCount?: number;
        retweetsCount?: number;
        repliesCount?: number;
        isPinned?: boolean;
        profilePicture?: string;
        hasLiked?: boolean;
        hasReposted?: boolean;
        hasSaved?: boolean;
        parentPost?: BloopContent | null; // Pour les reposts, si c'est un repost, il peut avoir un parent post
    };
    hasLiked?: boolean;
    hasReposted?: boolean;
    hasSaved?: boolean;
}

interface BloopProps {
    bloopContent: BloopContent;
    onLike: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
    onRepost: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
    onSave: (postId: number, bloopState: any, setBloopState: (state: any) => void) => void;
    onDelete: (bloopId: number) => void;
}

export default function Bloop(
    {
        bloopContent,
        onLike,
        onRepost,
        onSave,
        onDelete
    }: BloopProps,
) {
    const user = bloopContent?.post?.user || {};

    const [bloopState, setBloopState] = React.useState({
        id: bloopContent?.post?.id || 0,
        profilePicture: "https://localhost:8000" + (user.avatarUrl || "/uploads/avatars/user.png"),
        name: user.name || "Error User",
        username: user.username || "@error_user",
        bloopedAt: bloopContent?.post?.createdAt || new Date().toLocaleString(),
        content: bloopContent?.post?.content || "No content available",
        image: bloopContent?.post?.imageUrl ? "https://localhost:8000" + bloopContent?.post?.imageUrl : null,
        likes: bloopContent?.post?.likesCount || 0,
        rebloops: bloopContent?.post?.retweetsCount || 0,
        replies: bloopContent?.post?.repliesCount || 0,
        saved: bloopContent?.hasSaved || false,
        hasLiked: bloopContent?.hasLiked || false,
        hasReposted: bloopContent?.hasReposted || false,
        type: bloopContent?.post?.type || "text",
        parentPostUser: bloopContent?.post?.parentPost?.user.username || "Unknown",
    });

    const {
        profilePicture,
        name,
        username,
        bloopedAt,
        content,
        image,
        likes,
        rebloops,
        replies,
        saved,
        hasLiked,
        hasReposted,
        type,
        parentPostUser
    } = bloopState;

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


    return (
        <div className="flex flex-col p-4 bg-secondary cursor-pointer hover:bg-secondary/30 shadow-md w-full ">
            {type === "reply" && (
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-secondary-dark/60 text-sm">
                        En réponse à <b>@{parentPostUser}</b>
                    </span>
                </div>
            )}
            <div className="bloopscontent flex flex-row gap-4 items-start">
                <Image
                    src={profilePicture}
                    alt={name + " Avatar"}
                    width={45}
                    height={45}
                    className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto"
                />



                <div className="bloop-user-data flex flex-col gap-2">
                    <div className="user flex flex-row items-center gap-2 w-full">
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
                        <p className="text-lg">
                            {content}
                        </p>
                        {image && (
                            <Image
                                src={image}
                                alt="Bloop Image"
                                width={500}
                                height={300}
                                className="border-2 border-secondary-dark mt-2 rounded-md shadow-[4px_4px_0_0_black]"
                            />
                        )}
                    </div>
                </div>

                <div className="ml-auto float-right">
                    <BloopDropdown
                        bloopUser={bloopContent?.post?.user || {}}
                        bloopId={bloopState.id}
                        originalBloop={true}
                        onDelete={(bloopId) => {
                            onDelete(bloopId);
                        }}
                        onReport={(bloopId) => {
                            console.log("Report bloop with ID:", bloopId);
                        }}
                    />
                </div>


            </div>
            <div className="bloopsstats flex flex-row items-center justify-end-safe">
                <div className="stats-container border-2 border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] flex flex-row items-center gap-6 p-2 mt-2">
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
                            className={"inline-block cursor-pointer hover:fill-accent/90 " + (saved ? "text-accent fill-accent" : "")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSave(bloopState.id, bloopState, setBloopState)
                            }}
                        />
                    </span>
                </div>
            </div>
        </div>
    )
}