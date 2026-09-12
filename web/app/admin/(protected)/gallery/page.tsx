"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function readFile(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string), false);
        reader.readAsDataURL(file);
    });
}

function SortableGalleryItem({ item, onDelete, heightClass, onDoubleClick }: { item: any; onDelete: (id: string) => void; heightClass: string; onDoubleClick?: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} onDoubleClick={() => onDoubleClick && onDoubleClick(item.id)} className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col shrink-0 ${heightClass}`}>
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-grow relative overflow-hidden">
                {item.type === 'image' ? (
                    <Image src={item.media_url} alt={item.caption ?? ''} fill className="object-cover pointer-events-none" unoptimized />
                ) : (
                    <div className="w-full h-full bg-black relative">
                        <iframe src={item.media_url} className="w-full h-full pointer-events-none" frameBorder="0" allowFullScreen></iframe>
                        {/* Overlay to intercept drag events instead of the iframe */}
                        <div className="absolute inset-0 cursor-grab active:cursor-grabbing"></div>
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-gray-100 flex justify-between items-center bg-gray-50 h-9 shrink-0">
                <p className="text-xs text-gray-500 truncate" title={item.caption ?? item.type}>{item.caption ?? item.type}</p>
                <i className="fas fa-grip-vertical text-gray-400 cursor-grab px-1" {...attributes} {...listeners}></i>
            </div>
            <button onPointerDown={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-10 shadow-sm cursor-pointer hover:bg-red-700">
                Remove
            </button>
        </div>
    );
}

export default function AdminGallery() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ type: "image", caption: "", display_order: 0, media_url: "" });
    const [uploading, setUploading] = useState(false);
    
    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [currentCropAspect, setCurrentCropAspect] = useState<number | undefined>(undefined);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAspectForIndex = (index: number) => {
        const colPattern = Math.floor(index / 2) % 5;
        const isBottom = index % 2 === 1;
        if (colPattern === 0) return isBottom ? 16/11 : 16/19;
        if (colPattern === 1) return isBottom ? 16/19 : 16/11;
        if (colPattern === 2) return isBottom ? 2/1 : 8/11;
        if (colPattern === 3) return isBottom ? 4/3 : 8/9;
        return isBottom ? 8/9 : 4/3; // colPattern === 4
    };

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchItems = () => {
        fetch(`${API}/api/gallery`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setItems(data.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)));
                else setItems([]);
            }).catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        const data = new FormData();
        data.append('type', formData.type);
        data.append('caption', formData.caption);
        data.append('display_order', String(formData.display_order));
        if (formData.type === 'video') data.append('media_url', formData.media_url);
        if (file) data.append('media', file);
        try {
            const res = await fetch(`${API}/api/admin/gallery`, { method: "POST", headers: { "Authorization": `Bearer ${token()}` }, body: data });
            const result = await res.json();
            if (!res.ok) { alert(result.error || 'Upload failed'); return; }
            setIsModalOpen(false); setFile(null); setFormData({ type: "image", caption: "", display_order: 0, media_url: "" }); fetchItems();
        } finally { setUploading(false); }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const f = e.target.files[0];
            const dataUrl = await readFile(f);
            setImageSrc(dataUrl);
        }
        e.target.value = '';
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this gallery item?")) return;
        await fetch(`${API}/api/admin/gallery/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update display_order based on new array order
                const reorderedItems = newItems.map((item, index) => ({
                    ...item,
                    display_order: index
                }));

                // Save to backend
                fetch(`${API}/api/admin/gallery/reorder`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token()}` 
                    },
                    body: JSON.stringify({ items: reorderedItems.map(i => ({ id: i.id, display_order: i.display_order })) })
                }).catch(console.error);

                return reorderedItems;
            });
        }
    };

    const images = items.filter(i => i.type === 'image');
    const videos = items.filter(i => i.type === 'video');

    return (
        <div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Gallery</h1>
                <button onClick={() => { setIsModalOpen(true); setEditingItemId(null); setCurrentCropAspect(getAspectForIndex(items.length)); }} className="bg-white text-black font-bold px-4 py-2 rounded shadow hover:bg-gray-200 transition">+ Add Item</button>
            </div>
            <p className="text-gray-500 text-sm mb-8">Limits: <span className="text-gray-900">20 images</span> · <span className="text-gray-900">10 videos</span> · <span className="text-gray-900">30 total</span> — Current: {images.length} images, {videos.length} videos</p>

            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">No gallery items yet</div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-2 pt-2">
                            {items.length > 0 && Array.from({ length: Math.ceil(items.length / 2) }).map((_, colIndex) => {
                                const i = colIndex * 2;
                                const j = i + 1;
                                const colPattern = colIndex % 5;
                                
                                let h1, h2;
                                // Admin panel heights are 50% scale of frontend
                                if (colPattern === 0) { h1 = "h-[190px]"; h2 = "h-[110px]"; }
                                else if (colPattern === 1) { h1 = "h-[110px]"; h2 = "h-[190px]"; }
                                else if (colPattern === 2) { h1 = "h-[220px]"; h2 = "h-[80px]"; }
                                else if (colPattern === 3) { h1 = "h-[180px]"; h2 = "h-[120px]"; }
                                else { h1 = "h-[120px]"; h2 = "h-[180px]"; }

                                return (
                                    <div key={colIndex} className="flex flex-col gap-4 w-[240px] shrink-0">
                                        {items[i] && <SortableGalleryItem key={items[i].id} item={items[i]} onDelete={handleDelete} heightClass={h1} onDoubleClick={() => { setCurrentCropAspect(getAspectForIndex(i)); setEditingItemId(items[i].id); fileInputRef.current?.click(); }} />}
                                        {items[j] && <SortableGalleryItem key={items[j].id} item={items[j]} onDelete={handleDelete} heightClass={h2} onDoubleClick={() => { setCurrentCropAspect(getAspectForIndex(j)); setEditingItemId(items[j].id); fileInputRef.current?.click(); }} />}
                                    </div>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Add Gallery Item</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Type</label>
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue">
                                    <option value="image">Image (max 20)</option>
                                    <option value="video">Video (max 10)</option>
                                </select>
                            </div>
                            {formData.type === 'image' ? (
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Image File</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-900 text-sm" />
                                    {file && <p className="text-xs text-green-500 mt-1 truncate">Selected cropped image ready to upload.</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Video URL (YouTube embed)</label>
                                    <input value={formData.media_url} onChange={e => setFormData({...formData, media_url: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="https://www.youtube.com/embed/..." />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Caption (optional)</label>
                                <input value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" disabled={uploading} className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200 disabled:opacity-50">
                                    {uploading ? 'Uploading...' : 'Add to Gallery'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {imageSrc && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    aspect={currentCropAspect}
                    onCropComplete={async (croppedFile) => {
                        setFile(croppedFile);
                        setImageSrc(null);
                        if (editingItemId) {
                            setUploading(true);
                            const data = new FormData();
                            data.append('media', croppedFile);
                            try {
                                const res = await fetch(`${API}/api/admin/gallery/${editingItemId}`, { 
                                    method: "PUT", 
                                    headers: { "Authorization": `Bearer ${token()}` }, 
                                    body: data 
                                });
                                if (res.ok) fetchItems();
                                else alert('Failed to update image.');
                            } catch(e) { console.error(e); }
                            setUploading(false);
                            setEditingItemId(null);
                        }
                    }}
                    onCancel={() => {
                        setImageSrc(null);
                        setEditingItemId(null);
                    }}
                />
            )}
        </div>
    );
}
