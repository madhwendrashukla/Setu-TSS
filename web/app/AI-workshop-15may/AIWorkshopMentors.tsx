import Image from 'next/image';

const mentors = [
    {
        name: 'Gaurav Bansal',
        role: 'Founder – Setu - TheStartupSchool',
        workshop: 'Workshop 1: Startup Ideation & Validation',
        bio: 'Gaurav Bansal is the founder of Setu - TheStartupSchool, an alternate B-school for aspiring entrepreneurs. With extensive experience mentoring at premier institutions, Gaurav has guided hundreds of founders from ideation to execution.',
        quote: '"To master fundraising, you must speak three languages: The Narrative, The Numbers, and The Law."',
        credentials: [
            { icon: 'fa-graduation-cap', text: 'Mentor at e-cell IIT Madras' },
            { icon: 'fa-gavel', text: 'Ex-Mentor – IIM-R, IIT-D, DU, AIM' },
            { icon: 'fa-chalkboard-user', text: 'Guest speaker at 10+ B-schools' },
            { icon: 'fa-handshake', text: 'Expert in strategy & startup building' },
        ],
        links: [
            { label: 'LinkedIn', icon: 'fa-brands fa-linkedin', href: 'https://www.linkedin.com/in/gauravbansal2/' },
        ],
        color: '#8b5cf6',
        initials: 'GB',
        image: '/gaurav.webp',
        imagePosition: '50% 25%',
    },
    {
        name: 'Atul Pandey',
        role: 'AI & Startup Technology Expert',
        workshop: 'Workshop 2: Mastering AI with Claude Pro',
        bio: 'Atul Pandey specializes in helping non-technical founders leverage AI tools to build and scale their startups. He bridges the gap between entrepreneurship and technology, making AI accessible for everyone.',
        quote: '"Hands-on, practical, and immediately actionable. No theoretical fluff."',
        credentials: [
            { icon: 'fa-robot', text: 'Claude Pro implementation for business' },
            { icon: 'fa-code', text: 'No-code/low-code MVP development' },
            { icon: 'fa-magnifying-glass-chart', text: 'AI-powered market research' },
            { icon: 'fa-layer-group', text: 'Product prototyping with AI' },
        ],
        links: [
            { label: 'LinkedIn', icon: 'fa-brands fa-linkedin', href: 'https://www.linkedin.com/in/atulpandey-iift' },
        ],
        color: '#d946ef',
        initials: 'AP',
        image: '/atul_pandey.webp',
        imagePosition: '50% 15%',
    },
    {
        name: 'Amey Asuti',
        role: 'AI Filmmaking & Content Creation Specialist',
        workshop: 'Workshop 3: AI Filmmaking & Video Marketing',
        bio: 'Amey Asuti is a pioneer in AI-powered content creation, helping entrepreneurs and creators produce professional-quality video content using cutting-edge AI tools.',
        quote: '"From consumer to creator — the future of content is AI-powered."',
        credentials: [
            { icon: 'fa-graduation-cap', text: 'IIM-A alum with 19+ yrs of work experience' },
            { icon: 'fa-film', text: 'Master in Audio, Video creation using AI tools' },
            { icon: 'fa-microphone', text: 'Podcast Host, marketing & branding expert, Entrepreneur' },
            { icon: 'fa-eye', text: 'Expert visual story telling for brands' },
        ],
        links: [
            { label: 'LinkedIn', icon: 'fa-brands fa-linkedin', href: 'https://linkedin.com/in/ameyasuti/' },
        ],
        color: '#8b5cf6',
        initials: 'AA',
        image: '/amey_Astuti.webp',
        imagePosition: '50% 20%',
    },
];

export function AIWorkshopMentors() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden" id="mentors">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full max-w-xl h-[300px] md:h-[500px] bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[120px] md:blur-[180px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Learn from Founders Who&apos;ve<br className="hidden md:block" /> Actually Done It</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4" />
                    <p className="text-slate-400 text-base md:text-lg font-light max-w-2xl mx-auto">Three domain experts, one comprehensive system to launch your startup.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {mentors.map((mentor, mi) => (
                        <div key={mi} className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border rounded-2xl md:rounded-3xl overflow-hidden flex flex-col hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.25)] transition-all duration-300 group hover:-translate-y-1" style={{ borderColor: `${mentor.color}40` }}>

                            {/* Card body */}
                            <div className="p-6 md:p-8 flex flex-col flex-1">

                            {/* Photo avatar */}
                            <div
                                className="w-20 h-20 rounded-2xl overflow-hidden mb-4 relative"
                                style={{
                                    boxShadow: `0 4px 20px ${mentor.color}55`,
                                    border: `3px solid ${mentor.color}`,
                                    outline: `3px solid ${mentor.color}44`,
                                    outlineOffset: '3px',
                                }}
                            >
                                <Image
                                    src={mentor.image}
                                    alt={mentor.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                    style={{ objectPosition: mentor.imagePosition }}
                                />
                            </div>

                            {/* Badge */}
                            <div className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest text-white mb-3 w-fit" style={{ background: `linear-gradient(135deg, ${mentor.color}50, ${mentor.color}30)`, border: `1px solid ${mentor.color}40` }}>
                                {mentor.workshop}
                            </div>

                            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1">{mentor.name}</h3>
                            <p className="text-sm font-bold mb-4" style={{ color: mentor.color }}>{mentor.role}</p>
                            <p className="text-sm text-slate-400 font-light leading-relaxed mb-5">{mentor.bio}</p>

                            {/* Credentials */}
                            <ul className="space-y-2 mb-5">
                                {mentor.credentials.map((cred, ci) => (
                                    <li key={ci} className="flex items-start gap-2.5">
                                        <i className={`fa-solid ${cred.icon} mt-0.5 text-xs shrink-0`} style={{ color: mentor.color }} />
                                        <span className="text-xs text-slate-300 font-light">{cred.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Quote */}
                            <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10 italic text-xs text-slate-300 font-light leading-relaxed">
                                {mentor.quote}
                            </div>

                            </div>{/* end card body */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
