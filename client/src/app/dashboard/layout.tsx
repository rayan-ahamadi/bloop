import Header from "@/components/page_parts/Header";
import Menu from "@/components/page_parts/Menu";
import FloatingMenu from "@/components/page_parts/FloatingMenu";
import FindFriends from "@/components/page_parts/FindFriends";
import "../globals.css";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col h-screen max-h-fit">
            <Header />
            <div className="flex-grow-1 flex flex-row md:relative md:top-16 max-h-screen overflow-hidden">
                <Menu className="hidden md:block h-screen max-h-[93vh] " />
                {children}
                <FindFriends className="hidden md:flex h-screen max-h-[93vh]" />
                <FloatingMenu />
            </div>
        </main>
    );
}