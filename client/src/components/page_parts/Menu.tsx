"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";
import { useUserStore } from "@/stores/user.stores";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const Menu = forwardRef<HTMLDivElement, { className?: string, displayMenu?: (e: React.MouseEvent<HTMLDivElement>) => void, menuOpen?: boolean }>((props, ref) => {
    const { user, getProfile } = useUserStore();
    const activePage = usePathname();

    const links = [
        { href: "/dashboard", label: "Accueil", icon: "/images/icons/home.svg", active: activePage === "/dashboard" ? true : false },
        { href: "/dashboard/explore", label: "Explorer", icon: "/images/icons/search.svg", active: activePage === "/dashboard/explore" ? true : false },
        { href: "/dashboard/notifications", label: "Notifications", icon: "/images/icons/bell.svg", active: activePage === "/dashboard/notifications" ? true : false },
        { href: "/dashboard/messages", label: "Messages", icon: "/images/icons/email.svg", active: activePage === "/dashboard/messages" ? true : false },
        { href: "/dashboard/profile/" + user?.id, label: "Profil", icon: "/images/icons/profile.svg", active: activePage === "/dashboard/profile/" + user?.id ? true : false },
        { href: "/dashboard/settings", label: "Paramètres", icon: "/images/icons/settings.svg", active: activePage === "/dashboard/settings" ? true : false },
    ]

    const userData = {
        name: "User Name (error)",
        username: "@User (error)",
        subscriptions: 0,
        followers: 0,
    }

    return (
        <div ref={ref} className={"absolute md:static bg-secondary-dark/25 md:bg-secondary flex flex-col items-left border-secondary-dark md:border-r-4 w-screen h-screen md:w-1/5 md:z-20 top-0 " + props.className} onClick={(e) => props.displayMenu && props.displayMenu(e)}> {/*Overlay*/}
            <div className={`mobile bg-secondary md:hidden flex flex-col items-left w-[75vw] p-7 transition-all duration-1000  h-full ease top-0 ${props.menuOpen ? "translate-x-[0%]" : "translate-x-[-100%]"
                }`} > {/*menu*/}
                <div className="profile">
                    <div className="profile-card bg-secondary flex flex-col items-left rounded-md shadow-[4px_4px_0_0_black] p-4 border-1 border-secondary-dark">
                        {user ? (
                            <>
                                <Image
                                    src={"https://localhost:8000" + (user?.avatarUrl || "/uploads/avatars/user.png")}
                                    alt="User Avatar"
                                    width={32}
                                    height={32}
                                    className="border-2 rounded-md shadow-[4px_4px_0_0_black] mb-2"
                                />
                                <p>
                                    <b>
                                        {user?.name || userData.name}
                                    </b>
                                </p>
                                <p>
                                    @{user?.username}
                                </p>

                                <div className="flex flex-row justify-between w-full">
                                    <p>
                                        <b>
                                            {user?.following_nb}
                                        </b> Abonnements
                                    </p>
                                    <p>
                                        <b>
                                            {user?.followers_nb}
                                        </b> Abonnés
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton className="w-8 h-8 rounded-md mb-2" />
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-3 w-16 mb-4" />
                                <div className="flex flex-row justify-between w-full">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="links flex flex-col items-left w-full mt-4 gap-0.5">
                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="btn-accent">
                            <Button variant="accent" className="w-full mb-4 text-left">
                                <Image
                                    src={link.icon}
                                    alt={link.label}
                                    width={17}
                                    height={17}
                                    className="inline-block mr-2 h-auto align-middle"
                                />
                                <span className={link.active ? "font-bold" : ""}>
                                    {link.label}
                                </span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="desktop hidden md:flex md:flex-col md:justify-between md:items-left p-8 h-full bg-accent">
                <div className="links flex flex-col items-left w-full mt-4 px-5">
                    {links.map((link, index) => (
                        <Link key={index} href={link.href} className="flex gap-4 items-center btn-accent mb-6  text-2xl  hover:underline hover:underline-offset-4 hover:transition-all hover:duration-300 hover:ease-in-out">
                            <div className={"icons " + (link.active ? "bg-primary border-2 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] " : " ")}>
                                <Image
                                    src={link.icon}
                                    alt={link.label}
                                    width={20}
                                    height={20}
                                    className={"inline-block h-auto m-2 "}
                                />
                            </div>

                            <span className={link.active ? "font-bold" : ""}>
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </div>



                <div className="profile">
                    <div className="post w-full">
                        <Button className="w-full font-bold text-[22px]">
                            Poster
                        </Button>
                    </div>
                    <div className="bg-secondary profile-card flex flex-row item-center gap-2 border-2 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] p-4 mt-8">
                        {user ? (
                            <>
                                <Image
                                    src={"https://localhost:8000" + (user?.avatarUrl || "/uploads/avatars/user.png")}
                                    alt="User Avatar"
                                    width={45}
                                    height={45}
                                    className="border-1 border-secondary-dark rounded-md shadow-[4px_4px_0_0_black] mr-2 h-auto bg-accent"
                                />
                                <div className="flex flex-col">
                                    <p>
                                        <b>
                                            {user?.name || userData.name}
                                        </b>
                                    </p>
                                    <p>
                                        @{user?.username}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton className="w-11 h-11 rounded-md mr-2" />
                                <div className="flex flex-col">
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
})

Menu.displayName = "Menu";

export default Menu;
