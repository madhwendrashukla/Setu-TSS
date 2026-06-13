"use client";

export default function AdminSettings() {
    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

            <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl mb-8 space-y-6">
                <h2 className="text-xl font-bold border-b border-white/10 pb-4">Footer Details</h2>
                
                <div>
                    <label className="block text-sm text-text-secondary mb-2">Registered Address</label>
                    <textarea 
                        className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-accent-blue min-h-[100px]"
                        placeholder="Enter the official address shown in footer"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Contact Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                            placeholder="hello@thestartupschool.in"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-secondary mb-2">Contact Phone</label>
                        <input 
                            type="text" 
                            className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-accent-blue"
                        />
                    </div>
                </div>

                <button className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 mt-4">
                    Save Footer Settings
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 p-8 rounded-xl">
                <h2 className="text-xl font-bold mb-2">Certifications & Badges</h2>
                <p className="text-text-secondary mb-6 text-sm">Upload ISO or registration badges to display in the footer.</p>
                <button className="border border-white/20 text-white font-bold px-4 py-2 rounded hover:bg-white/10">
                    + Upload New Badge
                </button>
            </div>
        </div>
    );
}
