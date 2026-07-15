export const BottomVideoGallery = ({ data = [] }: { data?: any[] }) => {
    const videos = data || [];
    
    // Do not render anything if there are no active videos
    if (videos.length === 0) return null;

    return (
        <section className="w-full bg-bg-main py-16 md:py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => (
                        <div key={video.id} className="w-full flex flex-col group">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black relative">
                                {video.youtube_url.includes('youtube.com') || video.youtube_url.includes('youtu.be') ? (
                                    <iframe 
                                        className="w-full h-full absolute inset-0"
                                        src={`https://www.youtube.com/embed/${video.youtube_url.split('v=')[1]?.split('&')[0] || video.youtube_url.split('youtu.be/')[1]}`} 
                                        title={video.title || "Video"}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/50">Invalid Video URL</div>
                                )}
                            </div>
                            {video.title && (
                                <h3 className="text-white font-semibold text-lg mt-4 px-2 group-hover:text-accent-blue transition-colors">
                                    {video.title}
                                </h3>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
