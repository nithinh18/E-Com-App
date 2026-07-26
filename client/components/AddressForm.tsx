"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Address } from "@/constants/types";

const TYPES: Address["type"][] = ["Home", "Work", "Other"];

export default function AddressForm({
    address,
    onSaved,
    onCancel,
}: {
    address?: Address | null;
    onSaved: (address: Address) => void;
    onCancel?: () => void;
}) {
    const { getToken } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const [type, setType] = useState<Address["type"]>(address?.type || "Home");
    const [street, setStreet] = useState(address?.street || "");
    const [city, setCity] = useState(address?.city || "");
    const [state, setState] = useState(address?.state || "");
    const [zipCode, setZipCode] = useState(address?.zipCode || "");
    const [country, setCountry] = useState(address?.country || "");
    const [isDefault, setIsDefault] = useState(address?.isDefault ?? true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!street || !city || !state || !zipCode || !country) {
            toast.error("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        try {
            const token = await getToken();
            const payload = { type, street, city, state, zipCode, country, isDefault };
            const { data } = address
                ? await api.put(`/addresses/${address._id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
                : await api.post("/addresses", payload, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("Address saved");
            onSaved(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save address");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6">
            <div className="flex gap-2 mb-4">
                {TYPES.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            type === t ? "bg-primary border-primary text-white" : "bg-white border-border text-primary"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Street Address</label>
            <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main St"
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">City</label>
                    <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">State</label>
                    <input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="NY"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Zip Code</label>
                    <input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="10001"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-secondary mb-1">Country</label>
                    <input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="USA"
                        className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                    {submitting ? "Saving..." : "Save Address"}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="text-sm font-medium text-secondary px-4">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
