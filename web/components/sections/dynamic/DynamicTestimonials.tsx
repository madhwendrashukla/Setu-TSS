"use client";
import React from 'react';
import { PageData, TestimonialData } from '@/types/cms';

export function DynamicTestimonials({ data }: { data: PageData }) {
    const rawText = data.text_testimonials || [];
    const rawVideo = data.video_testimonials || [];
    
    // Migration fallback if still using data.testimonials
    if (data.testimonials && rawText.length === 0 && rawVideo.length === 0) {
        data.testimonials.forEach((t: any) => {
            if (t.video_url) rawVideo.push(t);
            else rawText.push(t);
        });
    }

    const textTestimonials = rawText.filter((t: TestimonialData) => t.visible !== false);
    const videoTestimonials = rawVideo.filter((t: TestimonialData) => t.visible !== false);

    const showText = data.section_visibility?.text_testimonials !== false;
    const showVideo = data.section_visibility?.video_testimonials !== false;

    if (!showText && !showVideo) return null;
    if (textTestimonials.length === 0 && videoTestimonials.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">What Our Alumni Say</h2>
                </div>
            </div>

            {/* Video Testimonials - Static Grid */}
            {showVideo && videoTestimonials.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videoTestimonials.map((testimonial: TestimonialData, idx: number) => {
                            let embedUrl = testimonial.video_url;
                            if (embedUrl?.includes('youtube.com/watch?v=')) {
                                embedUrl = embedUrl.replace('watch?v=', 'embed/');
                            } else if (embedUrl?.includes('youtu.be/')) {
                                embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
                            }

                            return (
                                <div key={testimonial.id || idx} className={`bg-slate-50 rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300 ${!testimonial.show_description ? 'self-start' : 'h-full'}`}>
                                    <div className="relative aspect-video w-full bg-slate-900">
                                        <iframe 
                                            src={embedUrl} 
                                            className="w-full h-full absolute inset-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    {testimonial.show_description !== false && (
                                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                                            {testimonial.video_heading && (
                                                <div className="mb-4">
                                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full tracking-wider uppercase">
                                                        {testimonial.video_heading}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex gap-1 mb-4 text-yellow-400">
                                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                                    <i key={i} className="fas fa-star text-sm"></i>
                                                ))}
                                            </div>
                                            {testimonial.video_description && (
                                                <p className="text-slate-700 italic mb-8 flex-grow leading-relaxed">
                                                    "{testimonial.video_description}"
                                                </p>
                                            )}
                                            
                                            <div className="mt-auto flex items-center gap-4 border-t border-slate-200 pt-5">
                                                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                                                    {testimonial.name ? testimonial.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 leading-tight">{testimonial.name || 'Anonymous'}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {testimonial.role}
                                                        {testimonial.role && testimonial.company ? ', ' : ''}
                                                        {testimonial.company}
                                                    </p>
                                                    {testimonial.city && (
                                                        <p className="text-xs text-slate-400 mt-0.5">{testimonial.city}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Text Testimonials - Marquee Format */}
            {showText && textTestimonials.length > 0 && (
                <div className="relative flex overflow-x-hidden py-4 w-full">
                    <div className="animate-marquee-slow flex whitespace-nowrap space-x-6 px-4">
                        {textTestimonials.map((testimonial, idx) => (
                            <div key={testimonial.id || idx} className="inline-block w-[300px] md:w-[400px] p-8 rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col flex-shrink-0 whitespace-normal">
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-sm"></i>
                                    ))}
                                </div>
                                <div className="text-slate-700 text-base md:text-lg italic mb-8 leading-relaxed">
                                    "{testimonial.quote}"
                                </div>
                                <div className="mt-auto border-t border-slate-100 pt-4">
                                    <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">{testimonial.name}</h4>
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
                        ))}
                        {/* Duplicate for Marquee effect */}
                        {textTestimonials.map((testimonial, idx) => (
                            <div key={(testimonial.id || idx) + '_dup'} className="inline-block w-[300px] md:w-[400px] p-8 rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col flex-shrink-0 whitespace-normal">
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-sm"></i>
                                    ))}
                                </div>
                                <div className="text-slate-700 text-base md:text-lg italic mb-8 leading-relaxed">
                                    "{testimonial.quote}"
                                </div>
                                <div className="mt-auto border-t border-slate-100 pt-4">
                                    <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">{testimonial.name}</h4>
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
                        ))}
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marqueeSlow {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slow {
                    animation: marqueeSlow 40s linear infinite;
                }
                .animate-marquee-slow:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
}
