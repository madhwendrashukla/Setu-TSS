'use client';

import Image from 'next/image';

const guestMentors = [
    {
        name: 'Ashish Kulkarni',
        title: "Founder, Founders' Psyche | Former Research Assistant, INSEAD",
        description: "An MBA graduate from IE Business School, Spain, Ashish brings deep expertise in fundraising and entrepreneurship. As an ex-cofounder of Fundenable and a former VC scout, he has operated on both sides of the fundraising ecosystem.",
        image: '/guest-mentors/ashish.png',
        linkedin: 'https://www.linkedin.com/in/ashishkul/'
    },
    {
        name: 'Poornima Goel',
        title: 'Corporate Lawyer | Specializing in M&A & Private Equity',
        description: "Poornima specializes in General Corporate, M&A, and Private Equity, with a focus on helping businesses navigate legal frameworks and structuring agreements, ensuring regulatory readiness.",
        image: '/guest-mentors/poornima.png',
        linkedin: 'https://www.linkedin.com/in/poornima-goel-720947245/'
    },
    {
        name: 'Gaurav Mishra',
        title: 'FRM Professional | MDI-Gurgaon Alumnus | Finance Expert',
        description: "A certified FRM professional and MBA graduate from MDI-Gurgaon, Gaurav brings strong expertise in startup valuation and financial forecasting. His experience at Ernst & Young adds significant corporate depth.",
        image: '/guest-mentors/gaurav.png',
        linkedin: 'https://www.linkedin.com/in/gauravkumar100/'
    }
];

export function WorkshopGuestMentors() {
    return (
        <section className="py-20 md:py-24 relative overflow-hidden" id="guest-mentors">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Guest Mentors</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-8" />
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                        In addition to our lead mentor, get insights from industry specialists across legal, financial, and fundraising strategy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {guestMentors.map((mentor, i) => (
                        <div 
                            key={i} 
                            className="group bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-functional-border rounded-2xl p-6 md:p-8 flex flex-col hover:border-[#8b5cf6]/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity" />
                            
                            <div className="mb-6 relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-functional-border group-hover:border-[#8b5cf6]/40 transition-all duration-500">
                                <Image 
                                    src={mentor.image} 
                                    alt={mentor.name} 
                                    fill 
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#8b5cf6] group-hover:to-[#d946ef] transition-all leading-tight">
                                        {mentor.name}
                                    </h3>
                                    <a 
                                        href={mentor.linkedin} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg bg-[#0077b5]/10 flex items-center justify-center border border-[#0077b5]/30 hover:bg-[#0077b5] text-[#0077b5] hover:text-text-primary transition-all shadow-[0_0_10px_rgba(0,119,181,0.2)]"
                                        aria-label={`${mentor.name}'s LinkedIn Profile`}
                                    >
                                        <i className="fa-brands fa-linkedin-in text-sm" />
                                    </a>
                                </div>
                                <p className="text-[#8b5cf6] text-xs md:text-sm font-bold mb-4 tracking-wide leading-snug">
                                    {mentor.title}
                                </p>
                                <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed font-medium">
                                    {mentor.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
