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
// Contact section
// const DynamicContact = dynamic(() => import("./DynamicContact").then(mod => mod.DynamicContact)); // to be added later

export function DynamicSections({ pageData }: { pageData: PageData }) {
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

    return (
        <>
            {pageData.section_visibility?.hero && <DynamicHero data={pageData} />}
            {pageData.section_visibility?.story && <DynamicStoryline data={pageData} />}
            {pageData.section_visibility?.output && <DynamicOutcomes data={pageData} />}
            
            {pageData.section_visibility?.workshops && <DynamicWorkshops data={pageData} onCheckoutClick={handleCheckoutClick} />}
            
            {pageData.section_visibility?.mentors && <DynamicMentors data={pageData} />}
            {pageData.section_visibility?.video_gallery && <DynamicVideoGallery data={pageData} />}
            {pageData.section_visibility?.testimonials && <DynamicTestimonials data={pageData} />}
            {pageData.section_visibility?.faqs && <DynamicFAQ data={pageData} />}
            {pageData.section_visibility?.contact && <DynamicContact data={pageData} />}

            {/* Checkout Modal */}
            {isCheckoutOpen && selectedWorkshop && (
                <DynamicCheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    workshop={selectedWorkshop}
                    couponConfig={pageData.coupon}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </>
    );
}
