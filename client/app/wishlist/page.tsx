"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
    const { wishlist, loading } = useWishlist();

    if (!loading && wishlist.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-5">
                    <Heart size={30} className="text-secondary" />
                </div>
                <h1 className="text-2xl font-extrabold text-primary mb-2">Your wishlist is empty</h1>
                <p className="text-secondary text-sm mb-6">Tap the heart on any product to save it here for later.</p>
                <Link href="/shop" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-3xl font-extrabold text-primary mb-2">Wishlist</h1>
            <p className="text-secondary text-sm mb-8">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
