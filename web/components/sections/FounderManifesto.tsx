import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export function FounderManifesto({ headings = {} }: { headings?: any }) {
    return (
        <section id="manifesto" className="w-full bg-bg-main py-24 px-6 relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
                {/* Small Heading Pill */}
                <div className="flex justify-center mb-16">
                    <span
                        className="text-[#A855F7] bg-white border border-[#A855F7]/40 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-sm"
                        dangerouslySetInnerHTML={{ __html: headings?.prefix || 'The Founder\'s Manifesto.' }}
                    />
                </div>

                {/* Header */}
                <div className="flex items-center gap-5 mb-12">
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 border-2 border-functional-border shadow-sm">
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
                        <a
                            href="https://www.linkedin.com/in/gauravbansal2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#A855F7] text-sm font-semibold hover:underline mt-1 transition-all"
                        >
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
                        Knowledge not only removes the darkness of doubts and fears but also gives you the confidence to start right, the courage to aim for the sky.
                    </p>

                    <p>
                        Many promising startups fade into oblivion, not because their founders lack passion or ideas, but because they lack the right knowledge, guidance, and access to resources at the right time.
                    </p>

                    <p>
                        My mission is not just to give founders real courage and strength through knowledge, but <span className="text-[#A855F7] font-bold">also to give rocket speed to their dreams</span> by providing access to the right resources.
                    </p>

                    <p>
                        <span className="text-[#A855F7] font-bold">Having built startups in my career</span>, I have experienced these challenges up close and felt this pain firsthand.
                    </p>

                    <p>
                        India today has thousands of B-schools. Yet, a fundamental question remains: Are they producing an equal number of startups? And more importantly, <span className="text-[#A855F7] font-bold">what percentage of aspiring founders would realistically invest two years and ₹10-30 lakhs in a B-School simply to learn how to build a successful startup?</span>
                    </p>

                    <p>
                        Additionally for the middle-class dreamer, choosing a startup over a steady paycheck is an act of war against social security. For a founder <span className="text-[#A855F7] font-bold">the &ldquo;Opportunity Cost&rdquo; of building a startup</span> isn&apos;t just a line on a spreadsheet, it is a weight on a founder&apos;s soul, because Startups in India aren&apos;t built in garages, they are built at kitchen tables amidst family debates, silent sacrifices, and financial anxiety.
                    </p>

                    <p>
                        A startup&apos;s greatest enemy isn&apos;t competition, it&apos;s the &ldquo;Initial Days Vacuum&rdquo;. <span className="text-[#A855F7] font-bold">We talk about &ldquo;funding&rdquo;, but we forget about &ldquo;foundation&rdquo;</span>. Many have the <span className="text-[#A855F7] font-bold">&lsquo;Keeda&rsquo;</span> (the itch) and the <span className="text-[#A855F7] font-bold">&lsquo;Himmat&rsquo;</span> (the courage), but courage without a compass is just a slow way to get lost.
                    </p>

                    <p>
                        The ecosystem treats early-stage startups like athletes. In reality, they need to be treated like infants. If you don&apos;t hold the hand that is trying to build, that hand will eventually reach for a corporate cubicle just to survive.
                    </p>

                    <p>
                        I believe tactical, hands-on support in the first 100 days is more valuable than a seed check in the first 300.
                    </p>

                    <p>
                        If we provide the right scaffolding to the aspiring founder, we won&apos;t just see more startups but also <span className="text-[#A855F7] font-bold">will unlock an era of unstoppable builders.</span>
                    </p>

                    <p>
                        I am not here just to teach. <span className="text-[#A855F7] font-bold">I am here to make sure the fire that made a founder start does not go out before the sun rises.</span>
                    </p>

                    <p className="pt-2 font-bold text-lg md:text-xl text-[#A855F7]">
                        For all those who have &ldquo;Keeda&rdquo; and &ldquo;Himmat&rdquo; come join the gang!
                    </p>

                </div>
            </div>
        </section>
    );
}
