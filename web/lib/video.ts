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

export async function fetchYouTubeTitle(videoUrl: string, apiBaseUrl?: string, authToken?: string): Promise<string | null> {
    if (!videoUrl) return null;

    // 1. Try backend proxy if available
    if (apiBaseUrl) {
        try {
            const res = await fetch(`${apiBaseUrl}/api/admin/bottom_videos/fetch_title?url=${encodeURIComponent(videoUrl)}`, {
                headers: authToken ? { "Authorization": `Bearer ${authToken}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                if (data.title) return data.title;
            }
        } catch (e) {
            // fallback to direct oEmbed
        }
    }

    // 2. Direct oEmbed fallback
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`);
        if (res.ok) {
            const data = await res.json();
            return data.title || null;
        }
    } catch (e) {
        console.error("Failed to fetch title from YouTube oEmbed:", e);
    }

    return null;
}
