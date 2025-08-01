"use client";

import { Button } from "@/components/ui/button";


type PostLikesSwitchProps = {
    switchState: string
    setSwitchState: (state: string) => void;
}

export default function PostLikesSwitch({ switchState, setSwitchState }: PostLikesSwitchProps) {
    const handleSwitchChange = () => {
        setSwitchState(switchState === "posts" ? "likes" : "posts");
    };

    return (
        <div className="post-likes-switch flex items-end w-full flex-grow-0">
            <div className="flex w-full flex-col">
                <Button
                    variant={"switchButton"}
                    className={`switch-button ${switchState === "posts" ? "active" : ""} w-auto flex-grow-1 flex flex-col`}
                    onClick={handleSwitchChange}
                >
                    <p className="">Posts</p>
                </Button>
                {switchState === "posts" ? (
                    <div className="border-primary border-b-4 relative h-0 w-3/10 z-10 -translate-y-1 left-[35%]"></div>
                ) :
                    <div className="border-primary border-b-4 relative h-0 w-3/10 z-10 -translate-y-2 opacity-0"></div>
                }

            </div>
            <div className="flex w-full flex-col">
                <Button
                    variant={"switchButton"}
                    className={`switch-button ${switchState === "likes" ? "active" : ""} w-auto flex-grow-1`}
                    onClick={handleSwitchChange}
                >
                    <p className="">Likes</p>
                </Button>
                {switchState === "likes" ? (
                    <div className="border-primary border-b-4 relative h-0 w-3/10 z-10 -translate-y-1 left-[35%]"></div>
                ) : (
                    <div className="border-primary border-b-4 relative h-0 w-3/10 z-10 -translate-y-2 opacity-0"></div>
                )}
            </div>

        </div>
    );

}