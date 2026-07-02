"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        question: "What exactly is Setu?",
        answer: "Setu is a comprehensive ecosystem designed for startups and founders. We provide an Alternate B-School experience, expert mentorship, and access to premium tools to help you build, incubate, and grow your ideas into successful ventures."
    },
    {
        question: "How does the mentorship and guidance work?",
        answer: "Our mentorship program connects you with industry veterans and successful founders who provide 1-on-1 guidance, actionable feedback, and strategic advice tailored specifically to your startup's stage and challenges."
    },
    {
        question: "Are the ecosystem tools completely free?",
        answer: "Yes! Members of the Setu ecosystem get free access to a curated selection of premium tools, resources, and credits to help minimize operational costs while you focus on scaling your product."
    },
    {
        question: "Can anyone join the Alternate B-School?",
        answer: "Our Alternate B-School is open to ambitious founders, early-stage teams, and individuals looking to learn the real-world mechanics of building a startup. We review applications to ensure a high-quality cohort and collaborative environment."
    },
    {
        question: "How do I apply for the incubation program?",
        answer: "You can apply directly through our platform when applications open for the next cohort. The process involves an initial screening, a pitch presentation, and interviews with our investment and mentorship committee."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleLoadMore = () => {
        setVisibleCount(FAQS.length);
    };

    return (
        <section className="w-full bg-white pt-24 md:pt-32 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    {/* Left Column - Headers */}
                    <div className="w-full lg:w-1/3 flex flex-col items-start">
                        <span className="text-[#6B21FB] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
                            COMMON QUESTIONS
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Everything you're wondering about
                        </h2>
                    </div>

                    {/* Right Column - Accordion */}
                    <div className="w-full lg:w-2/3 flex flex-col items-center">
                        <div className="w-full flex flex-col">
                            {FAQS.slice(0, visibleCount).map((faq, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <div 
                                        key={index} 
                                        className="w-full border-b border-gray-200 last:border-b-0 overflow-hidden"
                                    >
                                        <button 
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between py-6 text-left hover:text-[#6B21FB] transition-colors focus:outline-none group"
                                        >
                                            <span className={`font-semibold text-lg pr-4 transition-colors ${isOpen ? 'text-[#6B21FB]' : 'text-gray-900'}`}>
                                                {faq.question}
                                            </span>
                                            <span className={`shrink-0 transition-colors ${isOpen ? 'text-[#6B21FB]' : 'text-gray-400 group-hover:text-[#6B21FB]'}`}>
                                                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="pb-6 text-gray-600 font-medium leading-relaxed pr-8">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {visibleCount < FAQS.length && (
                            <button 
                                onClick={handleLoadMore}
                                className="mt-10 px-8 py-3 rounded-full border-2 border-gray-200 text-gray-900 font-bold text-sm hover:border-[#6B21FB] hover:text-[#6B21FB] transition-all focus:outline-none"
                            >
                                Load More
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
