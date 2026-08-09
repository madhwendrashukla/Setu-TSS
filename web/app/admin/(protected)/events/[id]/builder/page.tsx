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
    const handleAdd = () => onChange((prev) => [...(Array.isArray(prev) ? prev : []), { id: "w_"+Date.now(), priority_order: (prev?.length || 0)+1, heading: "DAY 1", title: "", key_features: "", detail_bullets: { what_youll_learn: [], your_deliverables: [] }, pricing: { strike_price: 0, actual_price: 0, date_time_bullets: [], mode: "online", address: "" }, cta: { text: "Book Now", active: true }, visible: true }]);
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Priority Order</label><input type="number" className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.priority_order || 0} onChange={e => handleChange(index, 'priority_order', parseInt(e.target.value)||0)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Badge / Day (e.g. DAY 1)</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.heading || ""} onChange={e => handleChange(index, 'heading', e.target.value)} /></div>
                            <div><label className="block text-xs font-bold mb-1 text-gray-500">Title</label><input className="w-full bg-white border border-gray-200 p-2 rounded outline-none" value={w.title || ""} onChange={e => handleChange(index, 'title', e.target.value)} /></div>
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

const PricingEditor = ({ options, onChange }: { options: any[], onChange: (o: any[] | ((prev: any[]) => any[])) => void }) => {
    const handleAdd = () => onChange((prev) => [...(Array.isArray(prev) ? prev : []), { id: "p_"+Date.now(), priority_order: (prev?.length || 0)+1, heading: "OFFER", title: "", key_features: "", pricing: { strike_price: 0, actual_price: 0, date_time_bullets: [], mode: "online", address: "" }, cta: { text: "Book Now", active: true }, visible: true }]);
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
    const [testimonialTab, setTestimonialTab] = useState("text");
    const [adminSources, setAdminSources] = useState<any[]>([]);
    const [globalCoupons, setGlobalCoupons] = useState<any[]>([]);
    const [lmsCoursePrice, setLmsCoursePrice] = useState<number | null>(null); // rupees — authoritative charge for LMS-linked events

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
        { id: 'workshop_breakdown', label: 'Workshop Breakdown' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'mentors', label: 'Mentors' },
        { id: 'video_gallery', label: 'Video Gallery' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'faqs', label: 'FAQs' },
        { id: 'contact', label: 'Contact Details' },
        { id: 'coupons', label: 'Coupons' }
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
                            {/* Unified Events: display-vs-charge mismatch warning for LMS-linked events */}
                            {lmsCoursePrice !== null && (pageData.pricing_options || []).some((o: any) => (o.pricing?.actual_price || 0) !== lmsCoursePrice) && (
                                <div className="text-sm text-red-800 bg-red-50 border border-red-200 p-4 rounded-xl font-medium">
                                    <i className="fas fa-triangle-exclamation mr-2"></i>
                                    This page shows a price that differs from what buyers are actually charged:
                                    the linked LMS course costs <strong>₹{lmsCoursePrice.toLocaleString('en-IN')}</strong>.
                                    Update the pricing card{(pageData.pricing_options || []).length > 1 ? 's' : ''} here, or change the course price in the LMS — the checkout always charges the LMS price.
                                </div>
                            )}
                            <PricingEditor options={pageData.pricing_options || []} onChange={v => setPageData((prev: any) => ({...prev, pricing_options: typeof v === 'function' ? v(prev.pricing_options || []) : v}))} />
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
                </div>
            </div>
        </div>
    );
}
