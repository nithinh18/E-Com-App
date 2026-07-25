import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants";
import type { ProductCardProps } from "@/constants/types";
import { useWishlist } from "@/context/WishlistContext";


export default function ProductCard({ product, width }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product._id);
    const rating = product.ratings?.average ?? 0;
    const discount = product.comparePrice && product.comparePrice > product.price
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <Link href={`/product/${product._id}`} asChild>
            <TouchableOpacity
                className={`${width ? "" : "w-[48%]"} mb-4 bg-white rounded-2xl overflow-hidden border border-border`}
                style={width ? { width } : undefined}
            >
                <View className="relative h-56 w-full bg-gray-100">
                    <Image source={{ uri: product.images[0] }} className="w-full h-full" resizeMode="cover" />
                    <TouchableOpacity className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm" onPress={(e) => { e.stopPropagation(); toggleWishlist(product); }}>
                        <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? COLORS.accent : COLORS.primary} />
                    </TouchableOpacity>

                    <View className="absolute top-2 left-2 flex-row gap-1">
                        {product.isFeatured && (
                            <View className="bg-black px-2 py-1 rounded-md">
                                <Text className="text-white text-[10px] font-bold uppercase">Featured</Text>
                            </View>
                        )}
                        {discount > 0 && (
                            <View className="bg-accent px-2 py-1 rounded-md">
                                <Text className="text-white text-[10px] font-bold">-{discount}%</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="p-3">
                    <View className="flex-row items-center mb-1">
                        <Ionicons name="star" size={13} color="#FFD700" />
                        <Text className="text-secondary text-xs ml-1">
                            {rating > 0 ? rating.toFixed(1) : "New"}
                        </Text>
                    </View>
                    <Text className="text-primary font-medium text-sm mb-1" numberOfLines={1}>
                        {product.name}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-primary font-bold text-base">${product.price.toFixed(2)}</Text>
                        {product.comparePrice && (
                            <Text className="text-secondary text-xs line-through ml-2">${product.comparePrice.toFixed(2)}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
}
