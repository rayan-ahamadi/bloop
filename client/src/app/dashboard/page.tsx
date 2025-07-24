"use client";

import { useEffect, useState } from "react";
import Bloop from "@/components/page_parts/Bloop";
import BloopPost from "@/components/page_parts/PostBloop";
import { getPosts } from "@/services/API/post.api";
import { useUserStore } from "@/stores/user.stores";
import { useRouter } from "next/navigation";

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

    return (
        <div className="flex flex-col items-center md:w-[55%] w-full md:flex-grow-1 overflow-y-scroll h-screen max-h-[93vh]">
            <BloopPost />
            <div className="bloops w-full md:relative md:-z-50 ">
                {bloops.posts.map((bloop, index) => (
                    <Bloop key={index} bloopContent={bloop} />
                ))}
            </div>
        </div>
    );
}
