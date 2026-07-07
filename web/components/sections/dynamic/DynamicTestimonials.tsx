"use client";
import React from 'react';
import { PageData, TestimonialData } from '@/types/cms';

export function DynamicTestimonials({ data }: { data: PageData }) {
    if (!data?.testimonials || data.testimonials.length === 0) return null;

    const visibleTestimonials = data.testimonials.filter((t: TestimonialData) => t.visible !== false);
    if (visibleTestimonials.length === 0) return null;

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">What Our Alumni Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleTestimonials.map((testimonial: TestimonialData, idx: number) => {
                        let embedUrl = testimonial.video_url;
                        if (embedUrl?.includes('youtube.com/watch?v=')) {
                            embedUrl = embedUrl.replace('watch?v=', 'embed/');
                        } else if (embedUrl?.includes('youtu.be/')) {
                            embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                        }

                        return (
                            <div key={testimonial.id || idx} className="bg-slate-50 rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                                {embedUrl && (
                                    <div className="relative aspect-video w-full bg-slate-900">
                                        <iframe 
                                            src={embedUrl} 
                                            className="w-full h-full absolute inset-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex gap-1 mb-4 text-yellow-400">
                                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                                            <i key={i} className="fas fa-star text-sm"></i>
                                        ))}
                                    </div>
                                    
                                    {testimonial.quote && (
                                        <div 
                                            className="text-slate-700 italic mb-8 flex-grow"
                                            dangerouslySetInnerHTML={{ __html: `"${testimonial.quote}"` }}
                                        />
                                    )}

                                    <div className="border-t border-slate-200 pt-4 mt-auto">
                                        <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-semibold text-blue-600">{testimonial.company}</span>
                                            {testimonial.city && (
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <i className="fas fa-map-marker-alt"></i> {testimonial.city}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
