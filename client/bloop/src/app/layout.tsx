import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloop",
  description: "Clone of the popular social media platform, X (formerly Twitter), built with Next.js and TypeScript.",
  icons: {
    icon: "/images/logo/yeuxbloop.png",
    apple: "/images/logo/yeuxbloop.png",
    shortcut: "/images/logo/yeuxbloop.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="h-screen">
        {children}
      </body>
    </html>
  );
}
