"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { CATEGORIES } from "@/constants";
import type { Product } from "@/constants/types";

export default function ProductForm({ product }: { product?: Product }) {
    const router = useRouter();
    const { getToken } = useAuth();
    const isEditing = Boolean(product);

    const [name, setName] = useState(product?.name || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price?.toString() || "");
    const [stock, setStock] = useState(product?.stock?.toString() || "");
    const [category, setCategory] = useState(
        (typeof product?.category === "string" ? product?.category : product?.category?.name) || CATEGORIES[0].name
    );
    const [sizes, setSizes] = useState(product?.sizes?.join(", ") || "");
    const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
    const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const totalImages = existingImages.length + newFiles.length;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []).slice(0, 5 - totalImages);
        setNewFiles((prev) => [...prev, ...files]);
        setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        e.target.value = "";
    };

    const removeExisting = (index: number) => setExistingImages((prev) => prev.filter((_, i) => i !== index));
    const removeNew = (index: number) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !sizes) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (totalImages === 0) {
            toast.error("Please add at least one image");
            return;
        }

        setSubmitting(true);
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("stock", stock || "0");
            formData.append("category", category);
            formData.append("isFeatured", String(isFeatured));
            formData.append("sizes", sizes);

            if (isEditing) {
                existingImages.forEach((url) => formData.append("existingImages", url));
            }
            newFiles.forEach((file) => formData.append("images", file));

            const { data } = isEditing
                ? await api.put(`/products/${product!._id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
                : await api.post("/products", formData, { headers: { Authorization: `Bearer ${token}` } });

            if (!data?.success) throw new Error("Save failed");

            toast.success(isEditing ? "Product updated" : "Product created");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 max-w-2xl">
            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Product Name *</label>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Headphones"
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Price (₹) *</label>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Stock Level</label>
                    <input
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        type="number"
                        placeholder="0"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
            </div>

            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none mb-4"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Sizes (comma separated) *</label>
            <input
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="e.g. S, M, L, XL"
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none mb-4"
            />

            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Product Images (max 5)</label>
            <div className="flex flex-wrap gap-3 mb-4">
                {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface">
                        <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                        <button
                            type="button"
                            onClick={() => removeExisting(i)}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                        >
                            <X size={12} className="text-white" />
                        </button>
                    </div>
                ))}
                {newPreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary">
                        <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                        <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 bg-primary rounded-full p-1">
                            <X size={12} className="text-white" />
                        </button>
                    </div>
                ))}
                {totalImages < 5 && (
                    <label className="w-24 h-24 rounded-lg bg-surface border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <ImagePlus size={20} className="text-secondary" />
                        <span className="text-[10px] text-secondary mt-1">Add</span>
                        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                )}
            </div>

            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none mb-4 resize-none"
            />

            <label className="flex items-center justify-between mb-6 cursor-pointer">
                <span className="font-bold text-primary text-sm">Featured Product</span>
                <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                />
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
                {submitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </button>
        </form>
    );
}
