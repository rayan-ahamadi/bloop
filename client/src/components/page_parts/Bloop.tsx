"use client"

import React from "react";
import Image from "next/image";
import ChatIcon from "@/components/icons/chat.svg";
import HeartIcon from "@/components/icons/heart.svg";
import PaperPlaneIcon from "@/components/icons/paperPlane.svg";
import FloppyIcon from "@/components/icons/floppy.svg";
import { User } from "@/types/user.types";


// Bloop = l'équivalent d'un tweet sur Twitter.
/**
 * Bloop component.
 *
 * @param props - The props for the Bloop component.
 * @param props.bloopContent - The content to be displayed in the Bloop component.
 */

interface BloopContent {
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
}

interface BloopProps {
    bloopContent: BloopContent;
}

export default function Bloop({ bloopContent }: BloopProps) {
    const user = bloopContent?.user || {};

    const profilePicture = "https://localhost:8000" + (user.avatarUrl || "/uploads/avatars/user.png");
    const name = user.name || "Error User";
    const username = user.username || "@error_user";
    const bloopedAt = bloopContent?.createdAt || new Date().toLocaleString();
    const content = bloopContent?.content || "No content available";
    const image = bloopContent?.imageUrl ? "https://localhost:8000" + bloopContent?.imageUrl : null;
    const likes = bloopContent?.likesCount || 0;
    const rebloops = bloopContent?.retweetsCount || 0;
    const saved = bloopContent?.isPinned || false;
    const replies = bloopContent?.repliesCount || 0;

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
        <div className="flex flex-col p-4 bg-secondary shadow-md w-full border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
            <div className="bloopscontent flex flex-row gap-4 items-start">
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
                        <p className="text-lg">
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
            <div className="bloopsstats flex flex-row items-center justify-end-safe">
                <div className="stats-container border-2 border-secondary-dark bg-primary rounded-md shadow-[4px_4px_0_0_black] flex flex-row items-center gap-6 p-2 mt-2">
                    <span className="flex items-center gap-1">
                        <ChatIcon className="inline-block cursor-pointer hover:fill-accent/80" />
                        {replies}
                    </span>
                    <span className="flex items-center gap-1">
                        <HeartIcon className="inline-block cursor-pointer hover:fill-accent/80" />
                        {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <PaperPlaneIcon className="inline-block cursor-pointer hover:fill-accent/80" />
                        {rebloops}
                    </span>
                    <span className="flex items-center gap-1">
                        <FloppyIcon className={"inline-block cursor-pointer hover:fill-accent/80 " + (saved ? "text-accent fill-accent" : "")} />
                    </span>
                </div>
            </div>
        </div>
    )
}