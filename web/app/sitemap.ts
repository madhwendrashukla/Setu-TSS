import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://foundersschool.in';

    const routes = [
        '',
        '/about',
        '/events',
        '/mentors',
        '/programs',
        '/gaurav-bansal',
        '/fundraising-workshop-15apr',
        '/founders-dating-14feb26',
        '/tools',
        '/tools/cap-table-simulator',
        '/tools/financial-modeler',
        '/tools/founder-calendar',
        '/tools/pitch-decks',
        '/tools/incubators-accelerators',
        '/tools/incubator-search',
        '/tools/incubator-search/investors',
        '/tools/incubator-search/grants',
        '/privacy-policy',
        '/terms-of-use',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'yearly' : 'monthly',
        priority:
            route === '' ? 1 :
            route === '/about' || route === '/programs' || route === '/mentors' ? 0.9 :
            route === '/gaurav-bansal' || route === '/events' ? 0.8 :
            route === '/fundraising-workshop-15apr' || route === '/founders-dating-14feb26' ? 0.7 :
            route.startsWith('/tools/') ? 0.8 :
            route.startsWith('/privacy') || route.startsWith('/terms') ? 0.5 : 0.9,
    }));
}

