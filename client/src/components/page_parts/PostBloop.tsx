"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import ImageIcon from "@/components/icons/image-icon.svg";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useUserStore } from "@/stores/user.stores";


export default function BloopPost() {
    const { user } = useUserStore();
    const handlePost = () => {
        // Logic to handle posting the bloop
        toast.success("Bloop posté avec succès!");
    };

    return (
        <div className="w-full bg-secondary border-b-4 border-secondary-dark hidden md:block sticky md:top-17 z-10">
            <Toaster richColors position="top-center" closeButton={false} />
            <div className="inputs flex flex-row items-start gap-2 p-4">
                <Image
                    src={"https://localhost:8000" + (user?.avatarUrl || "/uploads/avatar/user.png")}
                    alt={"Avatar"}
                    width={45}
                    height={45}
                    className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto bg-accent"
                />

                <div className="flex flex-col flex-grow">
                    <Textarea placeholder="Quelque chose à dire ?" />
                    <div className="flex flex-row justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="cursor-pointer hover:fill-accent/80" />
                        </div>
                        <Button className="size-fit py-[6px] px-[20px] font-bold text-[16px]" onClick={handlePost}>
                            Poster
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}