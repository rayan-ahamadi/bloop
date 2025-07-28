
import Image from "next/image";
import React from "react";
import { User } from "@/types/user.types";
import ChatIcon from "@/components/icons/chat.svg";
import HeartIcon from "@/components/icons/heart.svg";
import PaperPlaneIcon from "@/components/icons/paperPlane.svg";
import FloppyIcon from "@/components/icons/floppy.svg";
import BloopDropdown from "./BloopDropdown";



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
        repliesCount: number;
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

type ancestorBloopProps = {
    postData: Partial<Post>;
    onLike: (postId: number) => void;
    onRepost: (postId: number) => void;
    onSave: (postId: number) => void;
    onDelete: (bloopId: number) => void;
}

export default function AncestorBloop({ postData, onLike, onRepost, onSave, onDelete }: ancestorBloopProps) {

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
        replies: postData?.post?.repliesCount || 0,
        hasSaved: postData?.hasSaved || false,
        hasLiked: postData?.hasLiked || false,
        hasReposted: postData?.hasReposted || false,
    });

    // Mettre à jour l'état du bloop    
    React.useEffect(() => {
        setBloopState({
            id: postData?.post?.id || 0,
            profilePicture: "https://localhost:8000" + (postData?.post?.user?.avatarUrl || "/uploads/avatars/user.png"),
            name: postData?.post?.user?.name || "Error User",
            username: postData?.post?.user?.username || "@error_user",
            bloopedAt: postData?.post?.createdAt || new Date().toLocaleString(),
            content: postData?.post?.content || "No content available",
            image: postData?.post?.imageUrl ? "https://localhost:8000" + postData?.post?.imageUrl : null,
            likes: postData?.post?.likesCount || 0,
            rebloops: postData?.post?.retweetsCount || 0,
            replies: postData?.post?.repliesCount || 0,
            hasSaved: postData?.hasSaved || false,
            hasLiked: postData?.hasLiked || false,
            hasReposted: postData?.hasReposted || false,
        });
    }, [postData]);

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
        hasSaved,
        hasLiked,
        hasReposted
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
        <div className="ancestor-bloop flex flex-col bg-secondary p-4 w-full ">
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

                <div className="ml-auto float-right">
                    <BloopDropdown
                        bloopUser={postData?.post?.user || {}}
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
                                onLike(bloopState.id);
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
                                onRepost(bloopState.id)
                            }
                            }
                        />
                        {rebloops}
                    </span>
                    <span className="flex items-center gap-1">
                        <FloppyIcon
                            className={"inline-block cursor-pointer hover:fill-accent/90 " + (hasSaved ? "text-accent fill-accent" : "")}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSave(bloopState.id)
                            }}
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}