export default function AdminDashboard() {
    return (
        <div className="animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl font-black mb-8 tracking-tight">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/10 hover:border-accent-blue/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)]">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <i className="fas fa-calendar-alt text-6xl text-accent-blue"></i>
                    </div>
                    <h3 className="text-white/50 mb-2 font-medium tracking-wide uppercase text-xs">Total Events</h3>
                    <p className="text-5xl font-black text-white mb-2">12</p>
                    <div className="text-xs text-green-400 bg-green-400/10 inline-block px-2 py-1 rounded-full"><i className="fas fa-arrow-up mr-1"></i> +2 this month</div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl border border-white/10 hover:border-accent-blue/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)]">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <i className="fas fa-users text-6xl text-accent-blue"></i>
                    </div>
                    <h3 className="text-white/50 mb-2 font-medium tracking-wide uppercase text-xs">Active Mentors</h3>
                    <p className="text-5xl font-black text-white mb-2">8</p>
                    <div className="text-xs text-white/40 inline-block px-2 py-1 rounded-full bg-white/5">Growing steadily</div>
                </div>

                <div className="group relative overflow-hidden bg-gradient-to-br from-[#8b5cf6]/20 to-[#d946ef]/10 p-8 rounded-3xl border border-accent-blue/30 hover:border-accent-blue transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(217,70,239,0.3)]">
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        <i className="fas fa-envelope-open-text text-6xl text-fuchsia-400"></i>
                    </div>
                    <h3 className="text-white/70 mb-2 font-medium tracking-wide uppercase text-xs">New Leads</h3>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-fuchsia-400 mb-2">24</p>
                    <div className="text-xs text-fuchsia-300 bg-fuchsia-400/20 inline-block px-2 py-1 rounded-full"><i className="fas fa-fire mr-1"></i> Hot prospects</div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F1322] to-[#161B2E] p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] group-hover:bg-accent-blue/20 transition-all duration-700"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4 tracking-tight flex items-center gap-3">
                        <i className="fas fa-hand-sparkles text-accent-blue"></i> Welcome to the new Admin Hub
                    </h2>
                    <p className="text-white/60 leading-relaxed max-w-3xl text-lg font-light">
                        Use the sidebar navigation to manage different sections of the website. 
                        Any changes made here will immediately reflect on the public-facing site.
                        Make sure to adhere to the content limits (e.g., maximum 20 gallery images).
                    </p>
                    
                    <div className="mt-8 flex gap-4">
                        <a href="/admin/events" className="bg-white/10 hover:bg-white text-white hover:text-black px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Manage Events
                        </a>
                        <a href="/admin/leads" className="bg-accent-blue/20 hover:bg-accent-blue text-accent-blue hover:text-white border border-accent-blue/30 px-6 py-3 rounded-xl font-bold transition-all duration-300">
                            View Leads
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
