"use client";
import { useState, useEffect } from "react";

export default function AdminEvents() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/events")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Events</h1>
                <button className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Event
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Title</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal">Pinned</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-text-secondary">No events found</td></tr>
                        ) : (
                            events.map(event => (
                                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-bold">{event.title}</td>
                                    <td className="p-4">{new Date(event.start_date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        {event.is_past ? 
                                            <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Past</span> : 
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Upcoming</span>
                                        }
                                    </td>
                                    <td className="p-4">
                                        {event.is_pinned ? <span className="text-accent-blue font-bold">★ Pinned</span> : "-"}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-text-secondary hover:text-white mr-4">Edit</button>
                                        <button className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
