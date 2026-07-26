import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";
import type { Product } from "@/constants/types";
import { CATEGORIES } from "@/constants";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import Newsletter from "@/components/Newsletter";

async function getProducts(): Promise<Product[]> {
    try {
        const { data } = await api.get("/products", { params: { limit: 200 } });
        return data.data as Product[];
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop";

export default async function Home() {
    const products = await getProducts();
    const featured = products.filter((p) => p.isFeatured).slice(0, 4);
    const popular = products.slice(0, 8);
    const newArrivals = [...products].reverse().slice(0, 8);

    return (
        <>
            {/* Hero */}
            <section className="relative h-160 w-full overflow-hidden bg-gray-300">
                <Image src={HERO_IMAGE} alt="New season arrivals" fill priority className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                <div className="relative h-full mx-auto max-w-7xl px-6 flex flex-col justify-end pb-20">
                    <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-[1.05] max-w-2xl">
                        New Season
                        <br />
                        Arrivals
                    </h1>
                    <p className="text-white/80 text-lg mt-4 max-w-md">Fresh styles just dropped — up to 50% off select items.</p>
                    <div className="flex items-center gap-4 mt-8">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
                        >
                            Shop Now <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/shop?category=Men"
                            className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            Explore Men&apos;s
                        </Link>
                    </div>
                </div>
            </section>

            <Marquee />

            {/* Categories */}
            <section className="mx-auto max-w-7xl px-6 py-16">
                <h2 className="text-2xl font-extrabold text-primary mb-8">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className="group relative aspect-square rounded-2xl bg-surface border border-border overflow-hidden flex items-end p-4 hover:border-primary transition-colors"
                        >
                            <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-primary">Featured</h2>
                        <Link href="/shop" className="text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1">
                            See All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featured.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Popular */}
            <section className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-primary">Popular</h2>
                    <Link href="/shop" className="text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1">
                        See All <ArrowRight size={14} />
                    </Link>
                </div>
                {popular.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {popular.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary text-sm">No products available right now.</p>
                )}
            </section>

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-8 pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-primary">New Arrivals</h2>
                        <Link href="/shop" className="text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1">
                            See All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            <Newsletter />
        </>
    );
}
