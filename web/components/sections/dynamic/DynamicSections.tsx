'use client';

import { useState } from 'react';
import { resolveCheckoutTarget } from '@/lib/lms-routing';
import dynamic from 'next/dynamic';
import { PageData, WorkshopData } from '@/types/cms';

const DynamicHero = dynamic(() => import("./DynamicHero").then(mod => mod.DynamicHero));
const DynamicStoryline = dynamic(() => import("./DynamicStoryline").then(mod => mod.DynamicStoryline));
const DynamicOutcomes = dynamic(() => import("./DynamicOutcomes").then(mod => mod.DynamicOutcomes));
const DynamicWorkshopBreakdown = dynamic(() => import("./DynamicWorkshopBreakdown").then(mod => mod.DynamicWorkshopBreakdown));
const DynamicPricing = dynamic(() => import("./DynamicPricing").then(mod => mod.DynamicPricing));
const DynamicMentors = dynamic(() => import("./DynamicMentors").then(mod => mod.DynamicMentors));
const DynamicVideoGallery = dynamic(() => import("./DynamicVideoGallery").then(mod => mod.DynamicVideoGallery));
const DynamicTestimonials = dynamic(() => import("./DynamicTestimonials").then(mod => mod.DynamicTestimonials));
const DynamicFAQ = dynamic(() => import("./DynamicFAQ").then(mod => mod.DynamicFAQ));
const DynamicContact = dynamic(() => import("./DynamicContact").then(mod => mod.DynamicContact));
const DynamicCheckoutModal = dynamic(() => import("./DynamicCheckoutModal").then(mod => mod.DynamicCheckoutModal));
const WorkshopNudgeCTA = dynamic(() => import("./WorkshopNudgeCTA").then(mod => mod.WorkshopNudgeCTA));

export function DynamicSections({ pageData, eventSlug, lmsCourseSlug }: { pageData: PageData, eventSlug?: string, lmsCourseSlug?: string | null }) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

    const handleCheckoutClick = (workshopId: string) => {
        // An LMS-backed card sells through the COURSE checkout (account +
        // enrolment + credentials email); a non-LMS one sells through the
        // on-page modal (details + OTP + payment, no LMS account). A card may
        // name its own course_slug so one event can offer several courses plus
        // a bundle; cards without one inherit the event's course.
        const card =
            pageData.pricing_options?.find((p: any) => p.id === workshopId) ||
            pageData.workshops?.find((w: any) => w.id === workshopId);

        // Explicit per-card / per-event toggle, most specific wins. See
        // lib/lms-routing.ts — this used to be decided implicitly by whether a
        // course_slug happened to be filled in.
        const target = resolveCheckoutTarget(card as any, pageData as any, lmsCourseSlug);
        if (target.mode === 'course') {
            window.location.href = `/courses/${target.slug}`;
            return;
        }
        setSelectedWorkshopId(workshopId);
        setIsCheckoutOpen(true);
    };

    const handleCheckoutSuccess = (response: any) => {
        setIsCheckoutOpen(false);
        // Non-LMS buyers get no account and no course page, so a browser alert
        // was the entire confirmation they received after paying. Send them to
        // a real success page instead; only the payment reference travels in
        // the URL, never their personal details.
        const ref = encodeURIComponent(response?.razorpay_payment_id || '');
        window.location.href = `/events/${eventSlug}/success?ref=${ref}`;
    };

    const selectedWorkshop = selectedWorkshopId 
        ? (pageData.pricing_options?.find((w: any) => w.id === selectedWorkshopId) || 
           pageData.workshops?.find((w: WorkshopData) => w.id === selectedWorkshopId) || null)
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

            {pageData.section_visibility?.workshops && <DynamicWorkshopBreakdown data={pageData} onCheckoutClick={handleCheckoutClick} />}
            {pageData.section_visibility?.pricing && <DynamicPricing data={pageData} onCheckoutClick={handleCheckoutClick} />}
            
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
