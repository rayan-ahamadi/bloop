"use client";

import { Post } from "@/types/post.types";
import { usePostStore } from "@/stores/post.stores";
import { toast } from "sonner";
import OriginalBloop from "./OriginalBloop";
import AncestorBloop from "./AncestorBloop";
import Replies from "./Replies";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


type PostData = {
    ancestorThread?: any[];
    post: any;
    replies?: any[];
    repliesPagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

type PostDetailsLayoutProps = {
    PostData: PostData;
    onPostUpdate?: (updatedData: PostData) => void;
};

export default function PostDetailsLayout({ PostData, onPostUpdate }: PostDetailsLayoutProps) {
    const { ancestorThread, post, replies, repliesPagination } = PostData;
    const { toggleLike, repost, savePost, deleteRepost, addPost, deletePostUser } = usePostStore();
    const router = useRouter();

    const handleLike = async (postId: number) => {
        try {
            await toggleLike(postId);

            // Mettre à jour les données localement
            const updatedPost = {
                ...post,
                hasLiked: !post.hasLiked,
                post: {
                    ...post.post,
                    likesCount: post.hasLiked
                        ? post.post.likesCount - 1
                        : post.post.likesCount + 1
                }
            };

            const updatedPostData = {
                ...PostData,
                post: updatedPost
            };

            if (onPostUpdate) {
                onPostUpdate(updatedPostData);
            }

            console.log("Post liked/unliked successfully");
        } catch (error) {
            console.error("Erreur lors du like du post:", error);
            toast.error("Erreur lors du like du post");
        }
    };

    const handleReply = async (formData: any) => {
        try {
            const newPost = await addPost({
                parent_post_id: formData.parent_post_id,
                content: formData.content,
                image: formData.image,
                type: "reply",
                language: "fr",
            });
            console.log("Réponse ajoutée avec succès:", newPost);
            // Mettre à jour l'état local si nécessaire

            if (onPostUpdate) {
                const formattedReply = {
                    post: newPost.post,
                    hasLiked: false,
                    hasReposted: false,
                    hasSaved: false
                };

                const updatedReplies = [...(replies || []), formattedReply];
                const updatedPostData = {
                    ...PostData,
                    replies: updatedReplies,
                    repliesPagination: {
                        ...repliesPagination,
                        totalItems: repliesPagination.totalItems + 1
                    }
                };
                onPostUpdate(updatedPostData);
            }
            toast.success("Réponse ajoutée avec succès");
            console.log(PostData)
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réponse:", error);
            toast.error("Erreur lors de l'ajout de la réponse");
        }
    };

    const handleRepost = async (postId: number) => {
        try {
            const wasReposted = post.hasReposted;

            if (wasReposted) {
                await deleteRepost(postId);
            } else {
                await repost(postId);
            }

            // Mettre à jour les données localement
            const updatedPost = {
                ...post,
                hasReposted: !wasReposted,
                post: {
                    ...post.post,
                    retweetsCount: wasReposted
                        ? post.post.retweetsCount - 1
                        : post.post.retweetsCount + 1
                }
            };

            const updatedPostData = {
                ...PostData,
                post: updatedPost
            };

            if (onPostUpdate) {
                onPostUpdate(updatedPostData);
            }

            console.log("Post reposted successfully");
        } catch (error) {
            console.error("Erreur lors du repost du post:", error);
            toast.error("Erreur lors du repost du post");
        }
    };

    const handleSave = async (postId: number) => {
        try {
            await savePost(postId);
            const newHasSavedState = !post.hasSaved;

            // Mettre à jour les données localement
            const updatedPost = {
                ...post,
                hasSaved: newHasSavedState
            };

            const updatedPostData = {
                ...PostData,
                post: updatedPost
            };

            if (onPostUpdate) {
                onPostUpdate(updatedPostData);
            }

            if (newHasSavedState) {
                toast.success("Bloop enregistré dans vos signets.");
            } else {
                toast.success("Bloop retiré de vos signets.");
            }

            console.log("Post saved successfully");
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du post:", error);
            toast.error("Erreur lors de la sauvegarde du post");
        }
    };

    const handleDeleteAncestor = async (bloopId: number) => {
        try {
            await deletePostUser(bloopId);

            console.log("Bloop deleted successfully");
            // Mettre à jour l'état local si nécessaire
            if (onPostUpdate) {
                const updatedAncestorThread = ancestorThread.filter(
                    (ancestor) => ancestor.post.id !== bloopId
                );
                const updatedPostData = {
                    ...PostData,
                    ancestorThread: updatedAncestorThread
                };
                onPostUpdate(updatedPostData);
            }

        } catch (error) {
            console.error("Erreur lors de la suppression du bloop:", error);
            toast.error("Erreur lors de la suppression du bloop");
        }
    }

    const handleDeleteOriginal = async (bloopId: number) => {
        try {
            await deletePostUser(bloopId);

            console.log("Bloop deleted successfully");
            router.push('/dashboard');

        } catch (error) {
            console.error("Erreur lors de la suppression du bloop:", error);
            toast.error("Erreur lors de la suppression du bloop");
        }
    };

    const handleDeleteReply = async (bloopId: number) => {
        try {
            await deletePostUser(bloopId);

            console.log("Bloop deleted successfully");
            // Mettre à jour l'état local si nécessaire
            if (onPostUpdate) {
                const updatedReplies = replies.filter(
                    (reply) => reply.post.id !== bloopId
                );
                const updatedPostData = {
                    ...PostData,
                    replies: updatedReplies,
                    repliesPagination: {
                        ...repliesPagination,
                        totalItems: repliesPagination.totalItems - 1
                    }
                };
                onPostUpdate(updatedPostData);
            }

        } catch (error) {
            console.error("Erreur lors de la suppression du bloop:", error);
            toast.error("Erreur lors de la suppression du bloop");
        }
    };


    if (!post) {
        return <PostDetailLoading />;
    }

    return (
        <div className="flex flex-col w-full overflow-y-auto h-screen max-h-[93vh]">

            {ancestorThread && ancestorThread.length > 0 && (
                <div className="ancestor-thread w-full">
                    {ancestorThread.map((ancestorPost, index) => (
                        <Link key={index} href={`/dashboard/bloop/${ancestorPost.post.id}`} className="relative block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                            <AncestorBloop
                                key={index}
                                postData={ancestorPost}
                                onLike={handleLike}
                                onRepost={handleRepost}
                                onSave={handleSave}
                                onDelete={(bloopId) => handleDeleteAncestor(bloopId, false)} />
                        </Link>
                    ))}
                </div>
            )}

            <OriginalBloop
                postData={post}
                onReply={handleReply}
                onLike={handleLike}
                onRepost={handleRepost}
                onSave={handleSave}
                onDelete={(bloopId) => handleDeleteOriginal(bloopId, false)}
            />

            {replies && replies.length > 0 && (
                <div className="replies-section w-full">
                    {replies.map((reply, index) => (
                        <Link key={index} href={`/dashboard/bloop/${reply.post.id}`} className="relative block border-y-1 first:border-t-0 last:border-b-0 border-secondary-dark">
                            <Replies
                                key={index}
                                postData={reply}
                                onLike={handleLike}
                                onRepost={handleRepost}
                                onSave={handleSave}
                                onDelete={(bloopId) => handleDeleteReply(bloopId, false)}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
