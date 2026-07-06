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
  const togglesStr = data?.siteSettings?.section_toggles;
  let toggles: any = {};
  try { toggles = typeof togglesStr === 'string' ? JSON.parse(togglesStr) : (togglesStr || {}); } catch(e) {}

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

        {/* 3. Upcoming events */}
        {toggles.show_pinned_event !== false && <WorkshopPreview />}
        
        {/* 4. Mentors List */}
        {toggles.show_mentors !== false && <MentorsPreview data={data?.mentors || []} />}
        
        {/* 5. Tools & Resources */}
        {toggles.show_tools !== false && <ToolsShowcase toggles={toggles} />}
        
        {/* 6. Events Gallery (includes past + upcoming events) */}
        {toggles.show_past_events !== false && <EventsGallery />}
        
        {/* 7. Images gallery (Events + workshops pics) */}
        {toggles.show_community_gallery !== false && <CommunityGallery data={data?.galleryItems} />}
        
        {/* 8. Video gallery (Educational + general Content) */}
        {toggles.show_video_gallery !== false && <VideoAndGallery />}
        
        {/* 9 & 10. Testimonials - Videos & Text */}
        {toggles.show_testimonials !== false && <Testimonials data={data?.testimonials} toggles={toggles} />}

        {/* 11. Students from */}
        {toggles.show_students_from !== false && <StudentsFrom data={data?.studentsFrom} />}
        
        {/* 12. Ecosystem Partners */}
        {toggles.show_partners !== false && <EcosystemPartners data={data?.partners} />}

        {/* 13. Certifications */}
        <Certifications data={data?.certifications} />

        {/* 14. Upcoming Programs */}
        {toggles.show_programs !== false && <Programs data={data?.programs} />}

        {/* 15. Contact Enquiry form */}
        <Contact />

        {/* 16. Founders Image + Manifesto */}
        {toggles.show_founder_manifesto !== false && <FounderManifesto />}
        
        {/* 17. Startups Mentored (Placing here as additional content) */}
        {toggles.show_startups !== false && <StartupsMentored data={data?.mentoredStartups} />}
        
        </div>
      </main>
    </>
  );
}
