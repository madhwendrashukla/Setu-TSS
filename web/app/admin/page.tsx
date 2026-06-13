"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem("adminToken", data.token);
                router.push("/admin/dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Server error. Ensure backend is running.");
        }
    };

    return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="bg-zinc-900 p-10 rounded-2xl border border-white/10 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2 text-white text-center">Admin Portal</h1>
                <p className="text-text-secondary mb-8 text-center">Sign in to manage Startup School</p>
                
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
