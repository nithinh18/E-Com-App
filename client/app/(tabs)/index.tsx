import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/constants/api";
import type { Product } from "@/constants/types";
import { COLORS, CATEGORIES } from "@/constants";
import { BANNERS } from "@/assets/assets";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const HERO_HEIGHT = 460;
const TICKER_ITEMS = ["FREE SHIPPING OVER $50", "NEW DROPS WEEKLY", "24/7 SUPPORT", "EASY 30-DAY RETURNS"];

function getCategoryLabel(product: Product) {
    return typeof product.category === "string" ? product.category : product.category?.name;
}

function TrendingCard({ product, height, onPress }: { product: Product; height: number; onPress: () => void }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product._id);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} className="mb-3 bg-white rounded-2xl overflow-hidden border border-border">
            <View style={{ height }} className="relative bg-gray-100">
                <Image source={{ uri: product.images[0] }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full"
                    hitSlop={6}
                >
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={15} color={isLiked ? COLORS.accent : COLORS.primary} />
                </TouchableOpacity>
            </View>
            <View className="p-2.5">
                <Text numberOfLines={1} className="text-primary text-xs font-semibold">{product.name}</Text>
                <Text className="text-primary text-sm font-bold mt-0.5">${product.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function Home() {
    const router = useRouter();
    const { itemCount } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");

    const tickerAnim = useRef(new Animated.Value(0)).current;
    const [tickerWidth, setTickerWidth] = useState(0);
    const tickerMeasured = useRef(false);

    const categories = [{ id: "all", name: "All" }, ...CATEGORIES];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!tickerWidth) return;
        tickerAnim.setValue(0);
        const loop = Animated.loop(
            Animated.timing(tickerAnim, {
                toValue: -tickerWidth,
                duration: tickerWidth * 22,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, [tickerWidth, tickerAnim]);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/products");
            setProducts(data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const spotlight = useMemo(() => products.find((p) => p.isFeatured) ?? products[0], [products]);
    const trending = useMemo(() => products.filter((p) => p._id !== spotlight?._id).slice(0, 8), [products, spotlight]);
    const newArrivals = useMemo(() => [...products].reverse().slice(0, 5), [products]);

    const trendingHeights = [222, 178, 196, 250];
    const leftColumn = trending.filter((_, i) => i % 2 === 0);
    const rightColumn = trending.filter((_, i) => i % 2 === 1);

    const handleSubscribe = () => {
        if (!email.trim()) {
            Alert.alert("Enter your email", "Add your email address to join the list.");
            return;
        }
        Alert.alert("You're on the list!", "Check your inbox for your 10% off code.");
        setEmail("");
    };

    const handleTickerLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
        if (tickerMeasured.current) return;
        tickerMeasured.current = true;
        setTickerWidth(e.nativeEvent.layout.width);
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* Hero */}
                <View style={{ height: HERO_HEIGHT }} className="relative w-full bg-gray-300">
                    <Image source={{ uri: BANNERS[0]?.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <View className="absolute inset-0 bg-black/20" />
                    <View className="absolute bottom-0 left-0 right-0 h-44 bg-black/55" />

                    <View className="absolute top-4 left-5 right-5 flex-row items-center justify-between">
                        <Text className="text-white text-lg font-extrabold tracking-widest">NEWEVER</Text>
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={() => router.push("/(tabs)/favorites")}
                                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                                hitSlop={6}
                            >
                                <Ionicons name="heart-outline" size={18} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push("/(tabs)/cart")}
                                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                                hitSlop={6}
                            >
                                <View className="relative">
                                    <Ionicons name="bag-outline" size={18} color="#fff" />
                                    {itemCount > 0 && (
                                        <View className="absolute -top-1.5 -right-2 bg-accent min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                                            <Text className="text-white text-[10px] font-bold">{itemCount > 9 ? "9+" : itemCount}</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="absolute bottom-16 left-5 right-5">
                        <Text className="text-white text-4xl font-extrabold leading-[40px]">New Season{"\n"}Arrivals</Text>
                        <Text className="text-white/80 text-sm mt-2">Fresh styles just dropped — up to 50% off</Text>
                    </View>
                </View>

                {/* Floating search card overlapping the hero seam */}
                <View className="px-5" style={{ marginTop: -26 }}>
                    <TouchableOpacity
                        onPress={() => router.push("/shop")}
                        activeOpacity={0.8}
                        className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 gap-2 border border-border shadow-lg"
                    >
                        <Ionicons name="search" size={18} color={COLORS.secondary} />
                        <Text className="text-secondary text-sm">Search for products, brands...</Text>
                    </TouchableOpacity>
                </View>

                {/* Marquee ticker */}
                <View className="mt-8 mb-8 bg-primary py-2.5 overflow-hidden">
                    <Animated.View style={{ flexDirection: "row", transform: [{ translateX: tickerAnim }] }}>
                        <View onLayout={handleTickerLayout} className="flex-row items-center">
                            {TICKER_ITEMS.map((item, i) => (
                                <View key={`a-${i}`} className="flex-row items-center">
                                    <Text className="text-white text-xs font-bold tracking-wider">{item}</Text>
                                    <View className="w-1.5 h-1.5 rounded-full bg-white/40 mx-4" />
                                </View>
                            ))}
                        </View>
                        <View className="flex-row items-center">
                            {TICKER_ITEMS.map((item, i) => (
                                <View key={`b-${i}`} className="flex-row items-center">
                                    <Text className="text-white text-xs font-bold tracking-wider">{item}</Text>
                                    <View className="w-1.5 h-1.5 rounded-full bg-white/40 mx-4" />
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                </View>

                {/* Category pills */}
                <View className="mb-8">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => router.push({ pathname: "/shop", params: { category: cat.id === "all" ? "" : cat.name } })}
                                activeOpacity={0.7}
                                className="mr-2.5 px-5 py-2.5 rounded-full border border-border bg-white"
                            >
                                <Text className="text-primary text-sm font-semibold">{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <View className="py-16 items-center">
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <>
                        {/* Spotlight */}
                        {spotlight && (
                            <View className="px-5 mb-10">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-2xl font-extrabold text-primary">The Edit</Text>
                                    <TouchableOpacity onPress={() => router.push("/shop")} className="flex-row items-center gap-1" hitSlop={6}>
                                        <Text className="text-secondary text-sm">See All</Text>
                                        <Ionicons name="chevron-forward" size={14} color={COLORS.secondary} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => router.push(`/product/${spotlight._id}`)}
                                    activeOpacity={0.9}
                                    className="rounded-3xl overflow-hidden bg-surface border border-border"
                                >
                                    <View style={{ height: 320 }} className="relative bg-gray-100">
                                        <Image source={{ uri: spotlight.images[0] }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                                        <View className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full">
                                            <Text className="text-primary text-xs font-bold uppercase tracking-wide">Editor&apos;s Pick</Text>
                                        </View>
                                    </View>
                                    <View className="p-5 flex-row items-center justify-between">
                                        <View className="flex-1 mr-3">
                                            <Text numberOfLines={1} className="text-primary font-bold text-lg">{spotlight.name}</Text>
                                            {getCategoryLabel(spotlight) && (
                                                <Text className="text-secondary text-sm mt-1">{getCategoryLabel(spotlight)}</Text>
                                            )}
                                        </View>
                                        <Text className="text-primary font-extrabold text-xl">${spotlight.price.toFixed(2)}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Trending masonry grid */}
                        {trending.length > 0 && (
                            <View className="px-5 mb-10">
                                <Text className="text-2xl font-extrabold text-primary mb-4">Trending Now</Text>
                                <View className="flex-row gap-3">
                                    <View className="flex-1">
                                        {leftColumn.map((product, i) => (
                                            <TrendingCard
                                                key={product._id}
                                                product={product}
                                                height={trendingHeights[(i * 2) % trendingHeights.length]}
                                                onPress={() => router.push(`/product/${product._id}`)}
                                            />
                                        ))}
                                    </View>
                                    <View className="flex-1">
                                        {rightColumn.map((product, i) => (
                                            <TrendingCard
                                                key={product._id}
                                                product={product}
                                                height={trendingHeights[(i * 2 + 1) % trendingHeights.length]}
                                                onPress={() => router.push(`/product/${product._id}`)}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* New In numbered list */}
                        {newArrivals.length > 0 && (
                            <View className="px-5 mb-10">
                                <Text className="text-2xl font-extrabold text-primary mb-4">New In</Text>
                                <View className="bg-white rounded-2xl border border-border overflow-hidden">
                                    {newArrivals.map((product, i) => (
                                        <TouchableOpacity
                                            key={product._id}
                                            onPress={() => router.push(`/product/${product._id}`)}
                                            activeOpacity={0.7}
                                            className={`flex-row items-center p-3 ${i !== newArrivals.length - 1 ? "border-b border-border" : ""}`}
                                        >
                                            <Text className="text-gray-300 text-2xl font-extrabold w-9">{String(i + 1).padStart(2, "0")}</Text>
                                            <Image source={{ uri: product.images[0] }} className="w-14 h-14 rounded-xl bg-gray-100 mr-3" resizeMode="cover" />
                                            <View className="flex-1 mr-2">
                                                <Text numberOfLines={1} className="text-primary font-semibold text-sm">{product.name}</Text>
                                                {getCategoryLabel(product) && (
                                                    <Text className="text-secondary text-xs mt-0.5">{getCategoryLabel(product)}</Text>
                                                )}
                                            </View>
                                            <Text className="text-primary font-bold text-sm mr-2">${product.price.toFixed(2)}</Text>
                                            <Ionicons name="chevron-forward" size={16} color={COLORS.secondary} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                )}

                {/* Newsletter — full-bleed dark block */}
                <View className="bg-primary px-6 py-10 items-center">
                    <Text className="text-white text-2xl font-extrabold text-center mb-2">Join The List</Text>
                    <Text className="text-white/70 text-sm text-center mb-6 px-4">
                        Get 10% off your first order plus early access to new drops.
                    </Text>
                    <View className="flex-row w-full gap-2">
                        <View className="flex-1 bg-white/10 rounded-full px-4 justify-center" style={{ height: 48 }}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                className="text-white text-sm"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="done"
                                onSubmitEditing={handleSubscribe}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSubscribe}
                            className="bg-white px-6 rounded-full items-center justify-center"
                            style={{ height: 48 }}
                        >
                            <Text className="text-primary font-bold text-sm">Join</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
