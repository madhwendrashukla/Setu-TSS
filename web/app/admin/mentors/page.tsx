"use client";
import { useState, useEffect } from "react";

export default function AdminMentors() {
    const [mentors, setMentors] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/mentors")
            .then(res => res.json())
            .then(data => setMentors(data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Mentors</h1>
                <button className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Mentor
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Name</th>
                            <th className="p-4 font-normal">Title</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mentors.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-text-secondary">No mentors found</td></tr>
                        ) : (
                            mentors.map(mentor => (
                                <tr key={mentor.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-bold flex items-center gap-3">
                                        {mentor.photo_url && <img src={mentor.photo_url} alt="" className="w-8 h-8 rounded-full" />}
                                        {mentor.name}
                                    </td>
                                    <td className="p-4 text-text-secondary">{mentor.title}</td>
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
