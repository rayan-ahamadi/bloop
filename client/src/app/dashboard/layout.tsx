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
        <main className="flex flex-col h-screen max-h-screen">
            <Header />
            <div className="flex-grow-1 flex flex-row md:sticky ">
                <Menu className="hidden md:block md:sticky max-h-[93vh]  top-16  overflow-y-hidden" />
                {children}
                <FindFriends className="hidden md:flex md:sticky top-16 h-full overflow-y-hidden" />
                <FloatingMenu />
            </div>
        </main>
    );
}