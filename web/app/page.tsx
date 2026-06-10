import dynamic from 'next/dynamic';
import { Hero } from "@/components/sections/Hero";
import Script from "next/script";

// Lazy load below-the-fold sections
const MentorsPreview = dynamic(() => import("@/components/sections/MentorsPreview").then(mod => mod.MentorsPreview), { ssr: true });
const VideoAndGallery = dynamic(() => import("@/components/sections/VideoAndGallery").then(mod => mod.VideoAndGallery), { ssr: true });
const ToolsShowcase = dynamic(() => import("@/components/sections/ToolsShowcase").then(mod => mod.ToolsShowcase), { ssr: true });
const FounderManifesto = dynamic(() => import("@/components/sections/FounderManifesto").then(mod => mod.FounderManifesto), { ssr: true });
const Programs = dynamic(() => import("@/components/sections/Programs").then(mod => mod.Programs), { ssr: true });
const Gallery = dynamic(() => import("@/components/sections/Gallery").then(mod => mod.Gallery), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then(mod => mod.Contact), { ssr: true });

export default function Home() {
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
        <Hero />
        <MentorsPreview />
        <VideoAndGallery />
        <ToolsShowcase />
        <FounderManifesto />
        <Programs />
        <Gallery />
        <Contact />
      </main>

    </>
  );
}
