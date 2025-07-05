import Header from "@/components/page_parts/Header";
import Menu from "@/components/page_parts/Menu";
import "../globals.css";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col h-screen">
            <Header />
            <div className="flex-grow-1 flex flex-row">
                <Menu className="hidden md:block" />
                {children}
            </div>
        </main>
    );
}