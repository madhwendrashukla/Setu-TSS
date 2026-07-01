import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { globalPitchDecksData } from '@/lib/data/globalPitchDecks';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

// Generate metadata for each pitch deck
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const deck = globalPitchDecksData.find((d) => d.id.toLowerCase() === resolvedParams.id.toLowerCase());

    if (!deck) {
        return {
            title: 'Pitch Deck Not Found | Setu - TheStartupSchool',
        };
    }

    return {
        title: `${deck.company} Pitch Deck - ${deck.round} (${deck.year}) | Setu - TheStartupSchool`,
        description: deck.tagline,
    };
}

// Pre-render all pitch deck pages
export async function generateStaticParams() {
    return globalPitchDecksData.map((deck) => ({
        id: deck.id,
    }));
}

export default async function PitchDeckDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const deck = globalPitchDecksData.find((d) => d.id.toLowerCase() === resolvedParams.id.toLowerCase());

    if (!deck) {
        notFound();
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header navigation */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/tools/pitch-decks" className="text-text-secondary hover:text-gray-900 transition-colors text-sm font-medium tracking-wide flex items-center gap-2 mb-4 w-fit">
                            <span>&larr;</span> Back to Pitch Decks
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                            {deck.company} <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Pitch Deck.</span>
                        </h1>
                    </div>

                    {/* Download Button */}
                    <a
                        href={deck.fileUrl}
                        download
                        className="btn-primary inline-flex items-center gap-2 px-6 py-3 shrink-0 self-start md:self-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                    </a>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-1">Sector</span>
                        <span className="font-medium text-gray-900">{deck.sector}</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-1">Round & Year</span>
                        <span className="font-medium text-gray-900">{deck.round} ({deck.year})</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-1">Raised</span>
                        <span className="font-medium text-gray-900">{deck.raisedThisRound}</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                        <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-1">Total Funding</span>
                        <span className="font-medium text-gray-900">{deck.totalRaised}</span>
                    </div>
                </div>

                {/* Key Lesson */}
                <div className="p-6 md:p-8 rounded-3xl bg-accent-blue/5 border border-accent-blue/20 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-[50px]"></div>
                    <h3 className="text-sm font-bold text-accent-blue uppercase tracking-widest mb-3">Key Lesson from {deck.company}</h3>
                    <p className="text-lg md:text-xl text-gray-900 font-light leading-relaxed">
                        {deck.keyLesson}
                    </p>
                </div>

                {/* Mobile Fallback: Direct PDF Link */}
                <div className="md:hidden shadow-sm p-8 rounded-3xl border border-gray-200 text-center flex flex-col items-center justify-center gap-6 mt-8">
                    <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to read the {deck.company} deck?</h4>
                        <p className="text-sm text-text-secondary">Mobile browsers handle PDFs best in a separate tab.</p>
                    </div>
                    <a
                        href={deck.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full py-4 uppercase tracking-widest text-sm font-bold shadow-[0_0_30px_rgba(100,150,255,0.3)] mt-2"
                    >
                        Tap to Open PDF
                    </a>
                </div>

                {/* Desktop PDF Viewer */}
                <div className="hidden md:block rounded-3xl border border-gray-200 overflow-hidden bg-bg-main shadow-2xl shadow-black/50" style={{ height: '80vh' }}>
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium text-text-secondary">{deck.fileUrl.split('/').pop()}</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <iframe
                        src={`${deck.fileUrl}#view=FitH`}
                        title={`${deck.company} Pitch Deck`}
                        className="w-full h-full border-none object-contain bg-black"
                    />
                </div>

            </div>
        </div>
    );
}
