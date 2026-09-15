"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { resolveCheckoutTarget } from "@/lib/lms-routing";
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

const MultiSelectDropdown = ({ options, selected, onChange, placeholder }: { options: any[], selected: string[], onChange: (val: string[]) => void, placeholder: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const validSelectedCount = selected.filter(code => options.some(opt => opt.code === code)).length;

    return (
        <div className="relative">
            <button 
                type="button" 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-purple-200 p-3 rounded-lg focus:border-purple-500 outline-none flex justify-between items-center text-left"
            >
                <span className={validSelectedCount === 0 ? "text-gray-400" : "text-gray-900"}>
                    {validSelectedCount === 0 ? placeholder : `${validSelectedCount} coupon(s) selected`}
                </span>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400`}></i>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.length > 0 ? options.map(c => {
                        const isSelected = selected.includes(c.code);
                        return (
                            <label key={c.id} className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer border-b last:border-0 border-gray-100">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 accent-purple-600 rounded"
                                    checked={isSelected}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onChange([...selected, c.code]);
                                        } else {
                                            onChange(selected.filter((code: string) => code !== c.code));
                                        }
                                    }}
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-900">{c.code}</span>
                                    <span className="text-[10px] text-purple-600 font-medium uppercase tracking-wider">{c.type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}</span>
                                </div>
                            </label>
                        );
                    }) : (
                        <div className="p-4 text-sm text-gray-500 italic">No coupons available</div>
                    )}
                </div>
            )}
        </div>
    );
};

const StringArrayEditor = ({ value, onChange, placeholder }: { value: string[], onChange: (val: string[]) => void, placeholder?: string }) => {
    const handleAdd = () => onChange([...(Array.isArray(value) ? value : []), ""]);
    const handleRemove = (index: number) => {
        const newArr = [...(Array.isArray(value) ? value : [])];
        newArr.splice(index, 1);
        onChange(newArr);
    };
    const handleChange = (index: number, val: string) => {
        const newArr = [...(Array.isArray(value) ? value : [])];
        newArr[index] = val;
        onChange(newArr);
    };

    return (
        <div className="space-y-2">
            {(Array.isArray(value) ? value : []).map((item, index) => (
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
    const handleAdd = () => onChange([...(Array.isArray(faqs) ? faqs : []), { priority_order: (faqs?.length || 0) + 1, question: "", answer: "" }]);
    const handleRemove = (index: number) => { const newArr = [...(Array.isArray(faqs) ? faqs : [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => {
        const newArr = [...(Array.isArray(faqs) ? faqs : [])];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };
    return (
        <div className="space-y-4">
            {(Array.isArray(faqs) ? faqs : []).map((faq, index) => (
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

const TextTestimonialsEditor = ({ items, onChange }: { items: any[], onChange: (i: any[]) => void }) => {
    const handleAdd = () => onChange([...(Array.isArray(items) ? items : []), { id: "t_"+Date.now(), name: "", role: "", company: "", quote: "", rating: 5, visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(Array.isArray(items) ? items : [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => {
        const newArr = [...(Array.isArray(items) ? items : [])];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };
    return (
        <div className="space-y-4">
            {(Array.isArray(items) ? items : []).map((t, index) => (
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
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Text Testimonial</button>
        </div>
    );
};

const VideoTestimonialsEditor = ({ items, onChange }: { items: any[], onChange: (i: any[]) => void }) => {
    const handleAdd = () => onChange([...(Array.isArray(items) ? items : []), { id: "vt_"+Date.now(), name: "", role: "", company: "", video_url: "", video_description: "", rating: 5, visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(Array.isArray(items) ? items : [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => {
        const newArr = [...(Array.isArray(items) ? items : [])];
        newArr[index] = { ...newArr[index], [field]: val };
        onChange(newArr);
    };
    return (
        <div className="space-y-4">
            {(Array.isArray(items) ? items : []).map((t, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-2 gap-3 pr-10 mb-3">
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Video URL (YouTube/MP4)</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.video_url || ""} onChange={e => handleChange(index, 'video_url', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Rating (1-5)</label><input type="number" max="5" min="1" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.rating || 5} onChange={e => handleChange(index, 'rating', parseInt(e.target.value)||5)} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Name</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.name || ""} onChange={e => handleChange(index, 'name', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Role</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.role || ""} onChange={e => handleChange(index, 'role', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Company</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={t.company || ""} onChange={e => handleChange(index, 'company', e.target.value)} /></div>
                    </div>
                    <div><label className="block text-xs font-bold mb-1 text-gray-500">Video Description</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-16" value={t.video_description || ""} onChange={e => handleChange(index, 'video_description', e.target.value)} /></div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Video Testimonial</button>
        </div>
    );
};

const MentorsEditor = ({ items, onChange, onUpload }: { items: any[], onChange: (i: any[]) => void, onUpload: (file: File) => Promise<string | null> }) => {
    const handleAdd = () => onChange([...(Array.isArray(items) ? items : []), { id: "m_"+Date.now(), name: "", professional_headline: "", professional_description: "", image_url: "", credential_bullets: [], badge_text: "", visible: true }]);
    const handleRemove = (index: number) => { const newArr = [...(Array.isArray(items) ? items : [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => { const newArr = [...(Array.isArray(items) ? items : [])]; newArr[index] = { ...newArr[index], [field]: val }; onChange(newArr); };
    return (
        <div className="space-y-4">
            {(Array.isArray(items) ? items : []).map((m, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="flex gap-4">
                        <div className="w-32 shrink-0 flex flex-col gap-2">
                            <label className="block text-xs font-bold text-gray-500">Image URL</label>
                            {m.image_url ? <img src={m.image_url} alt="Mentor" className="w-full aspect-square object-cover rounded-lg bg-gray-100" /> : <div className="w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-2 border border-dashed border-gray-300">No Image</div>}
                            <input type="file" accept="image/*" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const url = await onUpload(e.target.files[0]);
                                    if (url) handleChange(index, 'image_url', url);
                                }
                            }} className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none text-[10px]" placeholder="Or paste URL..." value={m.image_url || ""} onChange={e => handleChange(index, 'image_url', e.target.value)} />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Name</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={m.name || ""} onChange={e => handleChange(index, 'name', e.target.value)} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={m.professional_headline || ""} onChange={e => handleChange(index, 'professional_headline', e.target.value)} /></div>
                            </div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Badge / Tag (Optional)</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={m.badge_text || ""} onChange={e => handleChange(index, 'badge_text', e.target.value)} placeholder="e.g. WORKSHOP 1: STARTUP IDEATION" /></div>
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

const StoryBoxesEditor = ({ boxes, onChange, onUpload }: { boxes: any[], onChange: (b: any[]) => void, onUpload: (file: File) => Promise<string | null> }) => {
    const handleAdd = () => onChange([...(Array.isArray(boxes) ? boxes : []), { title: "", description: "", bullets: [] }]);
    const handleRemove = (index: number) => { const newArr = [...(Array.isArray(boxes) ? boxes : [])]; newArr.splice(index, 1); onChange(newArr); };
    const handleChange = (index: number, field: string, val: any) => { const newArr = [...(Array.isArray(boxes) ? boxes : [])]; newArr[index] = { ...newArr[index], [field]: val }; onChange(newArr); };
    
    return (
        <div className="space-y-4">
            {(Array.isArray(boxes) ? boxes : []).map((b, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm relative">
                    <button onClick={() => handleRemove(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center bg-red-50 rounded"><i className="fas fa-trash"></i></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10 mb-3">
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Box Title</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={b.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
                        <div><label className="block text-xs font-bold mb-1 text-gray-500">Box Description</label><textarea className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none h-10" value={b.description || ""} onChange={e => handleChange(index, 'description', e.target.value)} /></div>
                        <div>
                            <label className="flex justify-between items-center text-xs font-bold mb-1 text-gray-500">
                                Top Icon Class
                                <a href="https://fontawesome.com/v5/search?m=free" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline font-normal">Find Icons</a>
                            </label>
                            <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" placeholder="e.g. fas fa-user" value={b.icon_class || ""} onChange={e => handleChange(index, 'icon_class', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 text-gray-500">Top Image Upload (Overrides Icon)</label>
                            <input type="file" accept="image/*" onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const url = await onUpload(e.target.files[0]);
                                    if (url) handleChange(index, 'image_url', url);
                                }
                            }} className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-1" />
                            <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none text-[10px]" placeholder="Or paste image URL..." value={b.image_url || ""} onChange={e => handleChange(index, 'image_url', e.target.value)} />
                        </div>
                        <div>
                            <label className="flex justify-between items-center text-xs font-bold mb-1 text-gray-500">
                                Watermark Icon (Optional)
                                <a href="https://fontawesome.com/v5/search?m=free" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline font-normal">Find Icons</a>
                            </label>
                            <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" placeholder="e.g. fas fa-times" value={b.watermark_icon || ""} onChange={e => handleChange(index, 'watermark_icon', e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4 border-t border-gray-100 pt-3">
                        <label className="block text-xs font-bold mb-2 text-gray-500">Bullets (Check/Cross)</label>
                        <div className="space-y-2">
                            {(Array.isArray(b.bullets) ? b.bullets : []).map((bullet: any, bIndex: number) => (
                                <div key={bIndex} className="flex gap-2 items-center">
                                    <select className="bg-gray-50 border border-gray-200 p-2 rounded outline-none text-xs" value={bullet.style || "check"} onChange={e => {
                                        const newBullets = [...(Array.isArray(b.bullets) ? b.bullets : [])];
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
                                        const newBullets = [...(Array.isArray(b.bullets) ? b.bullets : [])];
                                        newBullets[bIndex] = { ...newBullets[bIndex], text: e.target.value };
                                        handleChange(index, 'bullets', newBullets);
                                    }} placeholder="Bullet text..." />
                                    <button onClick={() => {
                                        const newBullets = [...(Array.isArray(b.bullets) ? b.bullets : [])];
                                        newBullets.splice(bIndex, 1);
                                        handleChange(index, 'bullets', newBullets);
                                    }} className="text-red-500 p-2 hover:bg-red-50 rounded"><i className="fas fa-trash text-xs"></i></button>
                                </div>
                            ))}
                            <button onClick={() => handleChange(index, 'bullets', [...(Array.isArray(b.bullets) ? b.bullets : []), { text: "", style: "check" }])} className="text-xs font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-1"><i className="fas fa-plus"></i> Add Bullet</button>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Story Box</button>
        </div>
    );
};

const WorkshopsEditor = ({ workshops, onChange }: { workshops: any[], onChange: (w: any[] | ((prev: any[]) => any[])) => void }) => {
    const handleAdd = () => onChange((prev) => [...(Array.isArray(prev) ? prev : []), { id: "w_"+Date.now(), priority_order: (prev?.length || 0)+1, heading: "DAY 1", title: "", icon: "", key_features: "", detail_bullets: { what_youll_learn: [], your_deliverables: [] }, pricing: { strike_price: 0, actual_price: 0, date_time_bullets: [], mode: "online", address: "" }, cta: { text: "Book Now", active: true }, visible: true }]);
    const handleRemove = (index: number) => { onChange(prev => { const newArr = [...(Array.isArray(prev) ? prev : [])]; newArr.splice(index, 1); return newArr; }); };
    const handleChange = (index: number, field: string, val: any) => { onChange(prev => { const newArr = [...(Array.isArray(prev) ? prev : [])]; newArr[index] = { ...newArr[index], [field]: val }; return newArr; }); };
    const handleDeepChange = (index: number, objName: string, propName: string, val: any) => {
        onChange(prev => {
            const newArr = [...(Array.isArray(prev) ? prev : [])];
            newArr[index] = { 
                ...newArr[index], 
                [objName]: {
                    ...newArr[index][objName],
                    [propName]: val
                }
            };
            return newArr;
        });
    };

    return (
        <div className="space-y-6">
            {(Array.isArray(workshops) ? workshops : []).map((w, index) => (
                <div key={index} className="border border-gray-300 rounded-xl bg-gray-50 shadow-sm relative overflow-hidden">
                    <div className="bg-gray-200 p-3 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-gray-700">Workshop {index + 1}</h4>
                        <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 bg-white w-7 h-7 rounded shadow-sm"><i className="fas fa-trash text-xs"></i></button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Priority Order</label><input type="number" className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.priority_order || 0} onChange={e => handleChange(index, 'priority_order', parseInt(e.target.value)||0)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Badge / Day (e.g. DAY 1)</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.heading || ""} onChange={e => handleChange(index, 'heading', e.target.value)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Title</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-500">Vector Icon</label>
                                <select className="w-full bg-white border border-gray-200 p-2 rounded outline-none text-xs text-gray-700 font-medium" value={w.icon || ""} onChange={e => handleChange(index, 'icon', e.target.value)}>
                                    <option value="">Auto-detect / Lightbulb</option>
                                    <option value="shield-halved">🛡️ Shield (DPDP / Security)</option>
                                    <option value="scale-balanced">⚖️ Scale (Legal / Contracts)</option>
                                    <option value="file-contract">📜 Document / Agreement</option>
                                    <option value="robot">🤖 Robot (AI / Automation)</option>
                                    <option value="rocket">🚀 Rocket (Pitch / Launch)</option>
                                    <option value="chart-pie">📊 Chart (Finance / Cap Table)</option>
                                    <option value="laptop-code">💻 Laptop (Coding / MVP)</option>
                                    <option value="lightbulb">💡 Lightbulb (Ideation)</option>
                                    <option value="handshake">🤝 Handshake (Partnership)</option>
                                    <option value="graduation-cap">🎓 Cap (Masterclass)</option>
                                    <option value="award">🏆 Trophy / Award</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white rounded border border-gray-200">
                            <label className="block text-xs font-bold mb-2 text-gray-500 p-2 pb-0">Key Features</label>
                            <ReactQuill modules={quillModules} theme="snow" value={w.key_features || ""} onChange={val => handleChange(index, 'key_features', val)} placeholder="Enter features using bullets..." />
                        </div>
                        
                        <div className="bg-gray-100 p-4 rounded border border-gray-200">
                            <label className="block text-sm font-bold mb-2 text-gray-700">Date & Time / Sessions (Rich Text)</label>
                            <div className="bg-white">
                                <ReactQuill modules={quillModules} theme="snow" value={w.date_time_html || ""} onChange={val => handleChange(index, 'date_time_html', val)} placeholder="Enter dates, times, and sessions with bullets..." />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold mb-2 text-gray-700">What You'll Learn (Rich Text / Bullets)</label>
                                <div className="bg-white">
                                    <ReactQuill 
                                        theme="snow"
                                        modules={quillModules}
                                        value={typeof w.detail_bullets?.what_youll_learn === 'string' ? w.detail_bullets.what_youll_learn : (Array.isArray(w.detail_bullets?.what_youll_learn) ? w.detail_bullets?.what_youll_learn : []).map((b: string) => `<li>${b}</li>`).join('') ? `<ul>${(Array.isArray(w.detail_bullets?.what_youll_learn) ? w.detail_bullets?.what_youll_learn : []).map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ""} 
                                        onChange={val => handleDeepChange(index, 'detail_bullets', 'what_youll_learn', val)} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-2 text-gray-700">Deliverables (Rich Text / Bullets)</label>
                                <div className="bg-white">
                                    <ReactQuill 
                                        theme="snow"
                                        modules={quillModules}
                                        value={typeof w.detail_bullets?.your_deliverables === 'string' ? w.detail_bullets.your_deliverables : (Array.isArray(w.detail_bullets?.your_deliverables) ? w.detail_bullets?.your_deliverables : []).map((b: string) => `<li>${b}</li>`).join('') ? `<ul>${(Array.isArray(w.detail_bullets?.your_deliverables) ? w.detail_bullets?.your_deliverables : []).map((b: string) => `<li>${b}</li>`).join('')}</ul>` : ""} 
                                        onChange={val => handleDeepChange(index, 'detail_bullets', 'your_deliverables', val)} 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-500">CTA Button Text</label>
                                <input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.cta?.text || ""} onChange={e => handleDeepChange(index, 'cta', 'text', e.target.value)} placeholder="Book Seat Now for this workshop" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Workshop</button>
        </div>
    );
};

/** A blank pricing card, seeded from the LMS course price when there is one.
 *  For an LMS-linked event that price is what checkout actually charges, so
 *  starting a new card at 0 guarantees the displayed figure disagrees with
 *  the real one until someone notices the mismatch warning. */
const blankPricingCard = (count: number, lmsPrice: number | null, title = "") => ({
    id: "p_" + Date.now(),
    priority_order: count + 1,
    heading: "OFFER",
    title,
    key_features: "",
    pricing: {
        strike_price: 0,
        actual_price: lmsPrice ?? 0,
        date_time_bullets: [],
        mode: "online",
        address: "",
    },
    cta: { text: "Book Now", active: true },
    visible: true,
});

const PricingEditor = ({ options, onChange, lmsCoursePrice }: { options: any[], onChange: (o: any[] | ((prev: any[]) => any[])) => void, lmsCoursePrice?: number | null }) => {
    const handleAdd = () => onChange((prev) => [...(Array.isArray(prev) ? prev : []), blankPricingCard((prev?.length || 0), lmsCoursePrice ?? null)]);
    const handleRemove = (index: number) => { onChange(prev => { const newArr = [...(Array.isArray(prev) ? prev : [])]; newArr.splice(index, 1); return newArr; }); };
    const handleChange = (index: number, field: string, val: any) => { onChange(prev => { const newArr = [...(Array.isArray(prev) ? prev : [])]; newArr[index] = { ...newArr[index], [field]: val }; return newArr; }); };
    
    return (
        <div className="space-y-6">
            {(Array.isArray(options) ? options : []).map((o, index) => (
                <div key={index} className="border border-gray-300 rounded-xl bg-gray-50 shadow-sm relative overflow-hidden">
                    <div className="bg-gray-200 p-3 flex justify-between items-center">
                        <h4 className="font-bold text-sm text-gray-700">Pricing Card {index + 1}</h4>
                        <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 bg-white w-7 h-7 rounded shadow-sm"><i className="fas fa-trash text-xs"></i></button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Priority Order</label><input type="number" className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={o.priority_order || 0} onChange={e => handleChange(index, 'priority_order', parseInt(e.target.value)||0)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Heading (e.g. OFFER)</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={o.heading || ""} onChange={e => handleChange(index, 'heading', e.target.value)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Title</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={o.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
                        </div>
                        <div className="bg-white rounded border border-gray-200">
                            <label className="block text-xs font-bold mb-2 text-gray-500 p-2 pb-0">Key Features / Description</label>
                            <ReactQuill modules={quillModules} theme="snow" value={o.key_features || ""} onChange={val => handleChange(index, 'key_features', val)} placeholder="Enter features using bullets..." />
                        </div>

                        <div className="bg-white p-4 rounded border border-gray-200 space-y-4">
                            <h5 className="font-bold text-xs text-gray-700 uppercase tracking-wide">Pricing & Details</h5>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Strike Price</label><input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.pricing?.strike_price || 0} onChange={e => handleChange(index, 'pricing', { ...o.pricing, strike_price: parseInt(e.target.value)||0 })} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Actual Price</label><input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.pricing?.actual_price || 0} onChange={e => handleChange(index, 'pricing', { ...o.pricing, actual_price: parseInt(e.target.value)||0 })} /></div>
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Mode</label><select className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.pricing?.mode || "online"} onChange={e => handleChange(index, 'pricing', { ...o.pricing, mode: e.target.value })}><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option></select></div>
                            </div>
                            {o.pricing?.mode !== 'online' && (
                                <div><label className="block text-xs font-bold mb-1 text-gray-500">Address (Offline/Hybrid)</label><input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.pricing?.address || ""} onChange={e => handleChange(index, 'pricing', { ...o.pricing, address: e.target.value })} placeholder="Full address details..." /></div>
                            )}
                            <div className="bg-gray-100 p-4 rounded border border-gray-200">
                                <label className="block text-sm font-bold mb-2 text-gray-700">Date & Time / Sessions (Rich Text)</label>
                                <div className="bg-white">
                                    <ReactQuill modules={quillModules} theme="snow" value={o.date_time_html || ""} onChange={val => handleChange(index, 'date_time_html', val)} placeholder="Enter dates, times, and sessions with bullets..." />
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-500">CTA Button Text</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.cta?.text || ""} onChange={e => handleChange(index, 'cta', { ...o.cta, text: e.target.value })} placeholder="Book Your Seat Now" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-500">Course Slug (LMS checkout)</label>
                                    <input className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none" value={o.course_slug || ""} onChange={e => handleChange(index, 'course_slug', e.target.value)} placeholder="e.g. startup-ideation-and-validation" />
                                    <p className="text-[11px] text-gray-400 mt-1">Buy Now opens <code>/courses/&lt;slug&gt;</code>. Leave blank to use this event&apos;s course. Use the bundle course&apos;s slug for an all-in-one card.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold mb-1 text-gray-500">Delivered through the LMS?</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 p-2 rounded outline-none"
                                        value={typeof o.uses_lms === 'boolean' ? String(o.uses_lms) : ''}
                                        onChange={e => handleChange(index, 'uses_lms', e.target.value === '' ? undefined : e.target.value === 'true')}
                                    >
                                        <option value="">Use the event&apos;s setting</option>
                                        <option value="true">Yes — course page + LMS account</option>
                                        <option value="false">No — pay on this page, no LMS</option>
                                    </select>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        <strong>Yes:</strong> Enroll opens the course page; the buyer gets an LMS account and credentials by email.{' '}
                                        <strong>No:</strong> Enroll collects name, email and phone, verifies the email and charges on this page — no course page, no LMS account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="text-sm font-bold text-accent-blue hover:text-blue-700 flex items-center gap-1 mt-2"><i className="fas fa-plus"></i> Add Pricing Card</button>
        </div>
    );
};

const initialPageData = {
    registrations_open: true,
    uses_lms: true,
    section_visibility: { hero: true, story: true, output: true, workshops: true, pricing: true, mentors: true, video_gallery: true, testimonials: true, faqs: true, contact: true },
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
    text_testimonials: [
        {
            id: "t1",
            name: "Sarah Lee",
            role: "Founder",
            company: "TechNova",
            city: "Bangalore",
            rating: 5,
            quote: "This program completely changed how I look at my business. Highly recommended!",
            visible: true
        }
    ],
    video_testimonials: [
        {
            id: "vt1",
            name: "John Doe",
            role: "CEO",
            company: "InnovateTech",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            video_description: "Great experience overall.",
            rating: 5,
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
    applicable_coupons: ["EARLYBIRD", "SUMMER20"],
    coupon: { code: "EARLYBIRD", discount_percent: 20, active: true },
    email_template: {
        enabled: false,
        subject: "Registration Confirmed: {{event_title}}",
        heading: "Registration Confirmed!",
        message_body: "Your registration for {{event_title}} is confirmed. We are excited to have you join us!",
        include_details_card: true,
        whatsapp_link: "",
        zoom_link: "",
        other_link: "",
        other_link_label: "Access Resources & Materials",
        custom_notes: "Please arrive 10 minutes early. Joining links and updates will also be shared closer to the date."
    }
};

const SupportingImageEditor = ({ 
    imageUrl, 
    onUpload, 
    event, 
    pageData 
}: { 
    imageUrl?: string, 
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    event: any, 
    pageData: any 
}) => {
    const [targetRatio, setTargetRatio] = useState<'1:1' | '4:5'>('1:1');
    const [promptCopied, setPromptCopied] = useState(false);
    const [showPromptBox, setShowPromptBox] = useState(false);
    const [detectedDimensions, setDetectedDimensions] = useState<{ width: number; height: number; ratio: number; label: string } | null>(null);

    useEffect(() => {
        if (!imageUrl) {
            setDetectedDimensions(null);
            return;
        }
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const r = w / h;
            let label = 'Square (1:1)';
            if (r > 1.5) label = 'Landscape 16:9';
            else if (r > 1.1) label = 'Landscape 4:3';
            else if (r < 0.85) label = 'Portrait 4:5 / 9:16';
            else label = 'Square (1:1)';
            setDetectedDimensions({ width: w, height: h, ratio: r, label });
        };
    }, [imageUrl]);

    // Build the AI Prompt based on event details
    const eventTitle = event?.title || pageData?.hero?.headline?.replace(/<[^>]*>?/gm, '') || "Event Workshop";
    const sectionHeadline = pageData?.output?.headline?.replace(/<[^>]*>?/gm, '') || "What You'll Learn";
    const bulletsList = Array.isArray(pageData?.output?.bullets) 
        ? pageData.output.bullets.filter(Boolean).map((b: string) => `• ${b}`).join('\n') 
        : '';
    const mentorsList = Array.isArray(pageData?.mentors?.items)
        ? pageData.mentors.items.filter((m: any) => m.name).map((m: any) => `${m.name} (${m.professional_headline || m.role || ''})`).join(', ')
        : '';

    const generatedPrompt = `I have attached an existing 16:9 landscape workshop banner. 
Please convert, rearrange, and adapt this into a clean, modern ${targetRatio === '1:1' ? '1:1 Square (1080x1080)' : '4:5 Vertical Poster (1080x1350)'} graphic that fits perfectly into a vertical section card without cutting off any text or graphics:

1. CORE BRANDING & TYPOGRAPHY:
- Title: "${eventTitle}"
- Section Focus: "${sectionHeadline}"
- Brand Style: Setu Startup School theme with deep navy (#13113B), vibrant violet/purple accents (#8B5CF6, #D946EF), crisp white text, and clean modern card aesthetic.

2. INFORMATION TO RETAIN (DO NOT CUT OFF):
${bulletsList ? `Key Topics / Deliverables:\n${bulletsList}` : ''}
${mentorsList ? `Featured Speakers / Mentors: ${mentorsList}` : ''}

3. COMPOSITION INSTRUCTIONS:
- Rearrange the horizontal landscape layout into a balanced vertical / square format.
- Do not stretch or distort the original image or text.
- Ensure all text, logos, badges, and faces have generous margins from the edges so nothing gets cropped on the website.
- Output aspect ratio: Exactly ${targetRatio} (${targetRatio === '1:1' ? '1080x1080' : '1080x1350'}).`;

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2500);
    };

    const isMismatch = detectedDimensions && detectedDimensions.ratio > 1.2;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <label className="block text-sm font-bold text-gray-800">Supporting Image</label>
                    <p className="text-xs text-gray-500">
                        This image is displayed in the "The Output" section on the frontend as a vertical/square card (h: 600px).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowPromptBox(!showPromptBox)}
                    className="text-xs font-bold text-accent-blue hover:text-purple-700 flex items-center gap-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 px-3 py-1.5 rounded-lg transition-all"
                >
                    <i className="fas fa-magic"></i>
                    <span>{showPromptBox ? 'Hide AI Prompt Tool' : 'Generate AI Image Prompt'}</span>
                </button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={onUpload} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                    />
                    <div className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shrink-0">
                        Target Ratio: <span className="text-purple-600 font-bold">1:1 Square</span> or <span className="text-purple-600 font-bold">4:5 Portrait</span>
                    </div>
                </div>

                {imageUrl && (
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 pt-3 border-t border-gray-200/80">
                        <div className="relative group shrink-0 rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-slate-900 w-32 h-32 flex items-center justify-center p-1">
                            <img src={imageUrl} alt="Supporting Image Preview" className="w-full h-full object-contain rounded-lg" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            {detectedDimensions && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                                        isMismatch 
                                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}>
                                        <i className={`fas fa-${isMismatch ? 'triangle-exclamation' : 'check-circle'}`}></i>
                                        Detected: {detectedDimensions.label} ({detectedDimensions.width} × {detectedDimensions.height}px)
                                    </span>
                                </div>
                            )}

                            {isMismatch ? (
                                <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                    <p className="font-bold mb-1">⚠️ Aspect ratio does not match vertical requirement:</p>
                                    <p>
                                        This image is <strong>{detectedDimensions?.label}</strong>, but this section requires a <strong>1:1 Square</strong> or <strong>4:5 Portrait</strong> image so that text, logos, and mentor photos don&apos;t look small or leave empty margins on the frontend.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowPromptBox(true)}
                                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors"
                                    >
                                        <i className="fas fa-wand-magic-sparkles"></i>
                                        Click here to generate ChatGPT prompt to adapt this image
                                    </button>
                                </div>
                            ) : (
                                <p className="text-xs text-emerald-700 font-medium">
                                    ✓ Aspect ratio is well-suited for the vertical card display on the website.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Image Conversion Prompt Generator Box */}
            {showPromptBox && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200/60 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-accent-blue text-white flex items-center justify-center text-xs shadow-sm">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">AI Prompt Generator for Aspect Ratio Conversion</h4>
                                <p className="text-xs text-gray-500">Paste this prompt + your image into ChatGPT / DALL-E to convert it without losing information.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-gray-600">Target Ratio:</label>
                            <div className="inline-flex rounded-lg bg-white p-1 border border-purple-200 shadow-xs">
                                <button
                                    type="button"
                                    onClick={() => setTargetRatio('1:1')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                                        targetRatio === '1:1' 
                                            ? 'bg-accent-blue text-white shadow-xs' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    1:1 Square
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTargetRatio('4:5')}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                                        targetRatio === '4:5' 
                                            ? 'bg-accent-blue text-white shadow-xs' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    4:5 Portrait
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <textarea
                                readOnly
                                value={generatedPrompt}
                                rows={7}
                                className="w-full font-mono text-xs text-gray-800 bg-white border border-purple-200 rounded-xl p-3.5 outline-none custom-scrollbar leading-relaxed resize-y"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                            <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>Includes current event title, headline, deliverables, and speaker credentials.</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                                    promptCopied 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-accent-blue hover:bg-accent-blue/90 text-white'
                                }`}
                            >
                                <i className={`fas fa-${promptCopied ? 'check' : 'copy'}`}></i>
                                <span>{promptCopied ? 'Copied to Clipboard!' : 'Copy AI Prompt'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/80 border border-purple-200/70 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                        <span className="font-bold text-purple-900 block mb-0.5">Quick How-To:</span>
                        <p>1. Click <strong>Copy AI Prompt</strong> above.</p>
                        <p>2. Open <strong>ChatGPT (GPT-4o)</strong>, attach your 16:9 image, and paste this prompt.</p>
                        <p>3. Download the generated image and upload it in the file box above. It will fit 100% perfectly without any clipping!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const EmailTemplateEditor = ({
    template,
    onChange,
    event,
    eventId
}: {
    template: any;
    onChange: (t: any) => void;
    event: any;
    eventId: string;
}) => {
    const [testEmail, setTestEmail] = useState("");
    const [sendingTest, setSendingTest] = useState(false);
    const [testStatus, setTestStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

    const isCustom = template?.enabled === true;

    const variables = [
        { key: '{{name}}', label: 'Attendee Name' },
        { key: '{{event_title}}', label: 'Event Title' },
        { key: '{{event_date}}', label: 'Date & Time' },
        { key: '{{event_venue}}', label: 'Venue / Mode' },
        { key: '{{ticket_tier}}', label: 'Ticket / Workshop' },
        { key: '{{amount}}', label: 'Amount Paid' },
        { key: '{{payment_id}}', label: 'Order / Reg ID' },
        { key: '{{whatsapp_link}}', label: 'WhatsApp Link' },
        { key: '{{zoom_link}}', label: 'Zoom Link' },
        { key: '{{other_link}}', label: 'Other URL' },
    ];

    const handleCopy = (v: string) => {
        navigator.clipboard.writeText(v);
        setCopiedVar(v);
        setTimeout(() => setCopiedVar(null), 2000);
    };

    const handleFieldChange = (field: string, val: any) => {
        onChange({
            ...(template || {}),
            [field]: val
        });
    };

    const handleSendTest = async () => {
        if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            setTestStatus({ type: 'error', message: 'Please enter a valid recipient email address.' });
            return;
        }

        setSendingTest(true);
        setTestStatus(null);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/test-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId: eventId,
                    event_id: eventId,
                    toEmail: testEmail,
                    recipient_email: testEmail,
                    templateConfig: template,
                    custom_template: template
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setTestStatus({ 
                    type: 'success', 
                    message: `✓ Test email sent to ${testEmail}! Check your inbox (or spam/promotions folder if receiving for the first time).` 
                });
            } else {
                setTestStatus({ 
                    type: 'error', 
                    message: data.error || 'Failed to send test email. Please ensure backend mailer is configured.' 
                });
            }
        } catch (err: any) {
            setTestStatus({ type: 'error', message: err?.message || 'Network error while sending test email.' });
        } finally {
            setSendingTest(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header with Title & Switcher */}
            <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">
                                <i className="fas fa-envelope-open-text"></i>
                            </span>
                            Registration Confirmation Email
                        </h2>
                        <p className="text-gray-500 text-xs mt-1">
                            Dispatched automatically to every participant upon completing registration (free, paid, or LMS).
                        </p>
                    </div>

                    {/* Mode Toggle Switch */}
                    <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 shrink-0">
                        <button
                            type="button"
                            onClick={() => handleFieldChange('enabled', false)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                                !isCustom 
                                    ? 'bg-white text-purple-700 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <i className="fas fa-sparkles"></i>
                            Default Template
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFieldChange('enabled', true)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                                isCustom 
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <i className="fas fa-pen-nib"></i>
                            Custom Message
                        </button>
                    </div>
                </div>
            </div>

            {/* Mode Banner */}
            {!isCustom ? (
                <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <i className="fas fa-check-circle text-lg"></i>
                    </div>
                    <div className="flex-1 text-sm text-gray-800">
                        <p className="font-bold text-gray-900 text-sm mb-0.5">Default System Template is Active</p>
                        <p className="text-gray-600 text-xs leading-relaxed mb-3">
                            The system will automatically send our high-converting, branded confirmation email featuring the Setu Startup School logo, event details card, receipt summary, and calendar invite.
                        </p>
                        <button 
                            type="button" 
                            onClick={() => handleFieldChange('enabled', true)} 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                            <i className="fas fa-edit"></i> Switch to Custom Message
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <i className="fas fa-paint-brush text-sm"></i>
                    </div>
                    <div className="flex-1 text-xs text-purple-950">
                        <span className="font-bold">Custom Message Active:</span> Attendees of this event will receive the customized content, links, and instructions below.
                    </div>
                </div>
            )}

            {/* Custom Content Form (Visible when Custom is Active) */}
            {isCustom && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                    {/* Dynamic Variables Chips */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                <i className="fas fa-code text-purple-600"></i>
                                Dynamic Tags (Click to Copy & Paste)
                            </span>
                            {copiedVar && (
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                    <i className="fas fa-check"></i> Copied {copiedVar}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {variables.map(v => (
                                <button
                                    key={v.key}
                                    type="button"
                                    onClick={() => handleCopy(v.key)}
                                    title={`Click to copy: ${v.label}`}
                                    className="inline-flex items-center gap-1.5 bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-300 px-2.5 py-1 rounded-lg text-xs font-mono transition-all shadow-2xs"
                                >
                                    <span className="text-purple-600 font-bold">{v.key}</span>
                                    <span className="text-[10px] text-gray-400 font-sans">({v.label})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject Line */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                            Email Subject Line <span className="text-red-500">*</span>
                        </label>
                        <input 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:border-purple-500 outline-none text-sm font-medium transition-all"
                            value={template?.subject || ""} 
                            onChange={e => handleFieldChange('subject', e.target.value)} 
                            placeholder="e.g. Registration Confirmed: {{event_title}}"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Keep it crisp and relevant to ensure high open rates and avoid spam filters.</p>
                    </div>

                    {/* Title / Heading */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                            Header Banner Title / Heading
                        </label>
                        <input 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:border-purple-500 outline-none text-sm font-medium transition-all"
                            value={template?.heading || ""} 
                            onChange={e => handleFieldChange('heading', e.target.value)} 
                            placeholder="e.g. Registration Confirmed!"
                        />
                    </div>

                    {/* Main Welcome Message */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                            Main Welcome & Confirmation Message
                        </label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl focus:bg-white focus:border-purple-500 outline-none text-sm h-36 font-sans leading-relaxed transition-all"
                            value={template?.message_body || ""} 
                            onChange={e => handleFieldChange('message_body', e.target.value)} 
                            placeholder="Hi {{name}},\n\nYour registration for {{event_title}} is confirmed. We are excited to have you join us!"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Use line breaks for paragraphs. Supports dynamic tags like <code className="bg-gray-100 text-purple-600 px-1 rounded font-mono">{"{{name}}"}</code> and <code className="bg-gray-100 text-purple-600 px-1 rounded font-mono">{"{{event_title}}"}</code>.</p>
                    </div>

                    {/* 3 Action Links Section */}
                    <div className="border-t border-gray-200 pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                                <i className="fas fa-link text-purple-600"></i>
                                Action Buttons & Links (Optional)
                            </label>
                            <span className="text-[11px] text-gray-400">Prominent colored buttons inside the email</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Link 1: WhatsApp */}
                            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                                        <i className="fab fa-whatsapp"></i>
                                    </span>
                                    1. WhatsApp Community Link
                                </div>
                                <input 
                                    className="w-full bg-white border border-emerald-200 p-2.5 rounded-lg focus:border-emerald-500 outline-none text-xs"
                                    value={template?.whatsapp_link || ""} 
                                    onChange={e => handleFieldChange('whatsapp_link', e.target.value)} 
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                                <p className="text-[10px] text-emerald-700/80">Renders as a green &quot;Join WhatsApp Community&quot; button.</p>
                            </div>

                            {/* Link 2: Zoom */}
                            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                                        <i className="fas fa-video"></i>
                                    </span>
                                    2. Live Zoom / Meeting URL
                                </div>
                                <input 
                                    className="w-full bg-white border border-blue-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-xs"
                                    value={template?.zoom_link || ""} 
                                    onChange={e => handleFieldChange('zoom_link', e.target.value)} 
                                    placeholder="https://zoom.us/j/... or Google Meet"
                                />
                                <p className="text-[10px] text-blue-700/80">Renders as a purple &quot;Join Zoom Session&quot; button.</p>
                            </div>

                            {/* Link 3: Other URL */}
                            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2 md:col-span-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                                        <i className="fas fa-external-link-alt"></i>
                                    </span>
                                    3. Other Resource / Materials URL
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="sm:col-span-1">
                                        <input 
                                            className="w-full bg-white border border-purple-200 p-2.5 rounded-lg focus:border-purple-500 outline-none text-xs font-medium"
                                            value={template?.other_link_label || ""} 
                                            onChange={e => handleFieldChange('other_link_label', e.target.value)} 
                                            placeholder="Button Label (e.g. Access Materials)"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <input 
                                            className="w-full bg-white border border-purple-200 p-2.5 rounded-lg focus:border-purple-500 outline-none text-xs"
                                            value={template?.other_link || ""} 
                                            onChange={e => handleFieldChange('other_link', e.target.value)} 
                                            placeholder="https://drive.google.com/... or Notion link"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-purple-700/80">Renders as a dark action button with your custom label.</p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Summary Card Toggle */}
                    <div className="border-t border-gray-200 pt-5">
                        <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-gray-50 hover:bg-purple-50/50 rounded-xl border border-gray-200 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={template?.include_details_card !== false} 
                                onChange={e => handleFieldChange('include_details_card', e.target.checked)} 
                                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                            />
                            <div>
                                <span className="font-bold text-xs text-gray-800 block">Include Registration & Receipt Summary Card</span>
                                <span className="text-[11px] text-gray-500">Displays Event Title, Schedule, Venue/Mode, Ticket Tier, and Amount Paid in a structured card.</span>
                            </div>
                        </label>
                    </div>

                    {/* Important Instructions / Notes */}
                    <div className="border-t border-gray-200 pt-5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                            Important Notes / Pre-requisite Instructions (Optional)
                        </label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:bg-white focus:border-purple-500 outline-none text-xs h-20 transition-all"
                            value={template?.custom_notes || ""} 
                            onChange={e => handleFieldChange('custom_notes', e.target.value)} 
                            placeholder="e.g. Please join 10 minutes prior to the start time. Keep your laptop ready with internet connectivity."
                        />
                    </div>
                </div>
            )}

            {/* Spam Protection & Deliverability Notice */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-sm shadow-xs mt-0.5">
                    <i className="fas fa-shield-alt"></i>
                </div>
                <div className="flex-1 text-xs text-emerald-950 leading-relaxed">
                    <p className="font-bold text-emerald-900 mb-0.5">Inbox Deliverability & Anti-Spam Active</p>
                    <p className="text-emerald-800/90 text-[11px]">
                        Emails are dispatched with dual MIME format (HTML + clean plain-text fallback), verified SPF/DKIM headers, and <code className="bg-white/80 px-1 py-0.5 rounded text-emerald-900 font-mono">support@setustartupschool.com</code> reply-to to ensure emails land directly in the Primary inbox.
                    </p>
                </div>
            </div>

            {/* Test Email Dispatch Panel */}
            <div className="bg-gradient-to-br from-[#0B091E] to-[#161244] border border-purple-500/30 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs shadow-xs">
                            <i className="fas fa-paper-plane"></i>
                        </span>
                        <h3 className="text-sm font-bold text-white">Send Test Confirmation Email</h3>
                    </div>
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-900/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Live Preview
                    </span>
                </div>
                <p className="text-xs text-purple-200/70 leading-relaxed">
                    Send a test email to your inbox to review formatting, tags, subject line, and action buttons exactly as attendees will receive them.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <input 
                        type="email"
                        value={testEmail}
                        onChange={e => setTestEmail(e.target.value)}
                        placeholder="Enter test email (e.g. founder@example.com)..."
                        className="flex-1 bg-[#1A164D] border border-purple-500/40 p-3 rounded-xl focus:border-purple-400 outline-none text-xs text-white placeholder-purple-300/50"
                    />
                    <button
                        type="button"
                        onClick={handleSendTest}
                        disabled={sendingTest}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                        {sendingTest ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin"></i>
                                Sending Test Email...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Send Test Email
                            </>
                        )}
                    </button>
                </div>
                {testStatus && (
                    <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                        testStatus.type === 'success' 
                            ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40' 
                            : 'bg-red-950/80 text-red-200 border border-red-500/40'
                    }`}>
                        <i className={`fas fa-${testStatus.type === 'success' ? 'check-circle text-emerald-400' : 'exclamation-circle text-red-400'} mt-0.5`}></i>
                        <span className="flex-1 leading-relaxed">{testStatus.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
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
    const [testimonialTab, setTestimonialTab] = useState("text");
    const [adminSources, setAdminSources] = useState<any[]>([]);
    const [globalCoupons, setGlobalCoupons] = useState<any[]>([]);
    const [lmsCoursePrice, setLmsCoursePrice] = useState<number | null>(null); // rupees — the EVENT-level course price, used to seed a first card
    // course slug -> price in rupees, for every course any pricing card points at.
    // A card can name its own course_slug, so the event's course price is not
    // the right yardstick for all of them — see the mismatch check below.
    const [coursePrices, setCoursePrices] = useState<Record<string, number>>({});
    // null until the event has been fetched. False means the API returned a row
    // with no `page_blocks`, so what is on screen is the empty default — NOT
    // the event's real content, and must never be written over it.
    const [loadedPageBlocks, setLoadedPageBlocks] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchSourcesAndCoupons = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const headers = { "Authorization": `Bearer ${token}` };
                
                const [sourcesRes, couponsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/lead-sources`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons/admin`, { headers })
                ]);
                
                if (sourcesRes.ok) {
                    const data = await sourcesRes.json();
                    setAdminSources(Array.isArray(data) ? data : []);
                }
                
                if (couponsRes.ok) {
                    const couponsData = await couponsRes.json();
                    setGlobalCoupons(Array.isArray(couponsData) ? couponsData.filter((c: any) => c.is_active) : []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSourcesAndCoupons();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?all=true`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                const found = data.find((e: any) => e.id === id);
                if (found) {
                    setEvent(found);

                    // Unified Events: LMS-linked events CHARGE the LMS course
                    // price at checkout — fetch it so the Pricing tab can warn
                    // when the display prices disagree with the real charge.
                    if (found.lms_course_slug) {
                        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/courses/${found.lms_course_slug}`)
                            .then(r => (r.ok ? r.json() : null))
                            .then(c => { if (c && typeof c.price === 'number') setLmsCoursePrice(c.price); })
                            .catch(() => {});
                    }
                    
                    // A brand-new event legitimately has no page_blocks yet; a
                    // response that omitted the column does not. Distinguish
                    // them, because only the first is safe to save from.
                    setLoadedPageBlocks(Object.prototype.hasOwnProperty.call(found, 'page_blocks'));

                    let parsedData = typeof found.page_blocks === 'string' ? JSON.parse(found.page_blocks) : (found.page_blocks || {});
                    if (Array.isArray(parsedData)) {
                        parsedData = initialPageData;
                    }
                    
                    const migratedPricingOptions = parsedData.pricing_options || (parsedData.workshops || []).map((w: any, idx: number) => ({
                        id: w.id || `p_${Date.now()}_${idx}`,
                        priority_order: w.priority_order || idx + 1,
                        heading: w.heading || "OFFER",
                        title: w.title || "",
                        key_features: w.key_features || "",
                        pricing: w.pricing || { strike_price: 0, actual_price: 0, date_time_bullets: [], mode: "online", address: "" },
                        cta: w.cta || { text: "Book Now", active: true },
                        visible: true
                    }));

                    setPageData({
                        ...initialPageData,
                        ...parsedData,
                        pricing_options: migratedPricingOptions,
                        section_visibility: { ...initialPageData.section_visibility, ...(parsedData.section_visibility || {}) },
                        hero: { ...initialPageData.hero, ...(parsedData.hero || {}) },
                        story: { ...initialPageData.story, ...(parsedData.story || {}) },
                        output: { ...initialPageData.output, ...(parsedData.output || {}) },
                        mentors: { ...initialPageData.mentors, ...(parsedData.mentors || {}) },
                        video_gallery: { ...initialPageData.video_gallery, ...(parsedData.video_gallery || {}) },
                        text_testimonials: parsedData.text_testimonials || initialPageData.text_testimonials,
                        video_testimonials: parsedData.video_testimonials || initialPageData.video_testimonials,
                        contact: {
                            whatsapp: { ...initialPageData.contact?.whatsapp, ...(parsedData.contact?.whatsapp || {}) },
                            lead_gen: { ...initialPageData.contact?.lead_gen, ...(parsedData.contact?.lead_gen || {}) }
                        },
                        applicable_coupons: parsedData.applicable_coupons || initialPageData.applicable_coupons,
                        uses_lms: typeof parsedData.uses_lms === 'boolean' ? parsedData.uses_lms : true,
                        coupon: { ...initialPageData.coupon, ...(parsedData.coupon || {}) },
                        email_template: { ...initialPageData.email_template, ...(parsedData.email_template || {}) }
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
        // Refuse to save what we never loaded. Saving here PUTs the whole
        // in-memory pageData over page_blocks, so if the fetch came back
        // without that column the screen holds empty defaults and one click
        // would destroy the live page's pricing, mentors, FAQs and workshops.
        // This exact regression shipped on 26 Jul 2026 (b89db37) and went
        // unnoticed for two weeks, because a blank builder looks like an
        // unfinished event rather than a failure.
        if (loadedPageBlocks === false) {
            alert(
                "Can't save — this event's content didn't load.\n\n" +
                "The API returned the event without its page_blocks, so every " +
                "section on screen is showing empty defaults, not your real " +
                "content. Saving now would overwrite the live page.\n\n" +
                "Reload the page. If it stays empty, the backend is serving the " +
                "cut-down event list to admins — see GET /api/events in server.js."
            );
            return;
        }
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

    // Fetch the LMS price of every course the pricing cards point at.
    // Cheap and idempotent: only slugs we have not already priced are fetched.
    useEffect(() => {
        const referenced: string[] = (pageData?.pricing_options || [])
            .map((c: any) => c?.course_slug || event?.lms_course_slug)
            .filter((s: any) => typeof s === 'string' && s.length > 0);
        const slugs = Array.from(new Set<string>(referenced)).filter((s) => !(s in coursePrices));
        if (slugs.length === 0) return;

        let cancelled = false;
        Promise.all(slugs.map(async (slug) => {
            try {
                const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/courses/${slug}`);
                if (!r.ok) return null;
                const c = await r.json();
                return typeof c?.price === 'number' ? ([slug, c.price] as const) : null;
            } catch { return null; }
        })).then((pairs) => {
            if (cancelled) return;
            const found = pairs.filter(Boolean) as (readonly [string, number])[];
            if (found.length) setCoursePrices((prev) => ({ ...prev, ...Object.fromEntries(found) }));
        });
        return () => { cancelled = true; };
    }, [pageData?.pricing_options, event?.lms_course_slug, coursePrices]);

    /**
     * Cards whose displayed price is not what the buyer would actually be charged.
     *
     * Only a card routed to /courses/<slug> can mismatch: that checkout charges
     * Course.price and ignores the number typed here. A card that opens the
     * on-page modal is charged from its own actual_price, so it cannot disagree
     * with itself.
     *
     * Each card is compared against ITS OWN course. Comparing every card to the
     * event's course price raised a false alarm on any event selling more than
     * one thing — AI Startup Launchpad has four cards (three workshops plus the
     * bundle), all correctly priced, and the old check flagged three of them and
     * advised setting them all to the bundle price.
     */
    const priceMismatches = (pageData?.pricing_options || []).flatMap((card: any) => {
        const target = resolveCheckoutTarget(card, { uses_lms: pageData?.uses_lms }, event?.lms_course_slug);
        if (target.mode !== 'course') return [];
        const charged = coursePrices[target.slug];
        if (typeof charged !== 'number') return [];
        const shown = Number(card?.pricing?.actual_price ?? 0);
        return shown === charged ? [] : [{ title: card?.title || '(untitled card)', slug: target.slug, shown, charged }];
    });

    const tabs = [
        { id: 'visibility', label: 'Visibility & Toggles' },
        { id: 'hero', label: 'Hero Section' },
        { id: 'story', label: 'Story Section' },
        { id: 'output', label: 'The Output' },
        { id: 'workshop_breakdown', label: 'Workshop Breakdown' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'mentors', label: 'Mentors' },
        { id: 'video_gallery', label: 'Video Gallery' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'faqs', label: 'FAQs' },
        { id: 'contact', label: 'Contact Details' },
        { id: 'coupons', label: 'Coupons' },
        { id: 'email_template', label: 'Confirmation Email' }
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

            {/* Loud, unmissable: a blank builder is indistinguishable from an
                unfinished event, which is why the 26 Jul regression sat for
                two weeks. Say so before anyone starts typing into it. */}
            {loadedPageBlocks === false && (
                <div className="max-w-7xl mx-auto px-8 pt-6">
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-800">
                        <strong className="block font-bold">This event&apos;s content didn&apos;t load — don&apos;t edit or save.</strong>
                        The API returned this event without its <code className="font-mono">page_blocks</code>, so every
                        section below is showing empty defaults rather than the real page. Saving would overwrite the
                        live event. Reload; if it stays empty, <code className="font-mono">GET /api/events</code> is
                        serving admins the cut-down list projection.
                    </div>
                </div>
            )}

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
                            <p className="text-gray-500 text-sm mb-6">Toggle which sections appear on the final landing page, and control global registration status.</p>
                            
                            <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input type="checkbox" checked={pageData.registrations_open !== false} onChange={e => {
                                        setPageData({...pageData, registrations_open: e.target.checked})
                                    }} className="w-6 h-6 accent-blue-600 rounded" />
                                    <div>
                                        <span className="font-bold text-blue-900 block text-lg">Registrations Open (Global)</span>
                                        <span className="text-sm text-blue-700/80">If disabled, all CTA buttons will change to "Sold Out" or "Registrations Closed"</span>
                                    </div>
                                </label>
                            </div>

                            <div className="mb-8 p-5 bg-purple-50/50 border border-purple-100 rounded-xl">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <input type="checkbox" checked={pageData.uses_lms !== false} onChange={e => {
                                        setPageData({...pageData, uses_lms: e.target.checked})
                                    }} className="w-6 h-6 accent-purple-600 rounded" />
                                    <div>
                                        <span className="font-bold text-purple-900 block text-lg">Delivered through the LMS (Global)</span>
                                        <span className="text-sm text-purple-700/80">
                                            On: Enroll opens the course page and the buyer gets an LMS account with credentials by email.
                                            Off: Enroll collects name, email and phone, verifies the email and charges on this page — no course page, no LMS account.
                                            Individual pricing cards can override this.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Visible Sections</h3>
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
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Top Badge (e.g. Live Workshop Series • May 15-17)</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:border-accent-blue outline-none text-sm" value={pageData.hero?.top_badge || ""} onChange={e => updateData('hero', 'top_badge', e.target.value)} placeholder="Enter badge text (optional)..." /></div>
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
                                <StoryBoxesEditor boxes={pageData.story?.boxes || []} onChange={v => updateData('story', 'boxes', v)} onUpload={handleUpload} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'output' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">The Output</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Headline (Rich Text)</label><div className="bg-white"><ReactQuill modules={quillModules} theme="snow" value={pageData.output?.headline || ""} onChange={val => updateData('output', 'headline', val)} /></div></div>
                            <SupportingImageEditor
                                imageUrl={pageData.output?.image_url}
                                onUpload={(e) => handleImageUpload(e, 'output', 'image_url')}
                                event={event}
                                pageData={pageData}
                            />
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Deliverable Bullets</label><StringArrayEditor value={pageData.output?.bullets || []} onChange={v => updateData('output', 'bullets', v)} placeholder='e.g. "Build a SaaS...", "Raise Funds..."' /></div>
                        </div>
                    )}

                    {activeTab === 'workshop_breakdown' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Workshop Breakdown</h2>
                            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl font-medium">Define the core curriculum.</p>
                            <WorkshopsEditor workshops={pageData.workshops || []} onChange={v => setPageData((prev: any) => ({...prev, workshops: typeof v === 'function' ? v(prev.workshops || []) : v}))} />
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Pricing</h2>
                            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl font-medium">Create independent pricing options.</p>
                            {/* Display-vs-charge mismatch, checked per card against the
                                course THAT card sells. Cards selling different courses at
                                different prices are normal and are not flagged. */}
                            {priceMismatches.length > 0 && (
                                <div className="text-sm text-red-800 bg-red-50 border border-red-200 p-4 rounded-xl font-medium">
                                    <i className="fas fa-triangle-exclamation mr-2"></i>
                                    {priceMismatches.length === 1 ? 'This card shows' : `${priceMismatches.length} cards show`}{' '}
                                    a price the buyer will not be charged. Buying through a card that opens
                                    <code className="mx-1 font-mono text-xs">/courses/…</code> charges the LMS course price,
                                    and the figure typed here is only displayed.
                                    <ul className="mt-2 list-disc space-y-1 pl-5 font-normal">
                                        {priceMismatches.map((m: any) => (
                                            <li key={m.slug + m.title}>
                                                <strong>{m.title}</strong> — page shows ₹{m.shown.toLocaleString('en-IN')},
                                                buyer pays <strong>₹{m.charged.toLocaleString('en-IN')}</strong>{' '}
                                                (<code className="font-mono text-xs">{m.slug}</code>)
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="mt-2 block font-normal">
                                        Fix the price on the card, or change that course&apos;s price in the LMS.
                                    </span>
                                </div>
                            )}
                            {/* An LMS-linked event with a price but no card sells at a
                                price the page never states. Offer to create the card
                                rather than writing one silently — an implicit write here
                                is what the visibility mirror was deliberately built to
                                avoid (see 90c3fd8). */}
                            {lmsCoursePrice !== null && (pageData.pricing_options || []).length === 0 && (
                                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                                    <p className="font-medium">
                                        This event is linked to an LMS course priced at{' '}
                                        <strong>₹{lmsCoursePrice.toLocaleString('en-IN')}</strong>, but it has no pricing
                                        card — so the page never tells buyers what they will pay, while checkout still
                                        charges them that amount.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setPageData((prev: any) => ({
                                            ...prev,
                                            pricing_options: [
                                                ...(prev.pricing_options || []),
                                                blankPricingCard(0, lmsCoursePrice, event?.title || ''),
                                            ],
                                        }))}
                                        className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-700"
                                    >
                                        Create a card at ₹{lmsCoursePrice.toLocaleString('en-IN')}
                                    </button>
                                    <span className="ml-3 text-xs text-amber-800">Nothing is saved until you press Save Changes.</span>
                                </div>
                            )}
                            <PricingEditor
                                options={pageData.pricing_options || []}
                                lmsCoursePrice={lmsCoursePrice}
                                onChange={v => setPageData((prev: any) => ({...prev, pricing_options: typeof v === 'function' ? v(prev.pricing_options || []) : v}))}
                            />
                        </div>
                    )}

                    {activeTab === 'mentors' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Mentors</h2>
                            <div><label className="block text-sm font-bold mb-2 text-gray-700">Section Headline</label><input className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:bg-white outline-none focus:border-accent-blue" value={pageData.mentors?.section_headline || ""} onChange={e => updateData('mentors', 'section_headline', e.target.value)} /></div>
                            <div>
                                <MentorsEditor items={pageData.mentors?.items || []} onChange={v => updateData('mentors', 'items', v)} onUpload={handleUpload} />
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
                            <div className="flex justify-between items-center border-b pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
                                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setTestimonialTab("text")}
                                        className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${testimonialTab === "text" ? "bg-white text-accent-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >Text Testimonials</button>
                                    <button 
                                        onClick={() => setTestimonialTab("video")}
                                        className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${testimonialTab === "video" ? "bg-white text-accent-blue shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >Video Testimonials</button>
                                </div>
                            </div>
                            
                            {testimonialTab === "text" && (
                                <TextTestimonialsEditor items={pageData.text_testimonials || []} onChange={v => setPageData({...pageData, text_testimonials: v})} />
                            )}
                            
                            {testimonialTab === "video" && (
                                <VideoTestimonialsEditor items={pageData.video_testimonials || []} onChange={v => setPageData({...pageData, video_testimonials: v})} />
                            )}
                        </div>
                    )}

                    {activeTab === 'faqs' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">FAQs</h2>
                            <FaqsEditor faqs={pageData.faqs || []} onChange={v => setPageData({...pageData, faqs: v})} />
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Contact Details</h2>

                            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm">
                                <h3 className="font-bold mb-4 text-lg text-gray-800"><i className="fab fa-whatsapp text-green-500 mr-2"></i>WhatsApp Block</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Headline</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.headline || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, headline: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Button Text</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.button_text || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, button_text: e.target.value}}})} /></div>
                                    <div><label className="block text-xs font-bold mb-2 text-gray-500 uppercase tracking-wider">Number/Link</label><input className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-accent-blue outline-none" value={pageData.contact?.whatsapp?.link || ""} onChange={e => setPageData({...pageData, contact: {...pageData.contact, whatsapp: {...pageData.contact.whatsapp, link: e.target.value}}})} /></div>
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

                        </div>
                    )}

                    {activeTab === 'coupons' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Global Coupons</h2>
                            <div className="border border-purple-200 rounded-xl p-6 bg-purple-50 shadow-sm">
                                <h3 className="font-bold mb-4 text-lg text-purple-900"><i className="fas fa-ticket-alt text-purple-600 mr-2"></i>Global Coupon System</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold mb-2 text-purple-700 uppercase tracking-wider">Featured Coupon Code</label>
                                        <select 
                                            className="w-full bg-white border border-purple-200 p-3 rounded-lg focus:border-purple-500 outline-none" 
                                            value={pageData.coupon?.code || ""} 
                                            onChange={e => {
                                                const code = e.target.value;
                                                const selectedCoupon = globalCoupons.find(c => c.code === code);
                                                setPageData({
                                                    ...pageData, 
                                                    coupon: {
                                                        ...pageData.coupon, 
                                                        code: code,
                                                        discount_percent: selectedCoupon ? selectedCoupon.discount_value : (pageData.coupon?.discount_percent || 0)
                                                    }
                                                });
                                            }}
                                        >
                                            <option value="">-- No Featured Coupon --</option>
                                            {globalCoupons.map((c: any) => (
                                                <option key={c.id} value={c.code}>{c.code} ({c.type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold mb-2 text-purple-700 uppercase tracking-wider">Discount % (Display)</label>
                                        <input type="number" placeholder="20" className="w-full bg-white border border-purple-200 p-3 rounded-lg focus:border-purple-500 outline-none" value={pageData.coupon?.discount_percent || 0} onChange={e => setPageData({...pageData, coupon: {...pageData.coupon, discount_percent: parseInt(e.target.value)||0}})} />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer p-2 bg-white rounded-lg border border-purple-100 pr-4">
                                            <input type="checkbox" checked={pageData.coupon?.active || false} onChange={e => setPageData({...pageData, coupon: {...pageData.coupon, active: e.target.checked}})} className="w-5 h-5 accent-purple-600 rounded" />
                                            <span className="font-bold text-sm text-purple-900">Show Coupon Box</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="border-t border-purple-200 pt-5">
                                    <label className="block text-xs font-bold mb-2 text-purple-700 uppercase tracking-wider">Applicable Global Coupons</label>
                                    <p className="text-xs text-purple-600/70 mb-4">Select the global coupon codes that are valid for this event.</p>
                                    <MultiSelectDropdown 
                                        options={globalCoupons} 
                                        selected={pageData.applicable_coupons || []} 
                                        onChange={v => setPageData({...pageData, applicable_coupons: v})} 
                                        placeholder="Select coupons..." 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'email_template' && (
                        <EmailTemplateEditor 
                            template={pageData.email_template || initialPageData.email_template}
                            onChange={newTpl => setPageData((prev: any) => ({ ...prev, email_template: newTpl }))}
                            event={event}
                            eventId={id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
