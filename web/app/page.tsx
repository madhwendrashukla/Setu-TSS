import dynamic from 'next/dynamic';
import { Hero } from "@/components/sections/Hero";
import Script from "next/script";

// Lazy load below-the-fold sections
const WorkshopPreview = dynamic(() => import("@/components/sections/WorkshopPreview").then(mod => mod.WorkshopPreview || (() => null)), { ssr: true });
const MentorsPreview = dynamic(() => import("@/components/sections/MentorsPreview").then(mod => mod.MentorsPreview), { ssr: true });
const ToolsShowcase = dynamic(() => import("@/components/sections/ToolsShowcase").then(mod => mod.ToolsShowcase), { ssr: true });
const FounderManifesto = dynamic(() => import("@/components/sections/FounderManifesto").then(mod => mod.FounderManifesto), { ssr: true });
const VideoAndGallery = dynamic(() => import("@/components/sections/VideoAndGallery").then(mod => mod.VideoAndGallery), { ssr: true });
const Programs = dynamic(() => import("@/components/sections/Programs").then(mod => mod.Programs), { ssr: true });

// New Sections for PRD v2
const PastWorkshopsRolling = dynamic(() => import("@/components/sections/PastWorkshopsRolling").then(mod => mod.PastWorkshopsRolling), { ssr: true });
const CommunityGallery = dynamic(() => import("@/components/sections/Gallery").then(mod => mod.Gallery), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(mod => mod.Testimonials), { ssr: true });
const EcosystemPartners = dynamic(() => import("@/components/sections/EcosystemPartners").then(mod => mod.EcosystemPartners), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then(mod => mod.Contact), { ssr: true });

// Fetch data from Express Backend
async function getHomepageData() {
  try {
    const res = await fetch('http://localhost:5000/api/homepage', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Backend not running or reachable", error);
    return null;
  }
}

export default async function Home() {
  const data = await getHomepageData();

  return (
    <>
      {/* counter.dev analytics - lazyOnload so it never blocks */}
      <Script
        src="https://cdn.counter.dev/script.js"
        data-id="2806e04d-b124-48cb-82a3-35ecd0d92aa8"
        data-utcoffset="6"
        strategy="lazyOnload"
      />

      <main className="flex min-h-screen flex-col items-center justify-between">
        {/* 1. Hero */}
        <Hero data={data?.homepageContent} slides={data?.heroSlides} />
        
        {/* 2. Pinned Workshop */}
        <WorkshopPreview />
        
        {/* 3. Mentors (Carousel) */}
        <MentorsPreview data={data?.mentors || []} />
        
        {/* 4. Tools & Resources Preview */}
        <ToolsShowcase />
        
        {/* 5. Founder's Manifesto */}
        <FounderManifesto />
        
        {/* 6. Mentor Panel Highlights */}
        <VideoAndGallery />
        
        {/* 7. Programs Launching Soon */}
        <Programs data={data?.programs} />
        
        {/* 8. Past Workshops (Rolling) */}
        <PastWorkshopsRolling />
        
        {/* 9. Community Gallery */}
        <CommunityGallery data={data?.galleryItems} />
        
        {/* 10. Testimonials */}
        <Testimonials data={data?.testimonials} />
        
        {/* 11. Ecosystem Partners */}
        <EcosystemPartners data={data?.partners} />
        
        {/* 12. Contact Form */}
        <Contact />
      </main>
    </>
  );
}
