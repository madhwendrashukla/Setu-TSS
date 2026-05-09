

export function AIWorkshopSchedule() {
    const schedule = [
        {
            day: 'DAY 1',
            date: 'May 15 (Friday)',
            sessions: [
                { time: '6:00 PM – 9:00 PM IST', title: 'Startup Ideation & Validation', mentor: 'Gaurav Bansal', icon: 'fa-lightbulb', color: '#8b5cf6' },
            ],
        },
        {
            day: 'DAY 2',
            date: 'May 16 (Saturday)',
            sessions: [
                { time: '10:00 AM – 12:30 PM IST', title: 'Mastering AI with Claude Pro – Session 1', mentor: 'Atul Pandey', icon: 'fa-robot', color: '#d946ef' },
                { time: '3:00 PM – 5:30 PM IST', title: 'Mastering AI with Claude Pro – Session 2', mentor: 'Atul Pandey', icon: 'fa-robot', color: '#d946ef' },
            ],
        },
        {
            day: 'DAY 3',
            date: 'May 17 (Sunday)',
            sessions: [
                { time: '10:00 AM – 12:30 PM IST', title: 'AI Filmmaking & Video Marketing', mentor: 'Amey Asuti', icon: 'fa-film', color: '#8b5cf6' },
                { time: '3:00 PM – 5:30 PM IST', title: 'Mastering AI with Claude Pro – Session 3', mentor: 'Atul Pandey', icon: 'fa-robot', color: '#d946ef' },
            ],
        },
    ];

    return (
        <section className="py-16 md:py-24 relative" id="schedule">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[180px] opacity-8 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Complete Schedule</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4" />
                    <p className="text-slate-400 text-base md:text-lg font-light">3 days · 5 sessions · 13 total hours — designed for working professionals</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {schedule.map((day, di) => (
                        <div key={di} className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                            <div className="px-6 md:px-8 py-4 border-b border-white/5 flex items-center gap-4">
                                <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white text-sm font-extrabold rounded-lg uppercase tracking-widest">{day.day}</span>
                                <span className="text-white font-extrabold text-lg md:text-xl">{day.date}</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {day.sessions.map((session, si) => (
                                    <div key={si} className="px-6 md:px-8 py-4 md:py-5 flex items-start gap-4 group hover:bg-white/3 transition-colors">
                                        <div className="mt-1 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border" style={{ background: `${session.color}15`, borderColor: `${session.color}30` }}>
                                            <i className={`fa-solid ${session.icon} text-sm`} style={{ color: session.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-sm font-bold font-mono text-white bg-white/10 px-2.5 py-1 rounded shadow-sm">{session.time}</span>
                                                <span className="hidden sm:inline text-slate-500">·</span>
                                                <span className="text-xs text-slate-400">Live on Zoom</span>
                                            </div>
                                            <p className="text-sm md:text-base font-bold text-white">{session.title}</p>
                                            <p className="text-xs md:text-sm text-slate-400 font-light mt-0.5">by {session.mentor}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
