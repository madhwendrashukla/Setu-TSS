"use client";
import { useState } from "react";
import PitchDecksManager from "./components/PitchDecksManager";
import GrantsManager from "./components/GrantsManager";
import InvestorsManager from "./components/InvestorsManager";
import IncubatorsManager from "./components/IncubatorsManager";
import FounderEventsManager from "./components/FounderEventsManager";

export default function AdminToolsPage() {
    const [activeTab, setActiveTab] = useState("pitch-decks");

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

            <div className="flex gap-2 overflow-x-auto custom-scrollbar mb-8 pb-2">
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
