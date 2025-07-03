"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

const Menu = forwardRef<HTMLDivElement, { className?: string, displayMenu?: () => void, menuOpen: boolean }>((props, ref) => {

    const links = [
        { href: "/dashboard", label: "Accueil" },
        { href: "/dashboard/explore", label: "Explorer" },
        { href: "/dashboard/notifications", label: "Notifications" },
        { href: "/dashboard/messages", label: "Messages" },
        { href: "/dashboard/profile", label: "Profil" },
        { href: "/dashboard/settings", label: "Paramètres" }
    ]

    const userData = {
        name: "Rayan",
        username: "@RayouLeBoss",
        subscriptions: 26,
        followers: 31,
    }

    return (
        <div ref={ref} className={"bg-secondary-dark/25 flex flex-col items-left border-secondary-dark h-screen w-screen absolute z-20 top-0 " + props.className} onClick={e => props.displayMenu(e)}> {/*Overlay*/}
            <div className={`mobile absolute bg-secondary md:hidden flex flex-col items-left w-[75vw] p-7 h-full transition-all duration-1000 ease top-0 ${props.menuOpen ? "translate-x-0" : "-translate-x-full"
                }`} > {/*menu*/}
                <div className="profile">
                    <div className="profile-card bg-secondary flex flex-col items-left rounded-md shadow-[4px_4px_0_0_black] p-4">
                        <Image
                            src="/images/icons/user.png"
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="border-2 rounded-md shadow-[4px_4px_0_0_black] mb-2"
                        />
                        <p>
                            <b>
                                {userData.name}
                            </b>
                        </p>
                        <p>
                            {userData.username}
                        </p>

                        <div className="flex flex-row justify-between w-full">
                            <p>
                                <b>
                                    {userData.subscriptions}
                                </b> Abonnements
                            </p>
                            <p>
                                <b>
                                    {userData.followers}
                                </b> Abonnés
                            </p>
                        </div>
                    </div>
                </div>
                <div className="links flex flex-col items-left w-full mt-4 gap-0.5">
                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="btn-accent">
                            <Button variant="accent" className="w-full mb-2 text-left">
                                {link.label}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
            {/* <div id="desktop hidden md:flex flex-col items-center">
                <div className="links flex flex-col items-center w-full mt-4">
                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="btn-accent">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="post w-full">
                    <Button className="w-full">
                        Poster
                    </Button>
                </div>

                <div className="profile">
                    <div className="profile-card flex flex-row">
                        <Image
                            src="/images/icons/user.png"
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="border-2 rounded-md shadow-[4px_4px_0_0_black] mr-2"
                        />
                        <div className="flex flex-col">
                            <p>
                                <b>
                                    {userData.name}
                                </b>
                            </p>
                            <p>
                                {userData.username}
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>

    )
})

Menu.displayName = "Menu";

export default Menu;
