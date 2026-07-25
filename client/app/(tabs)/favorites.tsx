import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { COLORS } from "@/constants";
import { useWishlist } from "@/context/WishlistContext";

export default function Favorites() {
    const { wishlist } = useWishlist();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
            <Header title="Wishlist" showSearch showCart />

            {wishlist.length > 0 ? (
                <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
                    <Text className="text-secondary text-sm mb-4">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {wishlist.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View className="flex-1 items-center justify-center px-10">
                    <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4">
                        <Ionicons name="heart-outline" size={32} color={COLORS.secondary} />
                    </View>
                    <Text className="text-primary font-bold text-lg mb-1">Your wishlist is empty</Text>
                    <Text className="text-secondary text-sm text-center mb-6">Tap the heart on any product to save it here for later.</Text>
                    <TouchableOpacity onPress={() => router.push("/shop")} className="bg-primary px-8 py-3 rounded-full">
                        <Text className="text-white font-bold">Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
