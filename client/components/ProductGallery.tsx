"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
    const [active, setActive] = useState(0);
    const displayImages = images.length > 0 ? images : ["https://placehold.co/800x1000?text=No+Image"];

    return (
        <div className="flex gap-4">
            {displayImages.length > 1 && (
                <div className="flex flex-col gap-3">
                    {displayImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                active === i ? "border-primary" : "border-transparent"
                            }`}
                        >
                            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                        </button>
                    ))}
                </div>
            )}
            <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-surface">
                <Image src={displayImages[active]} alt={name} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
        </div>
    );
}
