import { StartupsMentored } from "@/components/sections/StartupsMentored";
import { Contact } from "@/components/sections/Contact";
import { FounderManifesto } from "@/components/sections/FounderManifesto";

export const metadata = {
    title: 'About | TheStartupSchool',
    description: 'Empowering the next generation of founders.',
};

// Fetch data from Express Backend
async function getAboutData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function AboutPage() {
    const data = await getAboutData();

    return (
        <div className="bg-bg-main min-h-screen flex flex-col items-center w-full">
            
            {/* Hero Section */}
            <section className="relative w-full px-6 py-20 md:py-32 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none"></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
                    <span className="text-gray-300 tracking-wider uppercase">About The Startup School</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.1] max-w-5xl mx-auto text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 relative z-10">
                    Empowering the Next Generation of <span className="bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent">Founders.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto font-light leading-relaxed mb-12">
                    We don't just teach entrepreneurship; we build entrepreneurs. A curated ecosystem designed to turn "KEEDA" and "HIMMAT" into scalable, high-growth businesses.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-6 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 relative z-10 mb-20">
                <div className="glass-card p-10 md:p-16 rounded-[2rem] border-l-4 border-l-accent-blue">
                    <h2 className="text-3xl font-black mb-6 tracking-tight text-white">Our Mission</h2>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        To democratize access to elite startup mentorship, rigorous tear-downs, and real-world tactical knowledge that is usually gatekept in closed circles. We exist to help builders validate their ideas faster, fail cheaper, and scale smarter.
                    </p>
                </div>
                
                <div className="glass-card p-10 md:p-16 rounded-[2rem] border-l-4 border-l-accent-violet">
                    <h2 className="text-3xl font-black mb-6 tracking-tight text-white">Our Vision</h2>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        To become the definitive launchpad for the world's most ambitious founders. We envision a future where anyone with the courage to build is equipped with the exact playbook, network, and capital required to succeed.
                    </p>
                </div>
            </section>

            {/* Stats / Impact (Placeholder) */}
            <section className="py-24 w-full bg-[#0B0F19] border-y border-white/5 mb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                        <div>
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">50+</div>
                            <div className="text-text-secondary font-medium tracking-wide">Workshops Hosted</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">500+</div>
                            <div className="text-text-secondary font-medium tracking-wide">Founders Mentored</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">10k+</div>
                            <div className="text-text-secondary font-medium tracking-wide">Community Members</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">$10M+</div>
                            <div className="text-text-secondary font-medium tracking-wide">Funding Raised</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Manifesto Section from before */}
            <div className="w-full py-16">
                <FounderManifesto />
            </div>

            {/* Startups Mentored */}
            <StartupsMentored data={data?.mentoredStartups} />

            {/* Contact CTA */}
            <Contact />
            
        </div>
    );
}
