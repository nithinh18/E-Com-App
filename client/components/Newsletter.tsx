"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Enter your email to join the list");
            return;
        }
        toast.success("You're on the list! Check your inbox for your code.");
        setEmail("");
    };

    return (
        <section className="bg-primary">
            <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Mail size={20} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Join The List</h2>
                <p className="text-white/60 text-sm mb-6">Get 10% off your first order plus early access to new drops.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none"
                    />
                    <button type="submit" className="bg-white text-primary font-bold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
                        Join
                    </button>
                </form>
            </div>
        </section>
    );
}
