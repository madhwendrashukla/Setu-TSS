import React from 'react';

export const Testimonials = ({ data }: { data?: any[] }) => {
    // Fallback data if none provided
    const testimonials = data && data.length > 0 ? data : [
        { id: 1, type: 'video', youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', video_heading: 'Incredible Experience', video_description: 'This program changed my startup trajectory.', show_description: true },
        { id: 2, type: 'text', name: 'Rahul Sharma', quote: 'The mentorship was exactly what I needed to raise my seed round.', city: 'Bangalore' },
        { id: 3, type: 'text', name: 'Sneha Patel', quote: 'Met my co-founder here. Best decision ever.', city: 'Mumbai' },
        { id: 4, type: 'text', name: 'Vikram Singh', quote: 'The community is unmatched. You learn so much just by being in the room.', city: 'Delhi' },
    ];

    const videoTestimonials = testimonials.filter(t => t.type === 'video').slice(0, 4);
    const textTestimonials = testimonials.filter(t => t.type === 'text');

    return (
        <section className="mb-32 w-full bg-bg-main relative">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="text-4xl font-bold text-white tracking-tight mb-2">What Founders Say</h2>
                <p className="text-text-secondary">Real stories from our community members.</p>
            </div>

            {/* Video Testimonials */}
            {videoTestimonials.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videoTestimonials.map(video => (
                        <div key={video.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 bg-bg-surface flex flex-col">
                            <div className="relative w-full pt-[56.25%] bg-black">
                                <iframe 
                                    src={video.youtube_url} 
                                    title={video.video_heading || 'Testimonial Video'}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                            {video.show_description && (
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-white font-bold text-lg mb-2 leading-tight">{video.video_heading}</h3>
                                    <p className="text-text-secondary text-sm">{video.video_description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Text Testimonials Rolling Marquee */}
            {textTestimonials.length > 0 && (
                <div className="relative flex overflow-x-hidden py-4">
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-bg-main to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-bg-main to-transparent z-10"></div>
                    
                    <div className="animate-marquee-slow flex whitespace-nowrap space-x-6 px-4">
                        {textTestimonials.map(text => (
                            <div key={text.id} className="inline-block w-[300px] md:w-[450px] p-6 glass-card rounded-2xl border border-white/5 bg-bg-surface flex-shrink-0">
                                <div className="text-accent-blue text-4xl mb-4 font-serif leading-none">"</div>
                                <p className="text-white text-lg mb-6 whitespace-normal italic">"{text.quote}"</p>
                                <div className="flex items-center gap-4">
                                    {text.photo_url ? (
                                        <img src={text.photo_url} alt={text.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xl">
                                            {text.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-white font-bold">{text.name}</h4>
                                        <p className="text-text-secondary text-sm">{text.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Duplicate for marquee */}
                        {textTestimonials.map(text => (
                            <div key={text.id + 'dup'} className="inline-block w-[300px] md:w-[450px] p-6 glass-card rounded-2xl border border-white/5 bg-bg-surface flex-shrink-0">
                                <div className="text-accent-blue text-4xl mb-4 font-serif leading-none">"</div>
                                <p className="text-white text-lg mb-6 whitespace-normal italic">"{text.quote}"</p>
                                <div className="flex items-center gap-4">
                                    {text.photo_url ? (
                                        <img src={text.photo_url} alt={text.name} className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xl">
                                            {text.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="text-white font-bold">{text.name}</h4>
                                        <p className="text-text-secondary text-sm">{text.city}</p>
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
};
