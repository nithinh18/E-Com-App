"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import { getStatusColor, formatDate } from "@/constants";
import type { Order } from "@/constants/types";

export default function OrdersPage() {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
                setOrders(data.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mx-auto max-w-3xl px-6 py-16">
            <h1 className="text-2xl font-extrabold text-primary mb-8">My Orders</h1>

            {loading ? (
                <p className="text-secondary text-sm">Loading...</p>
            ) : orders.length === 0 ? (
                <p className="text-secondary text-sm">No orders found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/account/orders/${order._id}`}
                            className="block bg-white border border-border rounded-2xl p-5 hover:border-primary transition-colors"
                        >
                            <div className="flex justify-between mb-3">
                                <span className="font-bold text-primary">Order #{order.orderNumber}</span>
                                <span className="text-secondary text-sm">{formatDate(order.createdAt)}</span>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>

                            <div className="flex gap-2 mb-4">
                                {order.items.slice(0, 5).map((item, idx) => {
                                    const image = typeof item.product === "object" ? item.product?.images?.[0] : item.image;
                                    return (
                                        <div key={idx} className="relative w-12 h-12 rounded-lg bg-surface overflow-hidden border border-border">
                                            {image && <Image src={image} alt={item.name} fill className="object-cover" sizes="48px" />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="text-secondary text-sm">{order.items.length} items</span>
                                <span className="font-bold text-primary text-lg">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
