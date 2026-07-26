import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Newever — Fresh drops, honest prices",
        template: "%s · Newever",
    },
    description: "Shop the latest in Men's, Women's, Kids' fashion, shoes, and bags at Newever.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
                <body className="min-h-full flex flex-col">
                    <CartProvider>
                        <WishlistProvider>
                            <TopNav />
                            <main className="flex-1">{children}</main>
                            <Footer />
                            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                        </WishlistProvider>
                    </CartProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
