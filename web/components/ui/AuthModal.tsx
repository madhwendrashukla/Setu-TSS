'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
        const body = mode === 'login' 
            ? { email, password }
            : { name, email, password };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            login(data.token, data.user);
            closeAuthModal();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeAuthModal} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in zoom-in-95">
                <button onClick={closeAuthModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <i className="fa-solid fa-xmark text-xl" />
                </button>
                <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
                    {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" required value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-accent-blue"
                        />
                    </div>
                    <button 
                        type="submit" disabled={isLoading}
                        className="w-full py-3 bg-accent-blue text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="font-bold text-accent-blue hover:underline"
                    >
                        {mode === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}
