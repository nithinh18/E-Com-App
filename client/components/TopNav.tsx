"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, MapPin, Menu, Package, Search, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { CATEGORIES } from "@/constants";

export default function TopNav() {
    const router = useRouter();
    const { itemCount } = useCart();
    const { wishlist } = useWishlist();
    const { user, isLoaded, isSignedIn } = useUser();
    const [query, setQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin = user?.publicMetadata?.role === "admin";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-extrabold tracking-tight text-primary shrink-0">
                            NEWEVER
                        </Link>
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/shop" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                                Shop
                            </Link>
                            {CATEGORIES.slice(0, 4).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
                        <div className="flex items-center w-full bg-surface rounded-full px-4 py-2 gap-2 border border-transparent focus-within:border-border">
                            <Search size={16} className="text-secondary shrink-0" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="bg-transparent text-sm w-full outline-none placeholder:text-secondary"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/wishlist"
                            className="relative hidden sm:flex w-10 h-10 rounded-full items-center justify-center hover:bg-surface transition-colors"
                        >
                            <Heart size={19} className="text-primary" />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link
                            href="/cart"
                            className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface transition-colors"
                        >
                            <ShoppingBag size={19} className="text-primary" />
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isLoaded && isSignedIn && (
                            <div className="ml-1">
                                <UserButton>
                                    <UserButton.MenuItems>
                                        <UserButton.Link label="My Orders" href="/account/orders" labelIcon={<Package size={14} />} />
                                        <UserButton.Link label="Shipping Address" href="/account/address" labelIcon={<MapPin size={14} />} />
                                        {isAdmin && (
                                            <UserButton.Link label="Admin Panel" href="/admin" labelIcon={<ShieldCheck size={14} />} />
                                        )}
                                    </UserButton.MenuItems>
                                </UserButton>
                            </div>
                        )}
                        {isLoaded && !isSignedIn && (
                            <Link
                                href="/sign-in"
                                className="hidden sm:block text-sm font-semibold text-primary px-4 py-2 rounded-full border border-border hover:bg-surface transition-colors"
                            >
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileOpen((v) => !v)}
                            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="lg:hidden border-t border-border bg-background px-6 py-4">
                    <form onSubmit={handleSearch} className="flex items-center bg-surface rounded-full px-4 py-2 gap-2 mb-4">
                        <Search size={16} className="text-secondary shrink-0" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="bg-transparent text-sm w-full outline-none placeholder:text-secondary"
                        />
                    </form>
                    <nav className="flex flex-col gap-3">
                        <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">
                            Shop
                        </Link>
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm font-medium text-secondary"
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-secondary">
                            Wishlist
                        </Link>
                        {isLoaded && !isSignedIn && (
                            <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-primary mt-2">
                                Sign In
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
