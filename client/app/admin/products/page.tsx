"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Product } from "@/constants/types";

export default function AdminProducts() {
    const { getToken } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/products", { params: { limit: 9999 } });
            if (data.success) setProducts(data.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteProduct = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = await getToken();
            const { data } = await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                toast.success("Product deleted");
                fetchProducts();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    if (loading) return <p className="text-secondary text-sm">Loading...</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-primary">Products ({products.length})</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center">
                    <p className="text-secondary text-sm">No products found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl bg-surface overflow-hidden shrink-0">
                                {product.images?.[0] && (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-primary truncate">{product.name}</p>
                                <p className="text-secondary text-xs">
                                    {typeof product.category === "string" ? product.category : product.category?.name} · Stock:{" "}
                                    {product.stock} · {product.sizes?.join(", ")}
                                </p>
                                <p className="font-bold text-primary">₹{product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    href={`/admin/products/${product._id}/edit`}
                                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
                                >
                                    <Pencil size={15} className="text-primary" />
                                </Link>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className="w-9 h-9 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors"
                                >
                                    <Trash2 size={15} className="text-primary" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
