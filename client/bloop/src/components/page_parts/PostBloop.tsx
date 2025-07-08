"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import ImageIcon from "@/components/icons/image-icon.svg";
import { Button } from "@/components/ui/button";


export default function BloopPost() {
    return (
        <div className="w-full bg-secondary border-b-4 border-secondary-dark">
            <div className="inputs flex flex-row items-start gap-2 p-4">
                <Image
                    src={"/images/icons/user.png"}
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
                        <Button className="size-fit py-[6px] px-[20px] font-bold text-[16px]">
                            Poster
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}