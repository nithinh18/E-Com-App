"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import api from "@/lib/api";
import type { Address } from "@/constants/types";
import AddressForm from "@/components/AddressForm";

export default function AddressPage() {
    const { getToken } = useAuth();
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = await getToken();
                const { data } = await api.get("/addresses", { headers: { Authorization: `Bearer ${token}` } });
                if (data.data?.length > 0) setAddress(data.data[0]);
                else setEditing(true);
            } catch (error) {
                console.error("Failed to load address:", error);
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <h1 className="text-2xl font-extrabold text-primary mb-8">Shipping Address</h1>

            {loading ? (
                <p className="text-secondary text-sm">Loading...</p>
            ) : editing ? (
                <AddressForm
                    address={address}
                    onSaved={(saved) => {
                        setAddress(saved);
                        setEditing(false);
                    }}
                    onCancel={address ? () => setEditing(false) : undefined}
                />
            ) : address ? (
                <div className="bg-white border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-primary">{address.type}</span>
                        <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-sm font-semibold text-accent">
                            <Pencil size={14} /> Edit
                        </button>
                    </div>
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
    );
}
