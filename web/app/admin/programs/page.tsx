"use client";
import { useState, useEffect } from "react";

export default function AdminPrograms() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Programs</h1>
                <button className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Program
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-2">The Spark</h2>
                    <p className="text-text-secondary mb-4">3-Day Ignition Sprint</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-accent-blue">Active</span>
                        <button className="text-white hover:underline">Edit Content</button>
                    </div>
                </div>
                
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-2">The Transformation</h2>
                    <p className="text-text-secondary mb-4">30-Day Deep-Dive</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-accent-blue">Active</span>
                        <button className="text-white hover:underline">Edit Content</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
