import React from 'react';
import { User } from '@/types/user.types';
import { useUserStore } from '@/stores/user.stores';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Chat from '@/components/icons/chat.svg';



type UserCardProfileProps = {
    userData: Partial<User>;
}

export default function UserCard({ userData }: UserCardProfileProps) {
    const { getProfile, user } = useUserStore();

    const handleProfileClick = async () => {
        try {
            await getProfile();
        } catch (error) {
            console.error("Erreur lors de la récupération du profil utilisateur:", error);
        }
    };

    return (
        <div className="user-card  bg-secondary w-full" onClick={handleProfileClick}>
            <div className="user-banner">

            </div>
            <div className="user-infos flex justify-around items-center p-4 gap-4">
                <Image src={(user?.avatarUrl && "https://localhost:8000" + user?.avatarUrl) || "https://localhost:8000/uploads/avatars/user.png"} alt={`${user?.username}'s avatar`} width={80} height={80} className="user-avatar rounded-md border-2 border-secondary-dark shadow-[4px_4px_0_0_black]" />
                <div className="usernames flex flex-col items-left flex-grow-1">
                    <h3 className="user-name text-2xl font-bold">{user?.name}</h3>
                    <p className="user-bio">@{user?.username}</p>
                </div>
                <div className="flex gap-2">
                    {(userData?.id !== user?.id) && (
                        <Button className='w-auto'>
                            <Chat style={{ width: "25px", height: "25px" }} />
                        </Button>
                    )}
                    <Button variant="accent" className="user-button w-auto">
                        {userData?.id === user?.id ? "Modifier le profil" : "Suivre"}
                    </Button>
                </div>

            </div>
            <div className="bio p-4">
                <p className="text-secondary-dark/60 text-sm">{userData?.bio || "Aucune bio disponible"}</p>
            </div>
            <div className="user-stats flex justify-center gap-6 p-4">
                <Button className="user-button w-auto">
                    <p className="user-following-count font-medium text-lg">
                        <span className='font-bold'>{userData?.following_nb || 0} </span>
                        Abonnements
                    </p>
                </Button>
                <Button className="user-button w-auto">
                    <p className="user-followers-count font-medium text-lg">
                        <span className='font-bold'>{userData?.followers_nb || 0} </span>
                        Abonnés
                    </p>
                </Button>
            </div>

            {/* 
            <div className="user-info">
                <h3 className="user-name">{user?.username}</h3>
                <p className="user-bio">{user?.bio}</p>
            </div> */}
        </div>
    );

}