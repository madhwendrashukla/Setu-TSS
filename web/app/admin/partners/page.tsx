"use client";
import { useState, useEffect } from "react";

export default function AdminPartners() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Ecosystem Partners</h1>
                <button className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Partner
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Partner Name</th>
                            <th className="p-4 font-normal">Website Link</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={3} className="p-4 text-center text-text-secondary">No partners added yet</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
