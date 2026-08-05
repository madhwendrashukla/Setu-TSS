'use client';
import Image from 'next/image';


export function WorkshopWhyUs() {
    const items = [
        'Introduction to the complete fundraising process',
        'Data Room Preparation and documents required',
        'All basic financial jargons and key terms every founder should know',
        'Introduction to all agreements required — Term Sheet, SHA, and more',
        'Cap Table management fundamentals',
        'Investor Outreach strategies',
        'Pitch Deck preparation and pitching it the right way',
        'Legal Compliance essentials for startups',
        'Access to tools and resources wherever needed',
        'Certificate of Participation – Basic Level',
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" id="why-us">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] md:h-[600px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="relative animate-[float_6s_ease-in-out_infinite] px-4 md:px-0 flex justify-center items-center w-full">
                        <div className="w-full max-w-[500px] rounded-2xl md:rounded-3xl p-[3px] bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] shadow-[0_0_30px_rgba(217,70,239,0.15)]">
                            <div className="bg-[#0f172a] rounded-[13px] md:rounded-[21px] w-full h-full flex justify-center items-center p-2 md:p-4">
                                <Image src="/jargons.webp" alt="Startup Jargons" width={800} height={800} className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" loading="lazy" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 leading-tight">
                            What do you get in <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]">this workshop?</span>
                        </h2>

                        <ul className="space-y-3.5 text-sm md:text-base text-slate-300 font-light text-left inline-block w-full">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <i className="fa-solid fa-check text-[#8b5cf6] mt-1.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-plus text-[#d946ef] shrink-0 text-lg" />
                                <span className="font-medium text-white text-base md:text-lg">...and a lot more!</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
