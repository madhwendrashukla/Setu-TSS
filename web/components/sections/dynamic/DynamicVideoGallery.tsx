"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicVideoGallery({ data }: { data: PageData }) {
    if (!data?.video_gallery || !data.video_gallery.videos || data.video_gallery.videos.length === 0) return null;

    const { video_gallery } = data;

    return (
        <section className="py-24 bg-slate-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {video_gallery.headline && (
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white" dangerouslySetInnerHTML={{ __html: video_gallery.headline }} />
                    </div>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${video_gallery.videos.length === 1 ? 'md:grid-cols-1 max-w-3xl mx-auto' : ''}`}>
                    {video_gallery.videos.map((videoUrl: string, idx: number) => {
                        // Extract YouTube ID if possible to render iframe nicely, or fallback to raw embed/video tag
                        let embedUrl = videoUrl;
                        if (videoUrl.includes('youtube.com/watch?v=')) {
                            embedUrl = videoUrl.replace('watch?v=', 'embed/');
                        } else if (videoUrl.includes('youtu.be/')) {
                            embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
                        }

                        return (
                            <div key={idx} className="bg-slate-800 rounded-2xl overflow-hidden aspect-video shadow-2xl border border-slate-700 relative group">
                                <iframe 
                                    src={embedUrl} 
                                    className="w-full h-full absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
