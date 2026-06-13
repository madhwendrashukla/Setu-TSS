export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-text-secondary mb-2">Total Events</h3>
                    <p className="text-4xl font-bold text-white">12</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-text-secondary mb-2">Active Mentors</h3>
                    <p className="text-4xl font-bold text-white">8</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-text-secondary mb-2">New Leads</h3>
                    <p className="text-4xl font-bold text-accent-blue">24</p>
                </div>
            </div>
            
            <div className="mt-12 bg-zinc-900 p-8 rounded-xl border border-white/10">
                <h2 className="text-xl font-bold mb-4">Welcome to Startup School Admin</h2>
                <p className="text-text-secondary leading-relaxed">
                    Use the sidebar navigation to manage different sections of the website. 
                    Any changes made here will immediately reflect on the public-facing site.
                    Make sure to adhere to the content limits (e.g., maximum 20 gallery images).
                </p>
            </div>
        </div>
    );
}
