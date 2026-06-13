import { Metadata } from 'next';
import Link from 'next/link';
import FinancialModeler from '@/components/tools/FinancialModeler';

export const metadata: Metadata = {
    title: 'Financial Modeler & Runway Calculator | Setu - TheStartupSchool',
    description: 'Interactive dashboard to calculate your startup runway, burn rate, and default alive status.',
};

export default function FinancialModelerPage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-12">
                    <Link href="/tools" className="text-text-secondary hover:text-white transition-colors text-sm font-medium tracking-wide flex items-center gap-2 mb-8 w-fit">
                        <span>&larr;</span> Back to Tools
                    </Link>
                    <span className="text-accent-violet text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Interactive Tool</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Financial <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Modeler.</span>
                    </h1>
                    <p className="text-xl text-text-secondary font-light max-w-3xl leading-relaxed">
                        Input your current financials below to instantly calculate your runtime, net burn, and visualize your cash projection. Understand exactly when you hit zero cash.
                    </p>
                </div>

                {/* The Interactive Client Component */}
                <FinancialModeler />

            </div>
        </div>
    );
}
