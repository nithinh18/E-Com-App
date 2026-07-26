"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import api from "@/lib/api";
import { getStatusColor } from "@/constants";
import type { AdminStats } from "@/constants/types";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
    const { getToken } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get("/admin/stats", { headers: { Authorization: `Bearer ${token}` } });
                if (data.success) setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <p className="text-secondary text-sm">Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-extrabold text-primary mb-6">Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue ?? 0).toFixed(2)}`} />
                <StatCard label="Total Orders" value={String(stats?.totalOrders ?? 0)} />
                <StatCard label="Products" value={String(stats?.totalProducts ?? 0)} />
                <StatCard label="Users" value={String(stats?.totalUsers ?? 0)} />
            </div>

            <h2 className="text-xl font-extrabold text-primary mb-4">Recent Orders</h2>
            {!stats?.recentOrders?.length ? (
                <div className="bg-white border border-border rounded-2xl p-8 text-center">
                    <p className="text-secondary text-sm">No recent orders</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {stats.recentOrders.map((order: any) => (
                        <div key={order._id} className="bg-white border border-border rounded-2xl p-5">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-bold text-primary">
                                    Items: {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                                </p>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="text-secondary text-sm">{order.user?.name || "Unknown User"}</span>
                                <span className="font-bold text-primary text-lg">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
