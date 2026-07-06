"use client";
import React from 'react';

export function DynamicCurriculum({ data }: { data: any }) {
    return (
        <section className="w-full py-24 px-6 bg-white relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        {data.title || "Curriculum Overview"}
                    </h2>
                </div>

                <div className="space-y-12">
                    {(data.tracks || []).map((track: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">{track.trackTitle || "Track Title"}</h3>
                            {track.targetAudience && (
                                <p className="text-accent-blue font-semibold mb-6">Target Audience: {track.targetAudience}</p>
                            )}
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xl font-bold mb-4">What you'll learn</h4>
                                    <ul className="space-y-3">
                                        {(track.goals || []).map((goal: string, gIdx: number) => (
                                            <li key={gIdx} className="flex gap-3 text-gray-700">
                                                <i className="fas fa-check text-green-500 mt-1"></i>
                                                <span>{goal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-4">Key Features</h4>
                                    <ul className="space-y-3">
                                        {(track.features || []).map((feature: string, fIdx: number) => (
                                            <li key={fIdx} className="flex gap-3 text-gray-700">
                                                <i className="fas fa-star text-accent-yellow mt-1"></i>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
