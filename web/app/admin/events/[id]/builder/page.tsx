"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EventBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [event, setEvent] = useState<any>(null);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                    setBlocks(typeof found.page_blocks === 'string' ? JSON.parse(found.page_blocks) : (found.page_blocks || []));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const addBlock = (type: string) => {
        const newBlock = { type, data: {} };
        switch(type) {
            case 'hero':
                newBlock.data = { title: "", subtitle: "", buttonText: "", buttonLink: "", backgroundImage: "" };
                break;
            case 'why_us':
                newBlock.data = { title: "", subtitle: "", list: [""], floatingImage: "" };
                break;
            case 'mentors':
                newBlock.data = { title: "", subtitle: "", mentorsList: [] };
                break;
            case 'curriculum':
                newBlock.data = { title: "", tracks: [] };
                break;
        }
        setBlocks([...blocks, newBlock]);
    };

    const updateBlockData = (index: number, key: string, value: any) => {
        const newBlocks = [...blocks];
        newBlocks[index].data = { ...newBlocks[index].data, [key]: value };
        setBlocks(newBlocks);
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, key: string) => {
        if (e.target.files && e.target.files[0]) {
            const url = await handleUpload(e.target.files[0]);
            if (url) {
                updateBlockData(index, key, url);
            }
        }
    };

    const saveBlocks = async () => {
        setSaving(true);
        const token = localStorage.getItem("adminToken");
        try {
            const fd = new FormData();
            fd.append('page_blocks', JSON.stringify(blocks));
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: fd
            });
            if (res.ok) {
                alert("Saved successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!event) return <div className="p-10">Event not found</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto pb-32">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <button onClick={() => router.push('/admin/events')} className="text-gray-500 hover:text-black mb-2 flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to Events
                    </button>
                    <h1 className="text-3xl font-bold">Page Builder: {event.title}</h1>
                </div>
                <button 
                    onClick={saveBlocks}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Page"}
                </button>
            </div>

            <div className="space-y-6">
                {blocks.map((block, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                            <h3 className="text-xl font-bold capitalize text-gray-800">{block.type.replace('_', ' ')} Block</h3>
                            <button onClick={() => removeBlock(index)} className="text-red-500 hover:text-red-700">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                        
                        {/* Dynamic Forms based on block.type */}
                        {block.type === 'hero' && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Title</label><input type="text" className="w-full border p-2 rounded" value={block.data.title || ""} onChange={e => updateBlockData(index, 'title', e.target.value)} /></div>
                                <div><label className="block text-sm font-bold mb-1">Subtitle</label><input type="text" className="w-full border p-2 rounded" value={block.data.subtitle || ""} onChange={e => updateBlockData(index, 'subtitle', e.target.value)} /></div>
                                <div className="flex gap-4">
                                    <div className="flex-1"><label className="block text-sm font-bold mb-1">Button Text</label><input type="text" className="w-full border p-2 rounded" value={block.data.buttonText || ""} onChange={e => updateBlockData(index, 'buttonText', e.target.value)} /></div>
                                    <div className="flex-1"><label className="block text-sm font-bold mb-1">Button Link</label><input type="text" className="w-full border p-2 rounded" value={block.data.buttonLink || ""} onChange={e => updateBlockData(index, 'buttonLink', e.target.value)} /></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Background Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index, 'backgroundImage')} className="mb-2 block w-full" />
                                    {block.data.backgroundImage && <img src={block.data.backgroundImage} alt="Preview" className="h-20 rounded" />}
                                </div>
                            </div>
                        )}

                        {block.type === 'why_us' && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Title</label><input type="text" className="w-full border p-2 rounded" value={block.data.title || ""} onChange={e => updateBlockData(index, 'title', e.target.value)} /></div>
                                <div><label className="block text-sm font-bold mb-1">Subtitle</label><input type="text" className="w-full border p-2 rounded" value={block.data.subtitle || ""} onChange={e => updateBlockData(index, 'subtitle', e.target.value)} /></div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Floating Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index, 'floatingImage')} className="mb-2 block w-full" />
                                    {block.data.floatingImage && <img src={block.data.floatingImage} alt="Preview" className="h-20 rounded" />}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">List Points (One point per line)</label>
                                    <textarea className="w-full border p-2 rounded h-24" value={(block.data.list || []).join('\n')} onChange={e => updateBlockData(index, 'list', e.target.value.split('\n'))} placeholder="One point per line" />
                                </div>
                            </div>
                        )}

                        {block.type === 'mentors' && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Section Title</label><input type="text" className="w-full border p-2 rounded" value={block.data.title || ""} onChange={e => updateBlockData(index, 'title', e.target.value)} /></div>
                                <p className="text-sm text-gray-500">Mentors list management JSON.</p>
                                <textarea className="w-full border p-2 rounded h-24 font-mono text-sm" value={JSON.stringify(block.data.mentorsList || [], null, 2)} onChange={e => { try { updateBlockData(index, 'mentorsList', JSON.parse(e.target.value)) } catch(err){} }} placeholder="[{ name: '...', photo: '...' }]" />
                            </div>
                        )}

                        {block.type === 'curriculum' && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Section Title</label><input type="text" className="w-full border p-2 rounded" value={block.data.title || ""} onChange={e => updateBlockData(index, 'title', e.target.value)} /></div>
                                <p className="text-sm text-gray-500">JSON tracks data.</p>
                                <textarea className="w-full border p-2 rounded h-24 font-mono text-sm" value={JSON.stringify(block.data.tracks || [], null, 2)} onChange={e => { try { updateBlockData(index, 'tracks', JSON.parse(e.target.value)) } catch(err){} }} placeholder="[{ trackTitle: '...' }]" />
                            </div>
                        )}

                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <h3 className="text-gray-500">No blocks added yet.</h3>
                        <p className="text-sm text-gray-400">Add a section below to start building your event page.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4">Add Section</h3>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => addBlock('hero')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold">+ Hero</button>
                    <button onClick={() => addBlock('why_us')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold">+ Why Us</button>
                    <button onClick={() => addBlock('mentors')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold">+ Mentors</button>
                    <button onClick={() => addBlock('curriculum')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold">+ Curriculum</button>
                </div>
            </div>
        </div>
    );
}
