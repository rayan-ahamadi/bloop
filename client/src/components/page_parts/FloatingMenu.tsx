
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";



export default function FloatingMenu() {

    const pathname = usePathname(); // /register

    const links = [
        { href: "/dashboard", label: "Accueil", icon: "/images/icons/home.svg" },
        { href: "/dashboard/explore", label: "Explorer", icon: "/images/icons/search.svg" },
        { href: "/dashboard/newbloop", label: "Créer un Bloop", icon: "/images/icons/plus.svg" },
        { href: "/dashboard/notifications", label: "Notifications", icon: "/images/icons/bell.svg" },
        { href: "/dashboard/messages", label: "Messages", icon: "/images/icons/email.svg" },
    ];

    return (
        <div className="container md:hidden fixed bottom-8 left-0 w-full bg-transparent flex justify-center items-center z-50">
            <div className="bg-accent w-9/10 rounded-md shadow-[4px_4px_0_0_black] flex justify-between items-center py-3 px-5 border-2 border-secondary-dark">
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className={`flex flex-col items-center ${pathname === link.href ? "bg-primary border-1 border-secondary-dark rounded-sm p-1 shadow-[4px_4px_0_0_black]" : ""}`}>
                        <Image src={link.icon} alt={link.label} width={21} height={21} />
                    </Link>
                ))}
            </div>
        </div>

    );
}