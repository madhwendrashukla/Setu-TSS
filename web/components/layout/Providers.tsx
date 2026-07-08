'use client';

import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/ui/AuthModal';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
            <AuthModal />
        </AuthProvider>
    );
}
