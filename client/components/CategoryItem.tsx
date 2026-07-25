import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants";
import type { CategoryItemProps } from "@/constants/types";

export default function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
    return (
        <TouchableOpacity className="mr-4 items-center" onPress={onPress} activeOpacity={0.7}>
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-2 border ${isSelected ? "bg-primary border-primary" : "bg-surface border-border"}`} >
                <Ionicons name={item.icon as any} size={24} color={isSelected ? "#FFF" : COLORS.primary} />
            </View>
            <Text className={`text-xs font-medium text-center ${isSelected ? "text-primary" : "text-secondary"}`}>{item.name}</Text>
        </TouchableOpacity>
    );
}
