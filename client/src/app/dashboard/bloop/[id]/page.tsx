"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user.stores';
import { usePostStore } from '@/stores/post.stores';
import PostDetailsLayout from '@/components/page_parts/PostDetailsLayout';




export default function BloopDetail() {
    const [hasHydrated, setHasHydrated] = useState(false);
    const router = useRouter();
    const { user, getProfile } = useUserStore();
    const { fetchPost, loading } = usePostStore();
    const [postData, setPostData] = useState<any>(null);
    const { id } = useParams();

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

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                if (!id) {
                    router.push('/dashboard');
                    return;
                }

                const post = await fetchPost(Number(id), 1); // On récupère le post avec la page 1 pour les réponses
                setPostData(post);
            } catch (error) {
                console.error("Erreur dans fetchPostDetails:", error);
                router.push('/dashboard');
            }
        };

        fetchPostDetails();
    }, [id]);

    // Fonction pour mettre à jour les données du post (like, save, repost)
    const updatePostData = (updatedData: typeof postData) => {
        setPostData(updatedData);
    };

    // TODO : Faire un écran de chargement
    if (!hasHydrated) return null;

    // TODO : Remplacer par une modal qui propose à l'utilisateur de se connecter ou de s'inscrire
    // Et afficher le dashboard en mode visiteur
    if (!user) {
        router.push("/");
        return null;
    }

    if (loading || !postData) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
    }


    return (
        <div className="flex flex-col items-center md:w-[55%] w-full">
            {postData ? (
                <PostDetailsLayout
                    PostData={postData}
                    onPostUpdate={updatePostData}
                />
            ) : (
                <p>Chargement du post...</p>
            )}
        </div >
    );
}