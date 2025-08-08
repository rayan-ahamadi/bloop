"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forwardRef } from "react";
import Email from "@/components/icons/email.svg";
import MessageLayout from "@/components/page_parts/MessagesLayout";
import { useMessageStore } from "@/stores/messages.store";
import { set } from "zod";


const FindFriends = forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {

    const suggestionsList = [
        {
            avatar: "/images/icons/user.png",
            username: "Alice Dupont",
            handle: "@alice",
        },
        {
            avatar: "/images/icons/user.png",
            username: "Bob Martin",
            handle: "@bobmartin",
        },
        {
            avatar: "/images/icons/user.png",
            username: "Charlie Durand",
            handle: "@charlied",
        },
        {
            avatar: "/images/icons/user.png",
            username: "Diane Petit",
            handle: "@dianep",
        },
        {
            avatar: "/images/icons/user.png",
            username: "Éric Moreau",
            handle: "@ericm",
        },
    ];

    const {
        displayMessageLayout,
        setDisplayMessageLayout
    } = useMessageStore()

    return (
        <div className={"flex flex-col justify-between items-center w-full md:h-[93vh] md:w-[30vw] bg-secondary border-secondary-dark md:border-l-4 " + className}  >
            <div className="find-friends flex flex-col items-center w-full h-fit p-6 border-secondary-dark border-b-2">
                <div className="search-bar w-full mb-4">
                    <Input
                        type="text"
                        placeholder="Recherche..."
                        className="w-full border-secondary-dark border-2 rounded-md shadow-[4px_4px_0_0_black] focus-visible:ring-[1px] p-7 text-xs bg-secondary"
                    />
                </div>
                <div className="suggestions w-full overflow-y-auto">
                    <div className="suggestion-list flex flex-col gap-4 p-4">
                        <h2 className="text-2xl font-extrabold mb-2 ml-2">Trouver des amis</h2>
                        {suggestionsList.map((user, index) => (
                            <div key={index} className="suggestion-item flex justify-around items-center gap-3 p-2 bg-primary hover:bg-primary/80 rounded-md shadow-[4px_4px_0_0_black] border-2 border-secondary-dark">
                                <Image
                                    src={user.avatar + `?${new Date().getTime()}`}
                                    alt={`${user.username} Avatar`}
                                    width={40}
                                    height={40}
                                    className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] bg-accent"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-secondary-dark/60">{user.handle}</p>
                                </div>
                                <Button variant={"accent"} className="ml-auto w-2/6 py-4 font-medium">
                                    <span className="text-[16px]">Suivre</span>
                                </Button>
                            </div>
                        ))}
                        <Link href={"#"} ><p className="text-primary hover:text-primary/80 font-bold ml-2 mt-1">Voir plus</p></Link>
                    </div>
                </div>
            </div>
            <div className="message-container flex flex-col justify-end p-4 w-3/5 mb-6">
                <Button onClick={() => setDisplayMessageLayout(!displayMessageLayout)}>
                    <Email className="flex flex-row justify-center items-center size-max" />
                    <span className="text-[22px]">Messages</span>
                </Button>
            </div>
            {
                displayMessageLayout && <MessageLayout />
            }
        </div>
    );
}
);

FindFriends.displayName = "FindFriends";
export default FindFriends;