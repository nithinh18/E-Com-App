"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronRight, LogOut, MapPin, Package, ShieldCheck } from "lucide-react";
import { PROFILE_MENU } from "@/constants";

const ICONS: Record<string, React.ElementType> = {
    "My Orders": Package,
    "Shipping Address": MapPin,
};

export default function AccountPage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    const isAdmin = user?.publicMetadata?.role === "admin";

    if (!isLoaded) {
        return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-secondary text-sm">Loading...</div>;
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <div className="flex flex-col items-center mb-10">
                {user?.imageUrl && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm mb-4">
                        <Image src={user.imageUrl} alt={user.fullName || "User"} fill className="object-cover" sizes="80px" />
                    </div>
                )}
                <h1 className="text-xl font-extrabold text-primary">{user?.fullName || "Your Account"}</h1>
                <p className="text-secondary text-sm">{user?.primaryEmailAddress?.emailAddress}</p>

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="mt-4 inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
                    >
                        <ShieldCheck size={16} /> Admin Panel
                    </Link>
                )}
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden mb-6">
                {PROFILE_MENU.map((item, index) => {
                    const Icon = ICONS[item.title] || Package;
                    return (
                        <Link
                            key={item.id}
                            href={item.route}
                            className={`flex items-center p-4 hover:bg-surface transition-colors ${
                                index !== PROFILE_MENU.length - 1 ? "border-b border-border" : ""
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mr-4">
                                <Icon size={18} className="text-primary" />
                            </div>
                            <span className="flex-1 font-medium text-primary">{item.title}</span>
                            <ChevronRight size={18} className="text-secondary" />
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 p-4 text-error font-bold hover:bg-surface rounded-2xl transition-colors"
            >
                <LogOut size={18} /> Log Out
            </button>
        </div>
    );
}
