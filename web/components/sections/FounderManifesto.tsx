import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export function FounderManifesto() {
    return (
        <section id="manifesto" className="w-full bg-bg-main py-24 px-6 relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
                {/* Small Heading Pill */}
                <div className="flex justify-center mb-16">
                    <span className="text-[#A855F7] bg-white border border-[#A855F7]/40 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-sm">
                        The Founder's Manifesto
                    </span>
                </div>
                {/* Header */}
                <div className="flex items-center gap-5 mb-12">
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 border-2 border-functional-border">
                        <Image
                            src="/gaurav.webp"
                            alt="Gaurav Bansal"
                            width={72}
                            height={72}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-text-primary text-3xl font-bold tracking-tight">Gaurav Bansal</h3>
                        <a href="https://www.linkedin.com/in/gauravbansal2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#A855F7] text-sm font-semibold hover:underline mt-1 transition-all">
                            <Linkedin className="w-4 h-4" /> Connect on LinkedIn
                        </a>
                    </div>
                </div>

                {/* Content with Left Border */}
                <div className="border-l-[3px] border-[#A855F7] pl-8 space-y-7 text-text-secondary text-base md:text-[17px] leading-[1.8]">
                    
                    <h2 className="text-[28px] md:text-[36px] font-bold text-black leading-[1.3] mb-8 tracking-tight">
                        “दिल में हो आग तो जलती रहनी चाहिए,<br />
                        तेरा हो चाहे मेरा,<br />
                        <span className="text-[#A855F7]">सपना ज़िंदा रहना चाहिए!</span>”
                    </h2>

                    <p>
                        Startups in India aren't built in garages; they are built at <span className="text-black font-bold">kitchen tables</span> amidst family debates, silent sacrifices, and financial anxiety.
                    </p>

                    <p>
                        In a country like <span className="text-black font-bold">BHARAT</span>, the &ldquo;Opportunity Cost&rdquo; isn't just a line on a spreadsheet — it is a weight on a founder's soul.
                    </p>

                    <p>
                        For the middle-class dreamer, choosing a startup over a steady paycheck is an act of war against social security.
                    </p>

                    <p>
                        A startup's greatest enemy isn't competition — it's the <span className="text-black font-bold">&ldquo;Initial Days Vacuum&rdquo;</span>. We talk about &ldquo;funding&rdquo;, but we forget about &ldquo;foundation&rdquo;.
                    </p>

                    <p>
                        Many have the <span className="text-black font-bold">'Keeda'</span> (the itch) and the <span className="text-black font-bold">'Himmat'</span> (the courage), but courage without a compass is just a slow way to get lost.
                    </p>

                    <p>
                        The ecosystem treats early-stage startups like athletes; in reality, they need to be treated like infants.
                    </p>

                    <p>
                        If you don't hold the hand that is trying to build, that hand will eventually reach for a corporate cubicle just to survive.
                    </p>

                    <p>
                        I believe tactical, hands-on support in the first 100 days is more valuable than a seed check in the first 300.
                    </p>

                    <p>
                        Outliers don't die because they lack talent — they die because they lack a map.
                    </p>

                    <p>
                        If we provide the right scaffolding to the aspiring founder, we won't just see more startups — we will unlock an era of <span className="text-black font-bold">unstoppable builders.</span>
                    </p>

                    <p>
                        It doesn't matter whose hand holds the torch, as long as the darkness is defeated.
                    </p>

                    <p>
                        I am not here to just invest; I am here to ensure the fire doesn't go out before the sun rises.
                    </p>

                </div>
            </div>
        </section>
    );
}
