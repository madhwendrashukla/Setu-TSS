import Image from 'next/image';

export const metadata = {
    title: 'About Us | Setu - TheStartupSchool',
    description: 'Learn about our mission to empower the next generation of founders.',
};

export default function AboutPage() {
    return (
        <div className="pt-24 pb-20 min-h-screen bg-bg-main flex flex-col items-center">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-6 mb-20 text-center relative w-full mt-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-blue/10 via-bg-main/5 to-transparent blur-3xl -z-10"></div>
                <h1 className="text-6xl md:text-7xl font-black text-white tracking-[-0.04em] mb-6">
                    Our <span className="text-white/40">Mission.</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed max-w-3xl mx-auto">
                    We are building the bridge for the next generation of visionary founders, equipping them with the right mindset, mentorship, and resources to build the future.
                </p>
            </div>

            {/* Core Values Section */}
            <div className="w-full max-w-6xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value 1 */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-accent-blue/20 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Innovation First</h3>
                        <p className="text-text-secondary leading-relaxed">
                            We encourage breaking the mold and questioning the status quo. Innovation is at the heart of every startup we mentor.
                        </p>
                    </div>

                    {/* Value 2 */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Community Led</h3>
                        <p className="text-text-secondary leading-relaxed">
                            Building a startup is hard, but you don't have to do it alone. We foster a tight-knit community of ambitious founders.
                        </p>
                    </div>

                    {/* Value 3 */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Real Impact</h3>
                        <p className="text-text-secondary leading-relaxed">
                            We don't just teach theory. We focus on execution, traction, and building products that people actually want and pay for.
                        </p>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="w-full max-w-5xl mx-auto px-6 mb-24 text-center">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em] mb-8">
                    Our <span className="text-white/40">Vision.</span>
                </h2>
                <div className="bg-gradient-to-r from-white/5 to-white/5 border border-white/10 p-10 md:p-14 rounded-3xl backdrop-blur-md">
                    <p className="text-xl md:text-2xl text-text-secondary leading-relaxed italic">
                        "To be the catalyst that transforms raw entrepreneurial talent into world-class companies, building a thriving ecosystem where innovation knows no bounds."
                    </p>
                </div>
            </div>

        </div>
    );
}
