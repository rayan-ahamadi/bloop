"use client";

import { useEffect, useState } from "react";
import Bloop from "@/components/page_parts/Bloop";
import BloopPost from "@/components/page_parts/PostBloop";
import { getPosts } from "@/services/API/post.api";

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

    return (
        <div className="flex flex-col items-center md:w-[55%] w-full md:flex-grow-1">
            <BloopPost />
            <div className="bloops w-full ">
                {bloops.posts.map((bloop, index) => (
                    <Bloop key={index} bloopContent={bloop} />
                ))}
            </div>
        </div>
    );
}
