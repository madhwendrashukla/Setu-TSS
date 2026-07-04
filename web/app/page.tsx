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
const WhoIsSetuFor = dynamic(() => import("@/components/sections/WhoIsSetuFor").then(mod => mod.WhoIsSetuFor), { ssr: true });

// New Sections for PRD v2
const EventsGallery = dynamic(() => import("@/components/sections/EventsGallery").then(mod => mod.EventsGallery), { ssr: true });
const CommunityGallery = dynamic(() => import("@/components/sections/Gallery").then(mod => mod.Gallery), { ssr: true });
const StartupsMentored = dynamic(() => import("@/components/sections/StartupsMentored").then(mod => mod.StartupsMentored), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(mod => mod.Testimonials), { ssr: true });
const EcosystemPartners = dynamic(() => import("@/components/sections/EcosystemPartners").then(mod => mod.EcosystemPartners), { ssr: true });
const StudentsFrom = dynamic(() => import("@/components/sections/StudentsFrom").then(mod => mod.StudentsFrom), { ssr: true });
const Certifications = dynamic(() => import("@/components/sections/Certifications").then(mod => mod.Certifications), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then(mod => mod.Contact), { ssr: true });

// Fetch data from Express Backend
async function getHomepageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage`, { cache: 'no-store' });
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

      <main className="flex min-h-screen flex-col items-center justify-start bg-bg-main w-full overflow-x-hidden">
        {/* 1. Hero - Full Width */}
        <div className="w-full bg-bg-main">
          <Hero data={data?.homepageContent} slides={data?.heroSlides} />
        </div>
        
        {/* Main Content Sections */}
        <div className="w-full flex flex-col items-center justify-start">

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
        
        {/* 6. Events Gallery (Tabs) */}
        <EventsGallery />
        
        {/* 9. Community Gallery */}
        <CommunityGallery data={data?.galleryItems} />
        
        {/* Startups Mentored */}
        <StartupsMentored data={data?.mentoredStartups} />
        
        {/* 10. Testimonials */}
        <Testimonials data={data?.testimonials} />
        
        {/* 11. Ecosystem Partners */}
        <EcosystemPartners data={data?.partners} />

        {/* 12. Students From */}
        <StudentsFrom data={data?.studentsFrom} />

        {/* 13. Certifications and Awards */}
        <Certifications data={data?.certifications} />

        {/* 14. Contact Form */}
        <Contact />
        </div>
      </main>
    </>
  );
}
