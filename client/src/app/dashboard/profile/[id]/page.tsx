"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user.stores';
import { usePostStore } from '@/stores/post.stores';


export default function UserDetails() {
    const [hasHydrated, setHasHydrated] = useState(false);
    const router = useRouter();
    const { fetchUserById, getProfile, loading } = useUserStore();
    const [userData, setUserData] = useState<any>(null);
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
        const fetchUserDetails = async () => {
            try {
                if (!id) {
                    router.push('/dashboard');
                    return;
                }

                const user = await fetchUserById(Number(id));
                setUserData(user);
            } catch (error) {
                console.error("Erreur dans fetchUserDetails:", error);
                return (<p>Il n&apos;y a rien ici..</p>)
            }
        };

        fetchUserDetails();
    }, [id]);

    if (!hasHydrated) return (
        <div className='md:w-[55%]'>
            <p>Chargement...</p>
        </div>
    ); // Assure que le composant est hydraté avant de rendre quoi que ce soit

    if (loading) {
        console.log(userData);
        return (
            <div className='md:w-[55%]'>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-4 md:w-[55%]">
            Fin du chargement des données de l'utilisateur
        </div>
    );
}