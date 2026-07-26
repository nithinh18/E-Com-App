import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import api from "@/lib/api";
import type { Product } from "@/constants/types";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";

async function getProduct(id: string): Promise<Product | null> {
    try {
        const { data } = await api.get(`/products/${id}`);
        return data.data as Product;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return { title: "Product not found" };
    return {
        title: product.name,
        description: product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) notFound();

    const rating = product.ratings?.average ?? 0;
    const categoryLabel = typeof product.category === "string" ? product.category : product.category?.name;

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid md:grid-cols-2 gap-12">
                <ProductGallery images={product.images} name={product.name} />

                <div>
                    {categoryLabel && (
                        <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">{categoryLabel}</p>
                    )}
                    <h1 className="text-3xl font-extrabold text-primary mb-3">{product.name}</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-md">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold">{rating > 0 ? rating.toFixed(1) : "New"}</span>
                        </div>
                        {product.ratings?.count > 0 && (
                            <span className="text-xs text-secondary">({product.ratings.count} reviews)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-3xl font-extrabold text-primary">₹{product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                            <span className="text-lg text-secondary line-through">₹{product.comparePrice.toFixed(2)}</span>
                        )}
                    </div>

                    <AddToCartPanel product={product} />

                    <div className="mt-10 pt-8 border-t border-border">
                        <h3 className="text-sm font-bold text-primary mb-2">Description</h3>
                        <p className="text-secondary text-sm leading-6">{product.description}</p>
                    </div>

                    <div className="mt-6 text-xs text-secondary">
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </div>
                </div>
            </div>
        </div>
    );
}
