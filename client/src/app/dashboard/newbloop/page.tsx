"use client";

import BloopPostMobile from "@/components/page_parts/PostBloopMobile";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.stores";

export default function NewBloop() {

    // TODO - mettre la fonction dans un fichier utils
    const isMobile = () => {
        if (typeof window === "undefined") return false;
        return window.innerWidth <= 768;
    };

    const router = useRouter();

    useEffect(() => {
        if (!isMobile()) {
            router.replace("/dashboard");
        }
    }, []);



    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-secondary">
            <BloopPostMobile />
        </div>
    );
} 