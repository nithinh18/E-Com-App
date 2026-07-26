"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const SHIPPING = 2.0;

export default function CartPage() {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, isLoading } = useCart();
    const total = cartTotal + SHIPPING;

    if (!isLoading && cartItems.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-5">
                    <ShoppingBag size={30} className="text-secondary" />
                </div>
                <h1 className="text-2xl font-extrabold text-primary mb-2">Your cart is empty</h1>
                <p className="text-secondary text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/shop" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-3xl font-extrabold text-primary mb-8">My Cart</h1>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {cartItems.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-white border border-border rounded-2xl p-4">
                            <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-surface shrink-0">
                                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <p className="font-semibold text-primary truncate">{item.product.name}</p>
                                    {item.size && <p className="text-xs text-secondary mt-1">Size: {item.size}</p>}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1.5">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                                            className="text-secondary hover:text-primary"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                                            className="text-secondary hover:text-primary"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <span className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.productId, item.size)}
                                className="text-secondary hover:text-error self-start"
                                aria-label="Remove item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="bg-surface rounded-2xl p-6 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-secondary">Subtotal</span>
                        <span className="font-semibold text-primary">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-secondary">Shipping</span>
                        <span className="font-semibold text-primary">₹{SHIPPING.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border mb-4" />
                    <div className="flex justify-between mb-6">
                        <span className="font-bold text-primary text-lg">Total</span>
                        <span className="font-bold text-primary text-lg">₹{total.toFixed(2)}</span>
                    </div>
                    <Link
                        href="/checkout"
                        className="block text-center bg-primary text-white font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
