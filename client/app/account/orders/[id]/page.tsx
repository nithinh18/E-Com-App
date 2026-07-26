"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { MapPin } from "lucide-react";
import api from "@/lib/api";
import type { Order, Product } from "@/constants/types";

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { getToken } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setOrder(data.data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-secondary text-sm">Loading...</div>;
    }

    if (!order) {
        return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-secondary text-sm">Order not found.</div>;
    }

    const steps = [
        { title: "Order Placed", completed: true },
        { title: "Processing", completed: ["processing", "shipped", "delivered"].includes(order.orderStatus) },
        { title: "Shipped", completed: ["shipped", "delivered"].includes(order.orderStatus) },
        { title: "Delivered", completed: order.orderStatus === "delivered" },
    ];

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="text-2xl font-extrabold text-primary mb-8">Order #{order.orderNumber}</h1>

            <div className="bg-white border border-border rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-primary mb-4">Order Status</h2>
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center relative">
                            {i !== 0 && (
                                <div
                                    className={`absolute top-1.5 right-1/2 w-full h-0.5 ${step.completed ? "bg-primary" : "bg-border"}`}
                                />
                            )}
                            <div className={`w-3.5 h-3.5 rounded-full z-10 ${step.completed ? "bg-primary" : "bg-border"}`} />
                            <span className={`text-xs mt-2 text-center ${step.completed ? "font-bold text-primary" : "text-secondary"}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-primary mb-4">Products</h2>
                <div className="flex flex-col gap-4">
                    {order.items.map((item, index) => {
                        const productData = typeof item.product === "object" ? (item.product as Product) : null;
                        const image = productData?.images?.[0] || item.image;
                        return (
                            <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                                {image && (
                                    <div className="relative w-16 h-16 rounded-lg bg-surface overflow-hidden shrink-0">
                                        <Image src={image} alt={item.name} fill className="object-cover" sizes="64px" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="font-medium text-primary">{item.name}</p>
                                    {item.size && <p className="text-xs text-secondary">Size: {item.size}</p>}
                                    <div className="flex justify-between mt-1">
                                        <span className="font-bold text-primary">₹{item.price}</span>
                                        <span className="text-xs text-secondary">Qty: {item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-primary mb-3">Shipping Details</h2>
                <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                    <p className="text-secondary text-sm">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.zipCode},{" "}
                        {order.shippingAddress?.country}
                    </p>
                </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
                <h2 className="font-bold text-primary mb-4">Payment Summary</h2>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Payment Method</span>
                    <span className="font-medium text-primary capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Payment Status</span>
                    <span
                        className={`font-medium capitalize ${
                            order.paymentStatus === "paid"
                                ? "text-green-600"
                                : order.paymentStatus === "failed"
                                  ? "text-error"
                                  : "text-orange-500"
                        }`}
                    >
                        {order.paymentStatus}
                    </span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Subtotal</span>
                    <span className="text-primary font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Shipping</span>
                    <span className="text-primary font-medium">₹{order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary">Tax</span>
                    <span className="text-primary font-medium">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between">
                    <span className="font-bold text-primary text-lg">Total</span>
                    <span className="font-bold text-primary text-lg">₹{order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
