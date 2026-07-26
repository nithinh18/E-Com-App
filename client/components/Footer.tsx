import Link from "next/link";
import { CATEGORIES } from "@/constants";

export default function Footer() {
    return (
        <footer className="mt-auto bg-primary text-white">
            <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <span className="text-lg font-extrabold tracking-tight">NEWEVER</span>
                    <p className="text-white/60 text-sm mt-3 max-w-xs">
                        Fresh drops, honest prices. Shop the edit and find your next favorite piece.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Shop</h4>
                    <ul className="space-y-2">
                        {CATEGORIES.map((cat) => (
                            <li key={cat.id}>
                                <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="text-sm text-white/80 hover:text-white transition-colors">
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Account</h4>
                    <ul className="space-y-2">
                        <li><Link href="/account" className="text-sm text-white/80 hover:text-white transition-colors">Profile</Link></li>
                        <li><Link href="/account/orders" className="text-sm text-white/80 hover:text-white transition-colors">Orders</Link></li>
                        <li><Link href="/wishlist" className="text-sm text-white/80 hover:text-white transition-colors">Wishlist</Link></li>
                        <li><Link href="/cart" className="text-sm text-white/80 hover:text-white transition-colors">Cart</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Support</h4>
                    <ul className="space-y-2">
                        <li><span className="text-sm text-white/80">Shipping &amp; Returns</span></li>
                        <li><span className="text-sm text-white/80">Cash on Delivery</span></li>
                        <li><span className="text-sm text-white/80">Secure Card Payments</span></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 py-5">
                <p className="text-center text-xs text-white/50">© {new Date().getFullYear()} Newever. All rights reserved.</p>
            </div>
        </footer>
    );
}
