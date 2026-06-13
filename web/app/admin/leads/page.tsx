"use client";
import { useState, useEffect } from "react";

export default function AdminLeads() {
    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/admin/leads", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        })
            .then(res => res.json())
            .then(data => setLeads(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Lead Inquiries</h1>
                <button className="border border-white/20 text-white font-bold px-4 py-2 rounded hover:bg-white/10">
                    Export CSV
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Name</th>
                            <th className="p-4 font-normal">Email</th>
                            <th className="p-4 font-normal">Phone</th>
                            <th className="p-4 font-normal">Source</th>
                            <th className="p-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-text-secondary">No inquiries found</td></tr>
                        ) : (
                            leads.map(lead => (
                                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-bold">{lead.full_name}</td>
                                    <td className="p-4 text-text-secondary">{lead.email}</td>
                                    <td className="p-4 text-text-secondary">{lead.phone}</td>
                                    <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">{lead.source}</span></td>
                                    <td className="p-4 capitalize">{lead.status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
