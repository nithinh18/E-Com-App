"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Package, Receipt } from "lucide-react";

const LINKS = [
    { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
    { href: "/admin/products", label: "Products", icon: Package, exact: false },
    { href: "/admin/orders", label: "Orders", icon: Receipt, exact: false },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <div className="bg-white border-b border-border">
            <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
                <nav className="flex items-center gap-1">
                    {LINKS.map((link) => {
                        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    active ? "bg-primary text-white" : "text-secondary hover:bg-surface"
                                }`}
                            >
                                <Icon size={15} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
                    <LogOut size={15} /> Exit Admin
                </Link>
            </div>
        </div>
    );
}
