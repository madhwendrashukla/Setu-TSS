"use client";
import { useState, useEffect } from "react";
import PitchDecksManager from "./components/PitchDecksManager";
import GrantsManager from "./components/GrantsManager";
import InvestorsManager from "./components/InvestorsManager";
import IncubatorsManager from "./components/IncubatorsManager";
import FounderEventsManager from "./components/FounderEventsManager";

export default function AdminToolsPage() {
    const [activeTab, setActiveTab] = useState("pitch-decks");
    const [fullSettings, setFullSettings] = useState<any>(null);

    const fetchSettings = () => {
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/site_settings`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setFullSettings(data);
        })
        .catch(console.error);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSettingChange = async (key: string, value: string) => {
        if (!fullSettings) return;
        let toggles: any = {};
        try { toggles = typeof fullSettings.section_toggles === 'string' ? JSON.parse(fullSettings.section_toggles) : (fullSettings.section_toggles || {}); } catch(e) {}
        
        toggles[key] = value;
        
        const newSettings = { ...fullSettings, section_toggles: toggles };
        setFullSettings(newSettings);
        
        const token = localStorage.getItem("adminToken");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/site_settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(newSettings)
        });
    };

    const tabToKey: Record<string, string> = {
        "pitch-decks": "tool_pitch_decks",
        "grants": "tool_grants",
        "investors": "tool_investors",
        "incubators": "tool_incubators",
        "founder-events": "tool_calendar",
    };
    const activeKey = tabToKey[activeTab];

    let currentVal = 'live';
    if (fullSettings) {
        let toggles: any = {};
        try { toggles = typeof fullSettings.section_toggles === 'string' ? JSON.parse(fullSettings.section_toggles) : (fullSettings.section_toggles || {}); } catch(e) {}
        const val = toggles[activeKey];
        if (typeof val === 'boolean') {
            currentVal = val ? 'live' : 'disabled';
        } else if (typeof val === 'string') {
            currentVal = val;
        }
    }
    const isVisible = currentVal !== 'disabled' && currentVal !== 'disabled_live' && currentVal !== 'disabled_upcoming' && currentVal !== false;
    const isLive = currentVal === 'live' || currentVal === 'disabled_live' || currentVal === true || currentVal === 'disabled';

    const handleVisibilityChange = (checked: boolean) => {
        const newVal = checked ? (isLive ? 'live' : 'upcoming') : (isLive ? 'disabled_live' : 'disabled_upcoming');
        handleSettingChange(activeKey, newVal);
    };

    const handleStatusChange = (statusStr: string) => {
        const liveChecked = statusStr === 'live';
        const newVal = isVisible ? (liveChecked ? 'live' : 'upcoming') : (liveChecked ? 'disabled_live' : 'disabled_upcoming');
        handleSettingChange(activeKey, newVal);
    };

    const tabs = [
        { id: "pitch-decks", label: "Pitch Decks", icon: "fas fa-file-powerpoint" },
        { id: "grants", label: "Grants", icon: "fas fa-hand-holding-usd" },
        { id: "investors", label: "Investors", icon: "fas fa-user-tie" },
        { id: "incubators", label: "Incubators", icon: "fas fa-building" },
        { id: "founder-events", label: "Founder Events", icon: "fas fa-calendar-alt" },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight mb-2">Tools & Resources</h1>
                <p className="text-gray-500 text-sm">Manage resources for founders including pitch decks, grants, investors, and events.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                                activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-accent-blue/20 to-purple-500/10 text-gray-900 shadow-[inset_0_2px_0_#8b5cf6] border border-gray-200' 
                                    : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <i className={`${tab.icon} ${activeTab === tab.id ? 'text-accent-blue' : ''}`}></i>
                            <span className="font-bold">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {fullSettings && (
                    <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm shrink-0">
                        <label className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                            <span className="text-sm font-bold text-gray-700 mr-2">Visible</span>
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={isVisible} onChange={e => handleVisibilityChange(e.target.checked)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${isVisible ? 'bg-accent-blue' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isVisible ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                        </label>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-700">Status:</span>
                            <select 
                                value={isLive ? 'live' : 'upcoming'}
                                onChange={e => handleStatusChange(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-accent-blue focus:border-accent-blue block w-full p-1.5 font-semibold text-gray-700 outline-none"
                            >
                                <option value="live">Live</option>
                                <option value="upcoming">Upcoming</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="shadow-sm bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-2xl">
                {activeTab === "pitch-decks" && <PitchDecksManager />}
                {activeTab === "grants" && <GrantsManager />}
                {activeTab === "investors" && <InvestorsManager />}
                {activeTab === "incubators" && <IncubatorsManager />}
                {activeTab === "founder-events" && <FounderEventsManager />}
            </div>
        </div>
    );
}
