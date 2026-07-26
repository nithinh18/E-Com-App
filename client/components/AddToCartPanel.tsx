"use client";

import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/constants/types";
import { COLORS } from "@/constants";

export default function AddToCartPanel({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    const isLiked = isInWishlist(product._id);
    const hasSizes = product.sizes && product.sizes.length > 0;

    const handleAddToCart = async () => {
        if (hasSizes && !selectedSize) {
            return;
        }
        setAdding(true);
        await addToCart(product, selectedSize || "");
        setAdding(false);
    };

    return (
        <div>
            {hasSizes && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-primary mb-3">Size</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes!.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-12 h-12 px-3 rounded-full border font-medium text-sm transition-colors ${
                                    selectedSize === size
                                        ? "bg-primary border-primary text-white"
                                        : "bg-white border-border text-primary hover:border-primary"
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {hasSizes && !selectedSize && (
                        <p className="text-xs text-secondary mt-2">Select a size before adding to cart</p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={adding || (hasSizes && !selectedSize)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingBag size={18} />
                    {adding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                    onClick={() => toggleWishlist(product)}
                    className="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors shrink-0"
                    aria-label="Toggle wishlist"
                >
                    <Heart size={20} fill={isLiked ? COLORS.accent : "none"} color={isLiked ? COLORS.accent : COLORS.primary} />
                </button>
            </div>
        </div>
    );
}
