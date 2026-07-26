import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
    title: "Shop",
    description: "Browse the full Newever catalog — Men's, Women's, Kids', Shoes, and Bags.",
};

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-10 text-secondary text-sm">Loading...</div>}>
            <ShopClient />
        </Suspense>
    );
}
