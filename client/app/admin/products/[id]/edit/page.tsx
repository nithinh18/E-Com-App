"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import type { Product } from "@/constants/types";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                if (data.success) setProduct(data.data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    return (
        <div>
            <h1 className="text-2xl font-extrabold text-primary mb-6">Edit Product</h1>
            {loading ? (
                <p className="text-secondary text-sm">Loading...</p>
            ) : product ? (
                <ProductForm product={product} />
            ) : (
                <p className="text-secondary text-sm">Product not found.</p>
            )}
        </div>
    );
}
