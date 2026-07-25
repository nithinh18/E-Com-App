import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { COLORS } from "@/constants";
import { useCart } from "@/context/CartContext";
import type { HeaderProps } from "@/constants/types";

export default function Header({ title, showBack, showSearch, showCart, showLogo }: HeaderProps) {

    const router = useRouter();
    const { itemCount } = useCart();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-border">
            {/* Left slot */}
            <View className="flex-1 flex-row items-center">
                {showBack && (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        hitSlop={8}
                        className="w-9 h-9 -ml-2 rounded-full items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Center slot */}
            <View className="items-center justify-center">
                {showLogo ? (
                    <Image
                        source={require("@/assets/logo.png")}
                        style={{ width: 120, height: 26 }}
                        resizeMode="contain"
                    />
                ) : title ? (
                    <Text className="text-lg font-bold text-primary" numberOfLines={1}>
                        {title}
                    </Text>
                ) : null}
            </View>

            {/* Right slot */}
            <View className="flex-1 flex-row items-center justify-end gap-4">
                {showSearch && (
                    <TouchableOpacity onPress={() => router.push("/shop")} hitSlop={8}>
                        <Ionicons name="search-outline" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
                {showCart && (
                    <TouchableOpacity onPress={() => router.push("/(tabs)/cart")} hitSlop={8}>
                        <View className="relative">
                            <Ionicons name="bag-outline" size={22} color={COLORS.primary} />
                            {itemCount > 0 && (
                                <View className="absolute -top-1.5 -right-2 bg-accent min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                                    <Text className="text-white text-[10px] font-bold">{itemCount > 9 ? "9+" : itemCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
