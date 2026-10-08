import { Programs as ProgramsSection } from "@/components/sections/Programs";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Startup Programs for Aspiring Founders',
    description: 'Join practical startup programs at Setu Startup School to validate your idea, turn it into reality, and build with confidence through guided execution.',
    alternates: {
        canonical: '/programs',
    },
};

export default function ProgramsPage() {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-bg-main flex flex-col items-center">
            {/* Ultra-minimal Header */}
            <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
                <h1 className="text-5xl md:text-5xl font-black text-text-primary tracking-[-0.04em] mb-6">
                    Execution <span className="text-text-primary/40">Engines.</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                    Zero theory. 100% practical validation and growth.
                </p>
            </div>

            <ProgramsSection />
        </div>
    );
}
