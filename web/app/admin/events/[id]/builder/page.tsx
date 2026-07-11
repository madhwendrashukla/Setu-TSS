"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{ 'color': [] }, { 'background': [] }],
        ['link'],
        ['clean']
    ],
};

const StringArrayEditor = ({ value, onChange, placeholder }: { value: string[], onChange: (val: string[]) => void, placeholder?: string }) => {
    const handleAdd = () => onChange([...(value || []), ""]);
    const handleRemove = (index: number) => {
        const newArr = [...(value || [])];
        newArr.splice(index, 1);
        onChange(newArr);
    };
    const handleChange = (index: number, val: string) => {
        const newArr = [...(value || [])];
        newArr[index] = val;
        onChange(newArr);
    };

    return (
        <div className="space-y-2">
            {(value || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input 
                        className="flex-1 bg-white border border-gray-200 p-2 rounded-lg focus:border-accent-blue outline-none"
                        value={item}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={placeholder}
                    />
                    <button 
                        onClick={() => handleRemove(index)}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                        title="Remove"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2">
                <i className="fas fa-plus"></i> Add Item
            </button>
        </div>
    );
};

const FaqsEditor = ({ faqs, onChange }: { faqs: any[], onChange: (f: any[]) => void }) => {
    const handleAdd = () => onChange([...(faqs || []), { priority_order: (faqs?.length || 0) + 1, question: "", answer: "" }]);
    const handleRemove = (index: number) => { const newArr = [...(faqs || [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => {
        const newArr = [...(faqs || [])];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };
    return (
        <div className="space-y-4">
            {(faqs || []).map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-1 gap-3 pr-10">
                        <div className="flex gap-2">
                            <div className="w-20"><label className="block text-xs font-bold mb-1 text-gray-500">Order</label><input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={faq.priority_order || 0} onChange={e => handleChange(index, 'priority_order', parseInt(e.target.value)||0)} /></div>
                            <div className="flex-1"><label className="block text-xs font-bold mb-1 text-gray-500">Question</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={faq.question || ""} onChange={e => handleChange(index, 'question', e.target.value)} /></div>
                        </div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Answer</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-20" value={faq.answer || ""} onChange={e => handleChange(index, 'answer', e.target.value)} /></div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add FAQ</button>
        </div>
    );
};

const TestimonialsEditor = ({ items, onChange }: { items: any[], onChange: (i: any[]) => void }) => {
    const handleAdd = () => onChange([...(items || []), { id: "t_"+Date.now(), name: "", role: "", company: "", quote: "", rating: 5, visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(items || [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => {
        const newArr = [...(items || [])];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };
    return (
        <div className="space-y-4">
            {(items || []).map((t, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pr-10 mb-3">
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Name</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.name || ""} onChange={e => handleChange(index, 'name', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Role</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.role || ""} onChange={e => handleChange(index, 'role', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Company</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.company || ""} onChange={e => handleChange(index, 'company', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Rating (1-5)</label><input type="number" max="5" min="1" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.rating || 5} onChange={e => handleChange(index, 'rating', parseInt(e.target.value)||5)} /></div>
                    </div>
                    <div><label className="block text-xs font-bold mb-1 text-gray-500">Quote</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-20" value={t.quote || ""} onChange={e => handleChange(index, 'quote', e.target.value)} /></div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Testimonial</button>
        </div>
    );
};

const MentorsEditor = ({ items, onChange }: { items: any[], onChange: (i: any[]) => void }) => {
    const handleAdd = () => onChange([...(items || []), { id: "m_"+Date.now(), name: "", professional_headline: "", professional_description: "", image_url: "", credential_bullets: [], visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(items || [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => { const newArr = [...(items || [])]; newArr[index] = { ...newArr[index], [field]: val }; onChange(newArr); };
    return (
        <div className="space-y-4">
            {(items || []).map((m, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="flex gap-4">
                        <div className="w-24 shrink-0">
                            <label className="block text-xs font-bold mb-1 text-gray-500">Image URL</label>
                            {m.image_url ? <img src={m.image_url} alt="Mentor" className="w-full aspect-square object-cover rounded-lg bg-gray-100 mb-2" /> : <div className="w-full aspect-square rounded-lg bg-gray-100 mb-2 flex items-center justify-center text-gray-400 text-xs text-center p-2 border border-dashed border-gray-300">No Image</div>}
                            <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none text-xs" placeholder="URL..." value={m.image_url || ""} onChange={e => handleChange(index, 'image_url', e.target.value)} />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Name</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={m.name || ""} onChange={e => handleChange(index, 'name', e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={m.professional_headline || ""} onChange={e => handleChange(index, 'professional_headline', e.target.value)} /></div>
                            </div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Description</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-16" value={m.professional_description || ""} onChange={e => handleChange(index, 'professional_description', e.target.value)} /></div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-500">Credentials (Bullets)</label>
                                <StringArrayEditor value={m.credential_bullets || []} onChange={v => handleChange(index, 'credential_bullets', v)} placeholder="e.g. 'Ex-Google'" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Mentor</button>
        </div>
    );
};

const StoryBoxesEditor = ({ boxes, onChange }: { boxes: any[], onChange: (b: any[]) => void }) => {
    const handleAdd = () => onChange([...(boxes || []), { title: "", description: "", bullets: [] }]);
    const handleRemove = (index: number) => { const newArr = [...(boxes || [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => { const newArr = [...(boxes || [])]; newArr[index] = { ...newArr[index], [field]: val }; onChange(newArr); };
    
    return (
        <div className="space-y-4">
            {(boxes || []).map((b, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10 mb-3">
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Box Title</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={b.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Box Description</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-10" value={b.description || ""} onChange={e => handleChange(index, 'description', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Top Icon Class</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" placeholder="e.g. fas fa-user" value={b.icon_class || ""} onChange={e => handleChange(index, 'icon_class', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Watermark Icon (Optional)</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" placeholder="e.g. fas fa-times" value={b.watermark_icon || ""} onChange={e => handleChange(index, 'watermark_icon', e.target.value)} /></div>
                        <div>
                            <label className="block text-xs font-bold mb-1 text-gray-500">Theme</label>
                            <select className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none text-xs" value={b.theme || "light"} onChange={e => handleChange(index, 'theme', e.target.value)}>
                                <option value="light">Light (Default)</option>
                                <option value="dark">Dark Subdued</option>
                                <option value="purple">Purple Highlight</option>
                                <option value="light_purple">Light Purple Highlight</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <label className="block text-xs font-bold mb-2 text-gray-500">Bullets (Check/Cross)</label>
                        <div className="space-y-2">
                            {(b.bullets || []).map((bullet: any, bIndex: number) => (
                                <div key={bIndex} className="flex gap-2 items-center">
                                    <select className="bg-gray-50 border border-gray-200 p-2 rounded outline-none text-xs" value={bullet.style || "check"} onChange={e => {
                                        const newBullets = [...(b.bullets || [])];
                                        newBullets[bIndex] = { ...newBullets[bIndex], style: e.target.value };
                                        handleChange(index, 'bullets', newBullets);
                                    }}>
                                        <option value="check">Check (Green Default)</option>
                                        <option value="check_light">Check (Light Green)</option>
                                        <option value="cross">Cross (Red Default)</option>
                                        <option value="cross_light">Cross (Light Red)</option>
                                        <option value="check_purple">Check (Purple)</option>
                                        <option value="check_purple_light">Check (Light Purple)</option>
                                        <option value="cross_grey">Cross (Grey)</option>
                                    </select>
                                    <input className="flex-1 bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={bullet.text || ""} onChange={e => {
                                        const newBullets = [...(b.bullets || [])];
                                        newBullets[bIndex] = { ...newBullets[bIndex], text: e.target.value };
                                        handleChange(index, 'bullets', newBullets);
                                    }} placeholder="Bullet text..." />
                                    <button onClick={() => {
                                        const newBullets = [...(b.bullets || [])];
                                        newBullets.splice(bIndex, 1);
                                        handleChange(index, 'bullets', newBullets);
                                    }} className="text-red-500 p-2 hover:bg-red-50 rounded"><i className="fas fa-trash text-xs"></i></button>
                                </div>
                            ))}
                            <button onClick={() => handleChange(index, 'bullets', [...(b.bullets || []), { text: "", style: "check" }])} className="text-xs font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-1"><i className="fas fa-plus"></i> Add Bullet</button>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Story Box</button>
        </div>
    );
};

const WorkshopsEditor = ({ workshops, onChange }: { workshops: any[], onChange: (w: any[]) => void }) => {
    const handleAdd = () => onChange([...(workshops || []), { id: "w_"+Date.now(), priority_order: (workshops?.length || 0)+1, heading: "DAY 1", title: "", key_features: "", detail_bullets: { what_youll_learn: [], your_deliverables: [] }, pricing: { strike_price: 0, actual_price: 0, date_time_bullets: [], mode: "online", address: "" }, cta: { text: "Book Now", active: true }, visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(workshops || [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => { const newArr = [...(workshops || [])]; newArr[index] = { ...newArr[index], [field]: val }; onChange(newArr); };

    return (
        <div className="space-y-6">
            {(workshops || []).map((w, index) => (
                <div key={index} className="border border-gray-300 rounded-xl bg-gray-50 shadow-sm relative overflow-hidden">
                    <div className="bg-gray-200 p-3 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-gray-700">Workshop {index + 1}</h4>
                        <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 bg-white w-7 h-7 rounded shadow-sm"><i className="fas fa-trash text-xs"></i></button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Priority Order</label><input type="number" className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.priority_order || 0} onChange={e => handleChange(index, 'priority_order', parseInt(e.target.value)||0)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Heading (e.g. DAY 1)</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.heading || ""} onChange={e => handleChange(index, 'heading', e.target.value)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Title</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
                        </div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Key Features</label><textarea className="w-full bg-white border border-gray-200 p-2 rounded outline-none h-16" value={w.key_features || ""} onChange={e => handleChange(index, 'key_features', e.target.value)} /></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold mb-2 text-gray-700">What You'll Learn (Rich Text / Bullets)</label>
                                <div className="bg-white">
                                    <ReactQuill 
                                        theme="snow"
                                        modules={quillModules}
                                        value={typeof w.detail_bullets?.what_youll_learn === 'string' ? w.detail_bullets.what_youll_learn : (w.detail_bullets?.what_youll_learn || []).map((b: string) => `<li>${b}</li>`).join('') ? `<ul>${(w.detail_bullets?.what_youll_learn || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ""} 
                                        onChange={val => handleChange(index, 'detail_bullets', { ...w.detail_bullets, what_youll_learn: val })} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-2 text-gray-700">Deliverables (Rich Text / Bullets)</label>
                                <div className="bg-white">
                                    <ReactQuill 
                                        theme="snow"
                                        modules={quillModules}
                                        value={typeof w.detail_bullets?.your_deliverables === 'string' ? w.detail_bullets.your_deliverables : (w.detail_bullets?.your_deliverables || []).map((b: string) => `<li>${b}</li>`).join('') ? `<ul>${(w.detail_bullets?.your_deliverables || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ""} 
                                        onChange={val => handleChange(index, 'detail_bullets', { ...w.detail_bullets, your_deliverables: val })} 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 space-y-4">
                            <h5 className="font-bold text-xs text-gray-700 uppercase tracking-wide">Pricing & Details</h5>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Strike Price</label><input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={w.pricing?.strike_price || 0} onChange={e => handleChange(index, 'pricing', { ...w.pricing, strike_price: parseInt(e.target.value)||0 })} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Actual Price</label><input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={w.pricing?.actual_price || 0} onChange={e => handleChange(index, 'pricing', { ...w.pricing, actual_price: parseInt(e.target.value)||0 })} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Mode</label><select className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={w.pricing?.mode || "online"} onChange={e => handleChange(index, 'pricing', { ...w.pricing, mode: e.target.value })}><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option></select></div>
                            </div>
                            {w.pricing?.mode !== 'online' && (
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Address (Offline/Hybrid)</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={w.pricing?.address || ""} onChange={e => handleChange(index, 'pricing', { ...w.pricing, address: e.target.value })} placeholder="Full address details..." /></div>
                            )}
                            <div>
                                <label className="block text-xs font-bold mb-2 text-gray-700">Date/Time (Bullets)</label>
                                <StringArrayEditor value={w.pricing?.date_time_bullets || []} onChange={v => handleChange(index, 'pricing', { ...w.pricing, date_time_bullets: v })} placeholder="e.g. May 15th" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-500">CTA Button Text</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={w.cta?.text || ""} onChange={e => handleChange(index, 'cta', { ...w.cta, text: e.target.value })} placeholder="Book Your Seat Now" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                                        <input type="checkbox" checked={w.cta?.active !== false} onChange={e => handleChange(index, 'cta', { ...w.cta, active: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                                        Registrations Open (Show Button)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Workshop</button>
        </div>
    );
};

const initialPageData = {
    section_visibility: { hero: true, story: true, output: true, workshops: true, mentors: true, video_gallery: true, testimonials: true, faqs: true, contact: true },
    hero: { 
        headline: "Master The Art of <span class='text-purple-500'>Startup Success</span>", 
        description: "Join the most comprehensive accelerator program designed for early-stage founders to build, scale, and raise funding.", 
        key_highlights: ["3 Days", "5 Mentors", "Funding Opportunities"] 
    },
    story: { 
        visible: true, 
        headline: "Why This Program?", 
        description: "We built this program because most founders fail due to lack of guidance, not lack of effort.", 
        boxes: [
            { title: "No Fluff, Just Action", description: "Skip the theory and focus on execution.", bullets: [{ text: "Real-world case studies", style: "check" }, { text: "Boring lectures", style: "cross" }] },
            { title: "Expert Mentorship", description: "Learn from those who have done it.", bullets: [{ text: "1-on-1 Feedback", style: "check" }, { text: "Generic Advice", style: "cross" }] },
            { title: "Investor Access", description: "Get your pitch deck in front of actual investors.", bullets: [{ text: "Direct Intros", style: "check" }, { text: "Cold Emails", style: "cross" }] }
        ] 
    },
    output: { 
        image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
        headline: "By the end of this program, you will have:", 
        bullets: [
            "A polished, investor-ready pitch deck",
            "A clear go-to-market strategy",
            "A financial model that makes sense",
            "A network of fellow founders and mentors"
        ] 
    },
    workshops: [
        {
            id: "workshop_1",
            priority_order: 1,
            heading: "DAY 1",
            title: "Startup Ideation & Validation",
            key_features: "Learn how to validate your idea before spending a dime on development.",
            detail_bullets: {
                what_youll_learn: ["Customer Discovery", "Prototyping", "Market Sizing"],
                your_deliverables: ["Validation Framework", "User Persona"]
            },
            pricing: {
                strike_price: 999,
                actual_price: 499,
                date_time_bullets: ["May 15", "6:00 PM - 8:00 PM"],
                mode: "online",
                address: null
            },
            cta: { text: "Book Your Seat Now", active: true },
            visible: true
        }
    ],
    mentors: { 
        section_headline: "Meet Your Mentors", 
        items: [
            {
                id: "m1",
                image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Alex Johnson",
                professional_headline: "Ex-YC Founder | Angel Investor",
                professional_description: "Alex has built and sold two startups and now invests in early-stage SaaS companies.",
                credential_bullets: ["Founded XYZ Corp", "Invested in 50+ startups"],
                visible: true
            }
        ] 
    },
    video_gallery: { 
        headline: "Watch Our Previous Sessions", 
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"] 
    },
    testimonials: [
        {
            id: "t1",
            video_url: "",
            name: "Sarah Lee",
            role: "Founder",
            company: "TechNova",
            city: "Bangalore",
            rating: 5,
            quote: "This program completely changed how I look at my business. Highly recommended!",
            visible: true
        }
    ],
    faqs: [
        {
            id: "f1",
            priority_order: 1,
            question: "Is this program for me?",
            answer: "If you have an idea or an early-stage product, yes.",
            visible: true
        }
    ],
    contact: { 
        whatsapp: { headline: "Got Questions?", description: "Chat with our team directly.", button_text: "Message Us", link: "919876543210" }, 
        lead_gen: { headline: "Request a Callback", subtext: "Drop your details and we will call you back.", admin_email: "admin@example.com", submit_text: "Request Callback" } 
    },
    coupon: { code: "EARLYBIRD", discount_percent: 20, active: true }
};

export default function EventBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [event, setEvent] = useState<any>(null);
    const [pageData, setPageData] = useState<any>(initialPageData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("visibility");
    const [adminSources, setAdminSources] = useState<any[]>([]);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/lead-sources`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                setAdminSources(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
            }
        };
        fetchSources();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                const found = data.find((e: any) => e.id === id);
                if (found) {
                    setEvent(found);
                    
                    let parsedData = typeof found.page_blocks === 'string' ? JSON.parse(found.page_blocks) : (found.page_blocks || {});
                    if (Array.isArray(parsedData)) {
                        parsedData = initialPageData;
                    }
                    
                    setPageData({
                        ...initialPageData,
                        ...parsedData,
                        section_visibility: { ...initialPageData.section_visibility, ...(parsedData.section_visibility || {}) },
                        hero: { ...initialPageData.hero, ...(parsedData.hero || {}) },
                        story: { ...initialPageData.story, ...(parsedData.story || {}) },
                        output: { ...initialPageData.output, ...(parsedData.output || {}) },
                        mentors: { ...initialPageData.mentors, ...(parsedData.mentors || {}) },
                        video_gallery: { ...initialPageData.video_gallery, ...(parsedData.video_gallery || {}) },
                        contact: {
                            whatsapp: { ...initialPageData.contact?.whatsapp, ...(parsedData.contact?.whatsapp || {}) },
                            lead_gen: { ...initialPageData.contact?.lead_gen, ...(parsedData.contact?.lead_gen || {}) }
                        },
                        coupon: { ...initialPageData.coupon, ...(parsedData.coupon || {}) }
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const updateData = (section: string, field: string, value: any) => {
        setPageData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleUpload = async (file: File): Promise<string | null> => {
        const token = localStorage.getItem("adminToken");
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();
            return data.url;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
        if (e.target.files && e.target.files[0]) {
            const url = await handleUpload(e.target.files[0]);
            if (url) {
                updateData(section, field, url);
            }
        }
    };

    const savePageData = async () => {
        setSaving(true);
        const token = localStorage.getItem("adminToken");
        try {
            const fd = new FormData();
            fd.append('page_blocks', JSON.stringify(pageData));
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: fd
            });
            if (res.ok) {
                alert("Saved successfully!");
            } else {
                alert("Error saving.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'visibility', label: 'Visibility & Toggles' },
        { id: 'hero', label: 'Hero Section' },
        { id: 'story', label: 'Story Section' },
        { id: 'output', label: 'The Output' },
        { id: 'workshops', label: 'Workshops & Pricing' },
        { id: 'mentors', label: 'Mentors' },
        { id: 'video_gallery', label: 'Video Gallery' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'faqs', label: 'FAQs' },
        { id: 'contact', label: 'Contact & Coupon' }
    ];

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30 shadow-sm px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/admin/events')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <i className="fas fa-arrow-left text-gray-500"></i>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Event Builder (v2)</h1>
                        <p className="text-xs text-gray-500">Editing: {event?.title}</p>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 h-fit md:sticky top-28">
                    <h2 className="font-bold text-lg mb-2 text-gray-700 uppercase tracking-wide text-xs">Sections</h2>
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-left px-4 py-3 rounded-lg transition-colors text-sm ${activeTab === tab.id ? 'bg-accent-blue/10 text-accent-blue font-bold' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button onClick={savePageData} disabled={saving} className="w-full bg-accent-blue text-white py-3 rounded-xl font-bold hover:bg-accent-blue/90 disabled:opacity-50 transition-all shadow-md">
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                    {activeTab === 'visibility' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Global Section Visibility</h2>
                            <p className="text-gray-500 text-sm mb-6">Toggle which sections appear on the final landing page.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(pageData.section_visibility).map(key => (
                                    <label key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 border border-gray-200 transition-colors">
                                        <input type="checkbox" checked={pageData.section_visibility[key]} onChange={e => {
                                            setPageData({...pageData, section_visibility: {...pageData.section_visibility, [key]: e.target.checked}})
                                        }} className="w-6 h-6 accent-accent-blue rounded" />
                                        <span className="font-bold capitalize text-gray-700">{key.replace('_', ' ')} Section</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Hero Section</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Headline (Rich Text)</label><div className="bg-white"><ReactQuill modules={quillModules} theme="snow" value={pageData.hero?.headline || ""} onChange={val => updateData('hero', 'headline', val)} placeholder="Enter headline text or HTML..." /></div></div>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Description (Rich Text)</label><div className="bg-white"><ReactQuill modules={quillModules} theme="snow" value={pageData.hero?.description || ""} onChange={val => updateData('hero', 'description', val)} /></div></div>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Key Highlights</label><StringArrayEditor value={pageData.hero?.key_highlights || []} onChange={v => updateData('hero', 'key_highlights', v)} placeholder='e.g. "3 Mentors", "3 Days"' /></div>
                        </div>
                    )}

                    {activeTab === 'story' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Story Section</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white outline-none focus:border-accent-blue" value={pageData.story?.headline || ""} onChange={e => updateData('story', 'headline', e.target.value)} /></div>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Description</label><textarea className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-24 focus:bg-white outline-none focus:border-accent-blue" value={pageData.story?.description || ""} onChange={e => updateData('story', 'description', e.target.value)} /></div>
                            <div>
                                <StoryBoxesEditor boxes={pageData.story?.boxes || []} onChange={v => updateData('story', 'boxes', v)} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'output' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">The Output</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Headline (Rich Text)</label><div className="bg-white"><ReactQuill modules={quillModules} theme="snow" value={pageData.output?.headline || ""} onChange={val => updateData('output', 'headline', val)} /></div></div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Supporting Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'output', 'image_url')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    {pageData.output?.image_url && <img src={pageData.output.image_url} alt="Preview" className="h-40 object-cover mt-4 rounded-lg shadow-sm" />}
                                </div>
                            </div>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Deliverable Bullets</label><StringArrayEditor value={pageData.output?.bullets || []} onChange={v => updateData('output', 'bullets', v)} placeholder='e.g. "Build a SaaS...", "Raise Funds..."' /></div>
                        </div>
                    )}

                    {activeTab === 'workshops' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Workshops & Pricing</h2>
                            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl font-medium">This is the core repeatable array. Each workshop contains its own pricing, dates, and Checkout CTA toggle.</p>
                            <WorkshopsEditor workshops={pageData.workshops || []} onChange={v => setPageData({...pageData, workshops: v})} />
                        </div>
                    )}

                    {activeTab === 'mentors' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Mentors</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Section Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white outline-none focus:border-accent-blue" value={pageData.mentors?.section_headline || ""} onChange={e => updateData('mentors', 'section_headline', e.target.value)} /></div>
                            <div>
                                <MentorsEditor items={pageData.mentors?.items || []} onChange={v => updateData('mentors', 'items', v)} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'video_gallery' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Video Gallery</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white outline-none focus:border-accent-blue" value={pageData.video_gallery?.headline || ""} onChange={e => updateData('video_gallery', 'headline', e.target.value)} /></div>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Videos (YouTube URLs or IDs)</label><StringArrayEditor value={pageData.video_gallery?.videos || []} onChange={v => updateData('video_gallery', 'videos', v)} placeholder='https://youtube.com/watch?v=...' /></div>
                        </div>
                    )}

                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Testimonials</h2>
                            <div>
                                <TestimonialsEditor items={pageData.testimonials || []} onChange={v => setPageData({...pageData, testimonials: v})} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'faqs' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">FAQs</h2>
                            <div>
                                <FaqsEditor faqs={pageData.faqs || []} onChange={v => setPageData({...pageData, faqs: v})} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Contact Us & Global Coupon</h2>
                            
                            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm">
                                <h3 className="font-bold mb-4 text-lg text-gray-800"><i className="fab fa-whatsapp text-green-500 mr-2"></i>WhatsApp Block</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Headline</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.headline || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, headline: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Button Text</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.buttonText || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, buttonText: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Number/Link</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.number || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, number: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Description</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.description || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, description: e.target.value}}})} /></div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm mt-6">
                                <h3 className="font-bold mb-4 text-lg text-gray-800"><i className="fas fa-envelope text-blue-500 mr-2"></i>Lead-Gen Form</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Headline (HTML)</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.lead_gen?.headline || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, headline: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Sub-text</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.lead_gen?.subtext || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, subtext: e.target.value}}})} /></div>
                                    <div className="md:col-span-2"><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Contact Details / Description</label><textarea placeholder="Email: abc@xyz.com..." className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none h-20" value={pageData.contact?.lead_gen?.description || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, description: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-red-600 uppercase tracking-wider">Admin Dest Email</label><input type="email" placeholder="leads@example.com" className="w-full bg-white border border-red-200 p-3 rounded-lg focus:border-red-500 outline-none" value={pageData.contact?.lead_gen?.admin_email || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, admin_email: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Submit Button Text</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.lead_gen?.submitButtonText || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, submitButtonText: e.target.value}}})} /></div>
                                    <div>
                                        <label className="block text-xs font-bold mb-2 text-blue-600 uppercase tracking-wider">Lead Source Tag</label>
                                        <select 
                                            className="w-full bg-white border border-blue-200 p-3 rounded-lg focus:border-blue-500 outline-none" 
                                            value={pageData.contact?.lead_gen?.lead_source_tag || ""} 
                                            onChange={e => setPageData({...pageData, contact: {...pageData.contact, lead_gen: {...pageData.contact.lead_gen, lead_source_tag: e.target.value}}})}
                                        >
                                            <option value="">-- Select Lead Source --</option>
                                            {adminSources.map(s => (
                                                <option key={s.id} value={s.slug}>{s.label || s.slug}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-purple-200 rounded-xl p-6 bg-purple-50 shadow-sm mt-8">
                                <h3 className="font-bold mb-4 text-lg text-purple-900"><i className="fas fa-ticket-alt text-purple-600 mr-2"></i>Global Coupon System</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div><label className="block text-xs font-bold mb-2 text-purple-700 uppercase tracking-wider">Coupon Code</label><input placeholder="e.g. STARTUP20" className="w-full bg-white border border-purple-200 p-3 rounded-lg focus:border-purple-500 outline-none" value={pageData.coupon?.code || ""} onChange={e => setPageData({...pageData, coupon: {...pageData.coupon, code: e.target.value}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-purple-700 uppercase tracking-wider">Discount %</label><input type="number" placeholder="20" className="w-full bg-white border border-purple-200 p-3 rounded-lg focus:border-purple-500 outline-none" value={pageData.coupon?.discount_percent || 0} onChange={e => setPageData({...pageData, coupon: {...pageData.coupon, discount_percent: parseInt(e.target.value)||0}})} /></div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer p-2 bg-white rounded-lg border border-purple-100 pr-4">
                                            <input type="checkbox" checked={pageData.coupon?.active || false} onChange={e => setPageData({...pageData, coupon: {...pageData.coupon, active: e.target.checked}})} className="w-5 h-5 accent-purple-600 rounded" />
                                            <span className="font-bold text-sm text-purple-900">Coupon Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
