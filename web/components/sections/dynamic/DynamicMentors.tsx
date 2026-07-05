"use client";
import React from 'react';

export function DynamicMentors({ data }: { data: any }) {
    return (
        <section className="w-full py-24 px-6 bg-gray-50 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        {data.title || "Meet Your Mentors"}
                    </h2>
                    {data.subtitle && (
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {data.subtitle}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(data.mentorsList || []).map((mentor: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg relative">
                                {mentor.photo ? (
                                    <img src={mentor.photo} alt={mentor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <i className="fas fa-user text-3xl"></i>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{mentor.name}</h3>
                            <p className="text-accent-blue font-semibold mb-4">{mentor.role}</p>
                            {mentor.bio && (
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                                    {mentor.bio}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
