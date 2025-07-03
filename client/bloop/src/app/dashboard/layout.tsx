import Header from "@/components/page_parts/Header";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-max">
                <Header />
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}