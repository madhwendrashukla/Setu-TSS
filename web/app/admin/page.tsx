"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
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
                setIsLoading(false);
            }
        } catch (err) {
            setError("Server error. Ensure backend is running.");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0F1C]">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-blue/30 blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <Link href="/" className="flex justify-center mb-8 hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]">STARTUP</span> SCHOOL
                    </span>
                </Link>

                <div className="shadow-sm rounded-[2rem] p-8 md:p-10 border border-gray-200 shadow-[0_0_80px_rgba(139,92,246,0.15)] backdrop-blur-xl bg-white">
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center tracking-tight">Admin Portal</h1>
                    <p className="text-gray-400 mb-8 text-center text-sm font-light uppercase tracking-widest">Secure Access Only</p>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent-blue transition-colors">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all backdrop-blur-md"
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent-blue transition-colors">
                                <i className="fas fa-lock"></i>
                            </div>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-white/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all backdrop-blur-md"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="mt-4 relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-gray-900 font-bold py-3.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</>
                                ) : (
                                    <>Sign In <i className="fas fa-arrow-right text-sm"></i></>
                                )}
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
