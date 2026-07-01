"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminHero() {
    const [content, setContent] = useState({ 
        hero_heading: "", hero_tagline: "", 
        hero_scene1_heading: "", hero_scene1_tagline: "",
        hero_scene2_heading: "", hero_scene2_tagline: "",
        hero_rotation_seconds: 5 
    });
    const [slides, setSlides] = useState<any[]>([]);
    
    const [savingContent, setSavingContent] = useState(false);
    const [savedContent, setSavedContent] = useState(false);
    
    const [uploadingSlide, setUploadingSlide] = useState(false);
    const [slideFile, setSlideFile] = useState<File | null>(null);
    const [slideDisplayOrder, setSlideDisplayOrder] = useState(1);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchData = () => {
        // Fetch Homepage Content
        fetch(`${API}/api/homepage`)
            .then(res => res.json())
            .then(data => {
                if (data.homepageContent) {
                    setContent({
                        hero_heading: data.homepageContent.hero_heading || "",
                        hero_tagline: data.homepageContent.hero_tagline || "",
                        hero_scene1_heading: data.homepageContent.hero_scene1_heading || "",
                        hero_scene1_tagline: data.homepageContent.hero_scene1_tagline || "",
                        hero_scene2_heading: data.homepageContent.hero_scene2_heading || "",
                        hero_scene2_tagline: data.homepageContent.hero_scene2_tagline || "",
                        hero_rotation_seconds: data.homepageContent.hero_rotation_seconds || 5
                    });
                }
                if (data.heroSlides) {
                    setSlides(data.heroSlides);
                }
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingContent(true);
        try {
            await fetch(`${API}/api/admin/homepage_content`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
                body: JSON.stringify(content)
            });
            setSavedContent(true);
            setTimeout(() => setSavedContent(false), 3000);
        } finally {
            setSavingContent(false);
        }
    };

    const handleAddSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slideFile) return;
        setUploadingSlide(true);

        const data = new FormData();
        data.append('image', slideFile);
        data.append('display_order', String(slideDisplayOrder));

        try {
            const res = await fetch(`${API}/api/admin/hero_slides`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token()}` },
                body: data
            });
            const result = await res.json();
            if (!res.ok) {
                alert(result.error || 'Upload failed');
                return;
            }
            setSlideFile(null);
            setSlideDisplayOrder(slides.length + 2); // Default to next order
            fetchData();
        } finally {
            setUploadingSlide(false);
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (!confirm("Remove this slide?")) return;
        await fetch(`${API}/api/admin/hero_slides/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token()}` }
        });
        fetchData();
    };

    const handleSwapOrder = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === slides.length - 1) return;

        // Clone the array and swap the two elements
        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];

        try {
            // Re-assign display_order sequentially (1, 2, 3...) to fix any duplicates
            await Promise.all(
                newSlides.map((slide, i) => 
                    fetch(`${API}/api/admin/hero_slides/${slide.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
                        body: JSON.stringify({ display_order: i + 1 })
                    })
                )
            );
            fetchData();
        } catch (error) {
            console.error("Failed to swap order", error);
        }
    };

    return (
        <div className="max-w-5xl animate-in fade-in duration-500">
            <h1 className="text-3xl font-black tracking-tight mb-8">Hero & Homepage Settings</h1>

            {/* Content Section */}
            <form onSubmit={handleSaveContent} className="bg-white border border-gray-200 p-8 rounded-2xl mb-12 shadow-xl">
                <h2 className="text-xl font-bold border-b border-gray-200 pb-4 mb-6">Hero Text</h2>

                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                        <h3 className="font-bold text-accent-blue">Scene 1: The Hook</h3>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Main Heading</label>
                            <textarea
                                value={content.hero_heading}
                                onChange={e => setContent({...content, hero_heading: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue transition-colors min-h-[120px]"
                                placeholder="Stop Ideating. Start Building."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Tagline</label>
                            <textarea
                                value={content.hero_tagline}
                                onChange={e => setContent({...content, hero_tagline: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue transition-colors min-h-[100px]"
                                placeholder="Join the alternate B-school for Aspiring Founders."
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                        <h3 className="font-bold text-accent-blue">Scene 2: The Bridge</h3>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Bridge Heading</label>
                            <textarea
                                value={content.hero_scene1_heading}
                                onChange={e => setContent({...content, hero_scene1_heading: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue transition-colors min-h-[120px]"
                                placeholder="The 0 -> 1 Bridge Where Founders Are Built."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Bridge Tagline</label>
                            <textarea
                                value={content.hero_scene1_tagline}
                                onChange={e => setContent({...content, hero_scene1_tagline: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue transition-colors min-h-[100px]"
                                placeholder="We close 4 deadly gaps..."
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                        <h3 className="font-bold text-accent-violet">Scene 3: The Roadmap</h3>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Roadmap Heading</label>
                            <textarea
                                value={content.hero_scene2_heading}
                                onChange={e => setContent({...content, hero_scene2_heading: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-violet transition-colors min-h-[120px]"
                                placeholder="3 days of ignition sprint to 100 days of Deep Dive..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2 uppercase tracking-wide font-bold">Roadmap Tagline</label>
                            <textarea
                                value={content.hero_scene2_tagline}
                                onChange={e => setContent({...content, hero_scene2_tagline: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-violet transition-colors min-h-[100px]"
                                placeholder="Choose the program that fits you the best"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="submit" disabled={savingContent} className="bg-accent-blue text-white font-bold px-8 py-3 rounded-xl hover:bg-accent-blue/80 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                        {savingContent ? 'Saving...' : 'Save Text Settings'}
                    </button>
                    {savedContent && <span className="text-green-400 text-sm font-medium animate-pulse"><i className="fas fa-check mr-2"></i>Saved</span>}
                </div>
            </form>

            {/* Slides Section */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Hero Background Slides & Timing</h2>
                        <p className="text-gray-500 text-sm mt-1">Maximum 6 active slides. Use the left/right arrows to swap slide order.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <label className="text-sm font-bold text-accent-blue whitespace-nowrap">Time per slide (sec):</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={content.hero_rotation_seconds}
                            onChange={async (e) => {
                                const val = parseInt(e.target.value);
                                setContent({...content, hero_rotation_seconds: val});
                                await fetch(`${API}/api/admin/homepage_content`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
                                    body: JSON.stringify({...content, hero_rotation_seconds: val})
                                });
                            }}
                            className="w-16 bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 focus:outline-none focus:border-accent-blue text-center"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add New Slide Form */}
                    <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold mb-4 text-gray-700">Add New Slide</h3>
                        <form onSubmit={handleAddSlide} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Image File (Max 5MB)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    required
                                    onChange={e => setSlideFile(e.target.files?.[0] ?? null)} 
                                    className="w-full text-gray-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-900 hover:file:bg-white/20 transition-all cursor-pointer" 
                                />
                            </div>
                            <button type="submit" disabled={uploadingSlide || !slideFile} className="w-full bg-gray-100 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors mt-2 border border-gray-200">
                                {uploadingSlide ? 'Uploading...' : 'Upload Slide'}
                            </button>
                        </form>
                    </div>

                    {/* Current Slides List */}
                    <div className="lg:col-span-2">
                        {slides.length === 0 ? (
                            <div className="bg-gray-100 border border-gray-100 rounded-xl p-10 text-center text-gray-400 h-full flex items-center justify-center">
                                No custom slides uploaded. Using default fallback images.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {slides.map((slide, index) => (
                                    <div key={slide.id} className="relative group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden aspect-video">
                                        <Image src={slide.image_url} alt="Hero Slide" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <button onClick={() => handleDeleteSlide(slide.id)} className="bg-red-500/80 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-500 transition-colors shadow-lg border border-red-400/50">
                                                <i className="fas fa-trash-alt mr-2"></i>Delete
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-lg text-xs text-gray-900 border border-gray-300 shadow-lg flex items-center gap-3">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Order: {slide.display_order}</span>
                                            <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleSwapOrder(index, 'up')}
                                                    disabled={index === 0}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                                                    title="Move Earlier"
                                                >
                                                    <i className="fas fa-chevron-left text-[10px]"></i>
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleSwapOrder(index, 'down')}
                                                    disabled={index === slides.length - 1}
                                                    className="w-6 h-6 flex items-center justify-center rounded bg-gray-50 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-gray-50 transition-colors"
                                                    title="Move Later"
                                                >
                                                    <i className="fas fa-chevron-right text-[10px]"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
