"use client";

import { useEffect, useState } from "react";
import Bloop from "@/components/page_parts/Bloop";
import BloopPost from "@/components/page_parts/PostBloop";
import { getPosts } from "@/services/API/post.api";
import { useUserStore } from "@/stores/user.stores";
import { usePostStore } from "@/stores/post.stores";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";


type Pagination = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Post = {
    posts: any[];
    pagination: Pagination;
};

export default function DashboardHome() {
    const [hasHydrated, setHasHydrated] = useState(false);
    const router = useRouter();
    const { user, getProfile } = useUserStore();
    const { toggleLike, repost, savePost, deleteRepost } = usePostStore();
    const [bloops, setBloops] = useState<Post>({
        posts: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false,
        },
    });


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getPosts();

                // if (!res.error && res.status !== 200) {
                //     throw new Error("Erreur lors du chargement des posts");
                // }

                setBloops(res);
            } catch (err) {
                console.error("Erreur dans getPosts:", err);
            }
        };

        fetchPosts();
    }, []);

    // Vérifier le token JWT en localStorage via la route /users/me
    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                await getProfile();
            } catch (error) {
                console.error("Erreur lors de la récupération du profil utilisateur:", error);
                router.push("/");
            }
        };

        checkUserProfile();
    }, []);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    // TODO : Faire un écran de chargement
    if (!hasHydrated) return null;

    // TODO : Remplacer par une modal qui propose à l'utilisateur de se connecter ou de s'inscrire
    // Et afficher le dashboard en mode visiteur
    if (!user) {
        router.push("/");
        return null;
    }

    const handleLike = async (
        postId: number,
        bloopState: { hasLiked: boolean;[key: string]: any },
        setBloopState: (state: any) => void
    ) => {
        try {
            await toggleLike(postId);
            setBloopState({ ...bloopState, hasLiked: !bloopState.hasLiked, likes: bloopState.hasLiked ? bloopState.likes - 1 : bloopState.likes + 1 });
            console.log("Post liked/unliked successfully");
            // Mettre à jour l'état local si nécessaire
        } catch (error) {
            console.error("Erreur lors du like du post:", error);
            toast.error("Erreur lors du like du post", {
                id: "bloop-list-toaster"
            });
        }
    };

    const handleRepost = async (
        postId: number,
        bloopState: { hasReposted: boolean;[key: string]: any },
        setBloopState: (state: any) => void
    ) => {
        try {
            if (bloopState.hasReposted) {
                await deleteRepost(postId);
            } else {
                await repost(postId);
            }
            setBloopState({ ...bloopState, hasReposted: !bloopState.hasReposted, rebloops: bloopState.hasReposted ? bloopState.rebloops - 1 : bloopState.rebloops + 1 });
            console.log("Post reposted successfully");
            // Mettre à jour l'état local si nécessaire
        } catch (error) {
            console.error("Erreur lors du repost du post:", error);
            toast.error("Erreur lors du repost du post", {
                id: "bloop-list-toaster"
            });
        }
    };

    const handleSave = async (
        postId: number,
        bloopState: { hasSaved: boolean;[key: string]: any },
        setBloopState: (state: any) => void
    ) => {
        try {
            await savePost(postId);
            setBloopState({ ...bloopState, saved: !bloopState.hasSaved });
            toast.success("Bloop enregistré dans vos signets.", {
                id: "bloop-list-toaster"
            });
            console.log("Post saved successfully");
            // Mettre à jour l'état local si nécessaire
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du post:", error);
            toast.error("Erreur lors de la sauvegarde du post", {
                id: "bloop-list-toaster"
            });
        }
    };





    return (
        <div className="flex flex-col items-center md:w-[55%] w-full md:flex-grow-1 overflow-y-scroll h-screen max-h-[93vh] z-50">
            <BloopPost />
            <div className="bloops w-full md:relative md:-z-50 ">
                {bloops.posts.map((bloop, index) => (
                    <Link href={`/bloop/${bloop.post.id}`} key={index} className="relative block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                        <Bloop key={index} bloopContent={bloop} onLike={handleLike} onRepost={handleRepost} onSave={handleSave} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
