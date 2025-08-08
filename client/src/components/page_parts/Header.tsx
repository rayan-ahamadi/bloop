"use client";
import Image from "next/image";
import Menu from "@/components/page_parts/Menu";
import { useRef, useState } from "react";

export default function Header() {
    const refMenu = useRef<HTMLDivElement>(null);
    const [menuState, setMenuState] = useState(false);
    const displayMobileMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        const event = e?.target as HTMLElement;

        if (refMenu.current) {
            const firstChild = refMenu.current.children[0] as HTMLElement;

            if (event && firstChild && event === firstChild) {
                return;
            }

            refMenu.current.classList.toggle("-left-full");
            refMenu.current.classList.toggle("left-0");

            setMenuState(!menuState);
        }
    }


    return (
        <header className="bg-secondary-dark flex justify-between items-center p-4 z-50 fixed w-full">
            <div id="burger-menu">
                <Image
                    src={"/images/icons/burger-menu.svg" + `?${new Date().getTime()}`}
                    alt="Menu"
                    width={24}
                    height={24}
                    className="md:hidden cursor-pointer"
                    onClick={displayMobileMenu}
                />
                <Image
                    src={"/images/logo/bloop-4.png" + `?${new Date().getTime()}`}
                    alt="Menu"
                    width={90}
                    height={50}
                    className="hidden md:block h-auto ml-8"
                />
            </div>
            <div className="logo mr-[45%]">
                <Image
                    src={"/images/logo/yeuxbloop.png" + `?${new Date().getTime()}`}
                    alt="Bloop Logo"
                    width={32}
                    height={32}
                    className="md:hidden"
                />
            </div>
            <Menu ref={refMenu} className="-left-full md:hidden" displayMenu={displayMobileMenu} menuOpen={menuState} />
        </header>
    );
}