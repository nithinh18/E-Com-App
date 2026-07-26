"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, Truck } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import type { Address } from "@/constants/types";
import AddressForm from "@/components/AddressForm";

const SHIPPING = 2.0;
const TAX = 0;

export default function CheckoutPage() {
    const router = useRouter();
    const { getToken } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();

    const [pageLoading, setPageLoading] = useState(true);
    const [address, setAddress] = useState<Address | null>(null);
    const [editingAddress, setEditingAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");
    const [placing, setPlacing] = useState(false);

    const total = cartTotal + SHIPPING + TAX;

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get("/addresses", { headers: { Authorization: `Bearer ${token}` } });
                if (data.data?.length > 0) setAddress(data.data[0]);
                else setEditingAddress(true);
            } catch (error) {
                console.error("Failed to load address:", error);
            } finally {
                setPageLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlaceOrder = async () => {
        if (!address) {
            toast.error("Please add a shipping address");
            return;
        }

        setPlacing(true);
        try {
            const token = await getToken();
            const shippingAddress = {
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
            };

            const { data: orderData } = await api.post(
                "/orders",
                { shippingAddress, notes: "Placed via website", paymentMethod },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!orderData.success) throw new Error("Failed to create order");
            const orderId = orderData.data._id;

            if (paymentMethod === "stripe") {
                const origin = window.location.origin;
                try {
                    const { data: sessionData } = await api.post(
                        "/payments/checkout-session",
                        {
                            items: cartItems,
                            shipping: SHIPPING,
                            orderId,
                            success_url: `${origin}/account/orders`,
                            cancel_url: `${origin}/checkout`,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (sessionData.url) {
                        window.location.href = sessionData.url;
                        return;
                    }
                    throw new Error("No checkout URL returned");
                } catch (err) {
                    console.error("Stripe checkout failed:", err);
                    toast.error("Card payment is unavailable right now. Please try Cash on Delivery.");
                    setPlacing(false);
                    return;
                }
            }

            await clearCart();
            toast.success("Order placed successfully!");
            router.replace("/account/orders");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setPlacing(false);
        }
    };

    if (pageLoading) {
        return <div className="mx-auto max-w-5xl px-6 py-24 text-center text-secondary text-sm">Loading checkout...</div>;
    }

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">
            <h1 className="text-3xl font-extrabold text-primary mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-primary">Shipping Address</h2>
                            {address && !editingAddress && (
                                <button onClick={() => setEditingAddress(true)} className="text-sm font-semibold text-accent">
                                    Edit
                                </button>
                            )}
                        </div>

                        {editingAddress ? (
                            <AddressForm
                                address={address}
                                onSaved={(saved) => {
                                    setAddress(saved);
                                    setEditingAddress(false);
                                }}
                                onCancel={address ? () => setEditingAddress(false) : undefined}
                            />
                        ) : address ? (
                            <div className="bg-white border border-border rounded-2xl p-5">
                                <p className="font-bold text-primary mb-1">{address.type}</p>
                                <p className="text-secondary text-sm leading-6">
                                    {address.street}, {address.city}
                                    <br />
                                    {address.state} {address.zipCode}
                                    <br />
                                    {address.country}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-primary mb-4">Payment Method</h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setPaymentMethod("cash")}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
                                    paymentMethod === "cash" ? "border-primary" : "border-border"
                                }`}
                            >
                                <Truck size={22} className="text-primary shrink-0" />
                                <div>
                                    <p className="font-bold text-primary">Cash on Delivery</p>
                                    <p className="text-xs text-secondary">Pay when you receive the order</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setPaymentMethod("stripe")}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
                                    paymentMethod === "stripe" ? "border-primary" : "border-border"
                                }`}
                            >
                                <CreditCard size={22} className="text-primary shrink-0" />
                                <div>
                                    <p className="font-bold text-primary">Pay with Card</p>
                                    <p className="text-xs text-secondary">Credit or Debit Card via Stripe</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl p-6 h-fit sticky top-24">
                    <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-secondary">Subtotal</span>
                        <span className="font-semibold text-primary">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-secondary">Shipping</span>
                        <span className="font-semibold text-primary">₹{SHIPPING.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-secondary">Tax</span>
                        <span className="font-semibold text-primary">₹{TAX.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border mb-4" />
                    <div className="flex justify-between mb-6">
                        <span className="font-bold text-primary text-lg">Total</span>
                        <span className="font-bold text-primary text-lg">₹{total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing || cartItems.length === 0}
                        className="w-full bg-primary text-white font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                        {placing ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
