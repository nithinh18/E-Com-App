"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import { CATEGORIES } from "@/constants";
import type { Product } from "@/constants/types";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
];

export default function ShopClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";
    const min = searchParams.get("min") || "";
    const max = searchParams.get("max") || "";
    const page = Number(searchParams.get("page") || "1");

    const [searchInput, setSearchInput] = useState(q);

    useEffect(() => {
        setSearchInput(q);
    }, [q]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/products", { params: { limit: 200 } });
                setAllProducts(data.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        if (!("page" in updates)) params.delete("page");
        router.push(`/shop?${params.toString()}`);
    };

    const filtered = useMemo(() => {
        let list = [...allProducts];

        if (q) {
            const term = q.toLowerCase();
            list = list.filter((p) => p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term));
        }
        if (category) {
            list = list.filter((p) => {
                const catName = typeof p.category === "string" ? p.category : p.category?.name;
                return catName === category;
            });
        }
        if (min) list = list.filter((p) => p.price >= Number(min));
        if (max) list = list.filter((p) => p.price <= Number(max));

        if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return list;
    }, [allProducts, q, category, sort, min, max]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const clearFilters = () => router.push("/shop");

    const activeFilterCount = [category, min, max].filter(Boolean).length;

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary">Shop</h1>
                    <p className="text-secondary text-sm mt-1">{filtered.length} products</p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateParams({ q: searchInput || null });
                    }}
                    className="flex items-center bg-surface rounded-full px-4 py-2.5 gap-2 w-full md:w-80 border border-transparent focus-within:border-border"
                >
                    <Search size={16} className="text-secondary shrink-0" />
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search products..."
                        className="bg-transparent text-sm w-full outline-none"
                    />
                </form>
            </div>

            <div className="flex gap-10">
                {/* Sidebar filters (desktop) */}
                <aside className="hidden lg:block w-56 shrink-0">
                    <FilterPanel
                        category={category}
                        min={min}
                        max={max}
                        onCategoryChange={(c) => updateParams({ category: c })}
                        onPriceApply={(minVal, maxVal) => updateParams({ min: minVal || null, max: maxVal || null })}
                        onClear={clearFilters}
                    />
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-border rounded-full px-4 py-2"
                        >
                            <SlidersHorizontal size={14} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-secondary hidden sm:inline">Sort:</span>
                            <select
                                value={sort}
                                onChange={(e) => updateParams({ sort: e.target.value })}
                                className="text-sm border border-border rounded-full px-3 py-2 bg-white outline-none"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-2xl bg-surface animate-pulse" />
                            ))}
                        </div>
                    ) : pageItems.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-secondary">No products found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {pageItems.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-12">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateParams({ page: String(i + 1) })}
                                            className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                                                currentPage === i + 1 ? "bg-primary text-white" : "text-secondary hover:bg-surface"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile filter drawer */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-primary">Filters</h3>
                            <button onClick={() => setShowFilters(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <FilterPanel
                            category={category}
                            min={min}
                            max={max}
                            onCategoryChange={(c) => {
                                updateParams({ category: c });
                                setShowFilters(false);
                            }}
                            onPriceApply={(minVal, maxVal) => {
                                updateParams({ min: minVal || null, max: maxVal || null });
                                setShowFilters(false);
                            }}
                            onClear={() => {
                                clearFilters();
                                setShowFilters(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterPanel({
    category,
    min,
    max,
    onCategoryChange,
    onPriceApply,
    onClear,
}: {
    category: string;
    min: string;
    max: string;
    onCategoryChange: (c: string) => void;
    onPriceApply: (min: string, max: string) => void;
    onClear: () => void;
}) {
    const [minInput, setMinInput] = useState(min);
    const [maxInput, setMaxInput] = useState(max);

    useEffect(() => setMinInput(min), [min]);
    useEffect(() => setMaxInput(max), [max]);

    return (
        <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Category</h4>
            <div className="flex flex-col gap-2 mb-8">
                <button
                    onClick={() => onCategoryChange("")}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        !category ? "bg-primary text-white font-semibold" : "text-secondary hover:bg-surface"
                    }`}
                >
                    All
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.name)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                            category === cat.name ? "bg-primary text-white font-semibold" : "text-secondary hover:bg-surface"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Price Range</h4>
            <div className="flex items-center gap-2 mb-4">
                <input
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    placeholder="Min"
                    type="number"
                    className="w-full bg-surface rounded-lg px-3 py-2 text-sm outline-none"
                />
                <span className="text-secondary">–</span>
                <input
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    placeholder="Max"
                    type="number"
                    className="w-full bg-surface rounded-lg px-3 py-2 text-sm outline-none"
                />
            </div>
            <button
                onClick={() => onPriceApply(minInput, maxInput)}
                className="w-full text-sm font-semibold bg-primary text-white rounded-full py-2 mb-3 hover:bg-primary/90 transition-colors"
            >
                Apply
            </button>
            <button onClick={onClear} className="w-full text-sm font-medium text-secondary hover:text-primary py-2">
                Clear all filters
            </button>
        </div>
    );
}
