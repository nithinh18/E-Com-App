"use client";

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Product } from "@/constants/types";

type WishlistContextType = {
    wishlist: Product[];
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { isSignedIn, getToken } = useAuth();

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await api.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } });
            setWishlist(data.data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (product: Product) => {
        if (!isSignedIn) {
            toast.error("Please login to use your wishlist");
            return;
        }

        try {
            const token = await getToken();
            await api.post("/wishlist/toggle", { productId: product._id }, { headers: { Authorization: `Bearer ${token}` } });
            const exists = wishlist.find((p) => p._id === product._id);
            setWishlist((prev) => {
                if (exists) {
                    return prev.filter((p) => p._id !== product._id);
                }
                return [...prev, product];
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update wishlist");
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p._id === productId);
    };

    useEffect(() => {
        if (isSignedIn) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
