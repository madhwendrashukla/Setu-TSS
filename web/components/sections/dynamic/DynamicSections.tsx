'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PageData, WorkshopData } from '@/types/cms';

const DynamicHero = dynamic(() => import("./DynamicHero").then(mod => mod.DynamicHero));
const DynamicStoryline = dynamic(() => import("./DynamicStoryline").then(mod => mod.DynamicStoryline));
const DynamicOutcomes = dynamic(() => import("./DynamicOutcomes").then(mod => mod.DynamicOutcomes));
const DynamicWorkshops = dynamic(() => import("./DynamicWorkshops").then(mod => mod.DynamicWorkshops));
const DynamicMentors = dynamic(() => import("./DynamicMentors").then(mod => mod.DynamicMentors));
const DynamicVideoGallery = dynamic(() => import("./DynamicVideoGallery").then(mod => mod.DynamicVideoGallery));
const DynamicTestimonials = dynamic(() => import("./DynamicTestimonials").then(mod => mod.DynamicTestimonials));
const DynamicFAQ = dynamic(() => import("./DynamicFAQ").then(mod => mod.DynamicFAQ));
const DynamicContact = dynamic(() => import("./DynamicContact").then(mod => mod.DynamicContact));
const DynamicCheckoutModal = dynamic(() => import("./DynamicCheckoutModal").then(mod => mod.DynamicCheckoutModal));
const WorkshopNudgeCTA = dynamic(() => import("./WorkshopNudgeCTA").then(mod => mod.WorkshopNudgeCTA));

export function DynamicSections({ pageData, eventSlug }: { pageData: PageData, eventSlug?: string }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

    const handleCheckoutClick = (workshopId: string) => {
        setSelectedWorkshopId(workshopId);
        setIsCheckoutOpen(true);
    };

    const handleCheckoutSuccess = (response: any) => {
        setIsCheckoutOpen(false);
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
    };

    const selectedWorkshop = selectedWorkshopId 
        ? pageData.workshops?.find((w: WorkshopData) => w.id === selectedWorkshopId) || null 
        : null;

    // Check if Workshops exist to determine if Nudge is needed
    const hasWorkshops = pageData.section_visibility?.workshops && pageData.workshops && pageData.workshops.length > 0;

    return (
        <>
            {pageData.section_visibility?.hero && <DynamicHero data={pageData} />}
            {pageData.section_visibility?.story && <DynamicStoryline data={pageData} />}
            {pageData.section_visibility?.output && <DynamicOutcomes data={pageData} />}
            
            {hasWorkshops && (pageData.section_visibility?.story || pageData.section_visibility?.output) && (
                <WorkshopNudgeCTA />
            )}

            {pageData.section_visibility?.workshops && <DynamicWorkshops data={pageData} onCheckoutClick={handleCheckoutClick} />}
            
            {pageData.section_visibility?.mentors && <DynamicMentors data={pageData} />}
            {pageData.section_visibility?.video_gallery && <DynamicVideoGallery data={pageData} />}
            {pageData.section_visibility?.testimonials && <DynamicTestimonials data={pageData} />}
            
            {hasWorkshops && (pageData.section_visibility?.mentors || pageData.section_visibility?.testimonials) && (
                <WorkshopNudgeCTA text="Limited Seats - Book Now" />
            )}

            {pageData.section_visibility?.faqs && <DynamicFAQ data={pageData} />}
            {pageData.section_visibility?.contact && <DynamicContact data={pageData} />}

            {/* Checkout Modal */}
            {isCheckoutOpen && selectedWorkshop && (
                <DynamicCheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    workshop={selectedWorkshop}
                    eventSlug={eventSlug}
                    couponConfig={pageData.coupon}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </>
    );
}
