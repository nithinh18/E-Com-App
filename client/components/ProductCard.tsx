"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/constants/types";
import { COLORS } from "@/constants";

export default function ProductCard({ product }: { product: Product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product._id);
    const rating = product.ratings?.average ?? 0;
    const discount =
        product.comparePrice && product.comparePrice > product.price
            ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
            : 0;

    return (
        <Link href={`/product/${product._id}`} className="group block">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface border border-border">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                    aria-label="Toggle wishlist"
                >
                    <Heart size={16} fill={isLiked ? COLORS.accent : "none"} color={isLiked ? COLORS.accent : COLORS.primary} />
                </button>

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isFeatured && (
                        <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md tracking-wide">
                            Featured
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md">-{discount}%</span>
                    )}
                </div>
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-secondary">{rating > 0 ? rating.toFixed(1) : "New"}</span>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">₹{product.price.toFixed(2)}</p>
                    {product.comparePrice && (
                        <p className="text-xs text-secondary line-through">₹{product.comparePrice.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
