"use client";
import { useState, useEffect } from "react";

export default function AdminGallery() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Gallery</h1>
                <button className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Upload Media
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl mb-8">
                <h2 className="text-xl font-bold mb-2">Upload Limits</h2>
                <p className="text-text-secondary text-sm">
                    Images: <span className="text-white">0 / 20</span> &nbsp;|&nbsp; 
                    Videos: <span className="text-white">0 / 10</span> &nbsp;|&nbsp; 
                    Total: <span className="text-white">0 / 30</span>
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-accent-blue h-full w-[0%]" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-8 text-text-secondary hover:text-white hover:border-white cursor-pointer transition h-48">
                    <span className="text-3xl mb-2">+</span>
                    <span>Click to Upload</span>
                    <span className="text-xs mt-2 opacity-50">JPG, PNG, WebP (Max 5MB)</span>
                </div>
                {/* Media items would map here */}
            </div>
        </div>
    );
}
