"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/stores/user.stores';
import { usePostStore } from '@/stores/post.stores';
import { Post } from '@/types/post.types';
import { User } from '@/types/user.types';

import UserCard from '@/components/page_parts/UserCardProfile';
import PostLikesSwitch from '@/components/page_parts/PostLikesSwitch';
import Bloop from '@/components/page_parts/Bloop';

type userDataType = {
    likes: Post[];
    posts: Post[];
    reposts: Post[];
    user: Partial<User>;
}


export default function UserDetails() {
    const [hasHydrated, setHasHydrated] = useState(false);
    const router = useRouter();
    const { fetchUserById, getProfile, loading } = useUserStore();
    const { toggleLike, repost, savePost, deleteRepost, deletePostUser } = usePostStore();
    const [userData, setUserData] = useState<userDataType>(null);
    const [switchState, setSwitchState] = useState("posts");
    const { id } = useParams();

    // const {
    //     likes,
    //     posts,
    //     reposts,
    //     user
    // } = userData;

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

    if (!hasHydrated || loading) return (
        <div className='md:w-[55%]'>
            <p>Chargement...</p>
        </div>
    ); // Assure que le composant est hydraté avant de rendre quoi que ce soit


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
            setUserData((prev) => ({
                ...prev,
                reposts: prev.reposts.map((repost) => {
                    if (repost.post.id === postId) {
                        return {
                            ...repost,
                            hasReposted: !bloopState.hasReposted,
                            post: {
                                ...repost.post,
                                retweetsCount: bloopState.hasReposted ? repost.post.retweetsCount - 1 : repost.post.retweetsCount + 1
                            }
                        };
                    }
                    return repost;
                })
            }));

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
            const newState = !bloopState.hasSaved
            setBloopState({ ...bloopState, saved: newState });
            if (newState === true) {
                toast.success("Bloop enregistré dans vos signets.",);
            } else {
                toast.success("Bloop retiré de vos signets.");
            }
            console.log("Post saved successfully");
            // Mettre à jour l'état local si nécessaire
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du post:", error);
            toast.error("Erreur lors de la sauvegarde du post", {
                id: "bloop-list-toaster"
            });
        }
    };

    const handleDelete = async (bloopId: number) => {
        try {
            await deletePostUser(bloopId);

            setBloops((prev) => ({
                ...prev,
                posts: prev.posts.filter((post) => post.post.id !== bloopId)
            }));
            toast.success("Bloop supprimé avec succès.");

        } catch (error) {
            console.error("Erreur lors de la suppression du bloop:", error);
            toast.error("Erreur lors de la suppression du bloop", {
                id: "bloop-list-toaster"
            });
        }
    }

    const posts = userData?.posts || []
    const reposts = userData?.reposts || []

    const postsAndReposts = [...posts, ...reposts].sort((a, b) => {
        const aDate = new Date(a?.repostedAt).getTime() || new Date(a?.post?.createdAt).getTime();
        const bDate = new Date(b?.repostedAt).getTime() || new Date(b?.post?.createdAt).getTime();
        return bDate - aDate;
    });

    return (
        <div className="flex flex-col items-center md:w-[55%] overflow-y-scroll h-screen max-h-[93vh] z-50">
            <UserCard userData={userData?.user} />
            <PostLikesSwitch switchState={switchState} setSwitchState={setSwitchState} />
            <div className="user-posts w-full flex flex-col items-center">
                {switchState === "likes" && switchState === "likes" && (
                    <div className="likes-list w-full">
                        {userData?.likes.length > 0 ? (
                            userData?.likes.map((post) => (
                                <Link key={post?.post.id} href={`/dashboard/bloop/${post?.post.id}`} className="block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                                    <Bloop bloopContent={post} onDelete={handleDelete} onLike={handleLike} onRepost={handleRepost} onSave={handleSave} />
                                </Link>
                            ))
                        ) : (
                            <p>Aucun post aimé.</p>
                        )}
                    </div>
                )}
                <div className="posts-list w-full flex flex-col items-center">
                    {postsAndReposts.length > 0 && switchState === "posts" ? (
                        <div className="w-full">
                            {postsAndReposts.map((post) => (
                                <Link key={post?.post.id} href={`/dashboard/bloop/${post?.post.id}`} className=" block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                                    <Bloop bloopContent={post} onDelete={handleDelete} onLike={handleLike} onRepost={handleRepost} onSave={handleSave} isRepost={post?.repostedAt ? true : false} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>Aucun post trouvé.</p>
                    )}
                </div>
            </div>
        </div>
    );
}