import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { AIWorkshopHero } from './AIWorkshopHero';
import { AIWorkshopStoryline } from './AIWorkshopStoryline';
import { AIWorkshopOutcomes } from './AIWorkshopOutcomes';
import { AIWorkshopMentors } from './AIWorkshopMentors';

const AIWorkshopCurriculum = dynamic(() => import('./AIWorkshopCurriculum').then(m => m.AIWorkshopCurriculum));
const AIWorkshopTestimonials = dynamic(() => import('./AIWorkshopTestimonials').then(m => m.AIWorkshopTestimonials));
const AIWorkshopPricing = dynamic(() => import('./AIWorkshopPricing').then(m => m.AIWorkshopPricing));
const AIWorkshopSchedule = dynamic(() => import('./AIWorkshopSchedule').then(m => m.AIWorkshopSchedule));
const AIWorkshopFinal = dynamic(() => import('./AIWorkshopFinal').then(m => m.AIWorkshopFinal));
import { BottomSheetCTA } from './BottomSheetCTA';

export const metadata: Metadata = {
    title: 'AI Entrepreneurship Workshop Series – May 15–17, 2026 | The Startup School',
    description: 'Build, Validate & Launch Your Startup in 3 Days. Master 12 ideation methods, build AI-powered MVPs with Claude Pro, and create marketing films — live on Zoom with India\'s top mentors.',
    keywords: 'AI workshop, startup workshop, entrepreneurship, Claude Pro, MVP, startup ideation, AI filmmaking, Gaurav Bansal, Atul Pandey, Amey Asuti',
    openGraph: {
        title: 'AI Entrepreneurship Workshop Series – May 15–17, 2026',
        description: 'From billion-dollar ideas to AI-powered MVPs in 3 days. Live on Zoom.',
        type: 'website',
        images: [
            {
                url: 'https://thestartupschool.in/ai-workshop-banner.webp',
                width: 1200,
                height: 630,
                alt: 'AI Startup Launchpad – May 15–17, 2026 | The Startup School',
            },
        ],
    },
};

export default function AIWorkshopPage() {
    return (
        <div className="antialiased relative pb-16" style={{ backgroundColor: '#0f172a', color: '#f8fafc', overflowX: 'hidden' }}>
            {/* Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
            }} />

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        <Link href="/" className="flex-shrink-0 font-extrabold text-lg md:text-2xl tracking-tight flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity">
                            <Image src="/logo.png" alt="The Startup School" width={40} height={40} className="w-7 h-7 md:w-10 md:h-10 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] object-cover" priority />
                            <span className="text-base md:text-2xl">The <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">Startup</span> School</span>
                        </Link>
                        <div>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300" />
                                <a href="#pricing" className="relative inline-flex items-center justify-center px-3 py-1.5 md:px-5 md:py-2.5 text-[11px] md:text-sm font-semibold rounded-lg text-white bg-[#0f172a] border border-white/10 hover:bg-transparent transition-all whitespace-nowrap">
                                    Secure Your Seat
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* All Sections — Conversion-optimised order */}
            <AIWorkshopHero />          {/* 1. Hook */}
            <AIWorkshopStoryline />     {/* 2. Emotional connection */}
            <AIWorkshopCurriculum />    {/* 3. What they'll learn */}
            <AIWorkshopPricing />       {/* 4. Price while intent is highest */}
            <AIWorkshopMentors />       {/* 5. Who delivers it */}
            <AIWorkshopOutcomes />      {/* 6. What they walk away with */}
            <AIWorkshopTestimonials />  {/* 7. Social proof */}
            <AIWorkshopSchedule />      {/* 8. Logistics */}
            <AIWorkshopFinal />         {/* 9. FAQ + final CTA */}

            {/* Footer */}
            <footer className="border-t border-white/5 py-10 bg-[#0A0F1C]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col items-center md:items-start gap-0.5">
                            <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
                                <Image src="/logo.png" alt="The Startup School" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
                                <span>The <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">Startup</span> School</span>
                            </Link>
                            <p className="text-[9px] text-white tracking-wide uppercase pl-10">RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                            <Link href="/terms-of-use" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
                            <a href="mailto:info@thestartupschool.in" className="hover:text-slate-300 transition-colors">info@thestartupschool.in</a>
                        </div>
                        <p className="text-xs text-slate-600">© 2026 The Startup School. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            {/* Fixed CTA — appears after 5s */}
            <BottomSheetCTA />
        </div>
    );
}
