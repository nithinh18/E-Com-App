"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { getStatusColor } from "@/constants";

const STATUSES = ["placed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    const fetchOrders = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get("/orders/admin/all", { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) setOrders(data.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStatus = async (newStatus: string) => {
        if (!selectedOrder) return;
        setUpdating(true);
        try {
            const token = await getToken();
            const { data } = await api.put(
                `/orders/${selectedOrder._id}/status`,
                { orderStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success("Order status updated");
                setSelectedOrder(null);
                fetchOrders();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="text-secondary text-sm">Loading...</p>;

    return (
        <div>
            <h1 className="text-2xl font-extrabold text-primary mb-6">Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center">
                    <p className="text-secondary text-sm">No orders found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-border rounded-2xl p-5">
                            <div className="flex justify-between mb-3">
                                <span className="font-medium text-sm text-gray-400">Order #{order._id}</span>
                                <span className="text-secondary text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="bg-surface rounded-xl p-3 mb-3">
                                <p className="text-xs font-bold text-secondary mb-1">CUSTOMER</p>
                                <p className="font-medium text-primary">{order.user?.name || "Unknown User"}</p>
                                <p className="text-xs text-secondary">{order.user?.email || "No email"}</p>
                            </div>

                            <div className="mb-3">
                                <p className="text-xs font-bold text-secondary mb-2">ITEMS</p>
                                {order.items.map((item: any) => (
                                    <div key={item._id} className="flex justify-between text-sm mb-1">
                                        <span className="text-secondary">
                                            {item.quantity}x {item.product?.name || item.name}
                                        </span>
                                        <span className="text-secondary font-bold">₹{item.price.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="font-bold text-primary text-lg">₹{order.totalAmount.toFixed(2)}</span>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}
                                >
                                    {order.orderStatus} <Pencil size={12} className="opacity-60" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-primary">Update Order Status</h3>
                            <button onClick={() => setSelectedOrder(null)}>
                                <X size={20} className="text-secondary" />
                            </button>
                        </div>
                        {updating ? (
                            <p className="text-center text-secondary text-sm py-8">Updating status...</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {STATUSES.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(status)}
                                        className={`p-3 rounded-xl text-left font-medium capitalize transition-colors ${
                                            selectedOrder.orderStatus === status ? "bg-primary/10 font-bold text-primary" : "bg-surface text-secondary"
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
