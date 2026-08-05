export function getEmbedUrl(videoUrl: string): string {
    if (!videoUrl) return '';

    try {
        let embedUrl = videoUrl;

        // YouTube
        if (videoUrl.includes('youtube.com/watch')) {
            const urlObj = new URL(videoUrl);
            const videoId = urlObj.searchParams.get('v');
            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes('youtu.be/')) {
            embedUrl = `https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1]?.split('?')[0]}`;
        } else if (videoUrl.includes('youtube.com/shorts/')) {
            embedUrl = `https://www.youtube.com/embed/${videoUrl.split('youtube.com/shorts/')[1]?.split('?')[0]}`;
        }
        
        // Vimeo
        else if (videoUrl.includes('vimeo.com/')) {
            // Check if it's already an player.vimeo.com url
            if (!videoUrl.includes('player.vimeo.com')) {
                const videoId = videoUrl.split('vimeo.com/')[1]?.split('/')[0]?.split('?')[0];
                if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
            }
        }

        return embedUrl;
    } catch (e) {
        return videoUrl;
    }
}
