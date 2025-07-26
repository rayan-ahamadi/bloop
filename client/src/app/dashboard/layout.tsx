import Header from "@/components/page_parts/Header";
import Menu from "@/components/page_parts/Menu";
import FloatingMenu from "@/components/page_parts/FloatingMenu";
import FindFriends from "@/components/page_parts/FindFriends";
import { Toaster } from "sonner";
import "../globals.css";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col h-screen max-h-screen overflow-y-hidden">
            <Header />
            <div className="flex-grow-1 flex flex-row md:relative md:top-17 max-h-screen overflow-hidden">
                <Toaster richColors position="top-right" />
                <Menu className="hidden md:block h-screen max-h-[93vh] " />
                {children}
                <FindFriends className="hidden md:flex h-screen max-h-[93vh]" />
                <FloatingMenu />
            </div>
        </main>
    );
}