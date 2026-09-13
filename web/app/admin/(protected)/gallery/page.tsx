"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function readFile(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string), false);
        reader.readAsDataURL(file);
    });
}

function getYouTubeData(url: string) {
    let videoId = "";
    const watchMatch = url.match(/watch\?v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    const embedMatch = url.match(/embed\/([^?]+)/);
    
    if (watchMatch) videoId = watchMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];

    if (videoId) {
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
    }
    return { embedUrl: url, thumbnailUrl: url };
}

function SortableGallerySlot({ 
    slotIndex, 
    item, 
    heightClass, 
    onDoubleClick, 
    onDelete 
}: { 
    slotIndex: number; 
    item: any | null; 
    heightClass: string; 
    onDoubleClick: (slotIndex: number, item: any | null) => void;
    onDelete: (id: string) => void;
}) {
    const id = item ? item.id : `empty-slot-${slotIndex}`;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { 
        transform: CSS.Transform.toString(transform), 
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    if (!item) {
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                {...attributes} 
                {...listeners}
                onDoubleClick={() => onDoubleClick(slotIndex, null)} 
                className={`relative group bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center shrink-0 cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all ${heightClass}`}
            >
                <i className="fa-solid fa-plus text-gray-400 text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slot {slotIndex + 1}</span>
            </div>
        );
    }

    const isVideo = item.type === 'video' || (item.media_url && (item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be')));
    let displayUrl = item.media_url;
    if (isVideo && item.media_url) {
        displayUrl = getYouTubeData(item.media_url).thumbnailUrl;
    }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            onDoubleClick={() => onDoubleClick(slotIndex, item)} 
            className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col shrink-0 ${heightClass}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-grow relative overflow-hidden bg-gray-100">
                <Image src={displayUrl} alt={item.caption ?? ''} fill className="object-cover pointer-events-none" unoptimized />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <i className="fa-solid fa-play text-purple-600 ml-1 text-sm"></i>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-gray-100 flex justify-between items-center bg-gray-50 h-9 shrink-0">
                <p className="text-xs text-gray-600 font-medium truncate" title={item.caption ?? item.type}>
                    <span className="text-gray-400 mr-1">#{slotIndex + 1}</span> {item.caption ?? (item.type === 'video' ? 'Video' : 'Image')}
                </p>
                <i className="fas fa-grip-vertical text-gray-400 cursor-grab px-1" {...attributes} {...listeners}></i>
            </div>
            <button onPointerDown={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition z-10 shadow-sm cursor-pointer hover:bg-rose-700 font-bold">
                <i className="fa-regular fa-trash-can"></i>
            </button>
        </div>
    );
}

export default function AdminGallery() {
    const TOTAL_SLOTS = 30; // 30 fixed blocks corresponding to frontend layout
    const [items, setItems] = useState<any[]>([]);
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({ type: "image", caption: "", media_url: "" });
    const [file, setFile] = useState<File | null>(null);
    
    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [currentCropAspect, setCurrentCropAspect] = useState<number | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAspectForIndex = (index: number) => {
        const colPattern = Math.floor(index / 2) % 5;
        const isBottom = index % 2 === 1;
        if (colPattern === 0) return isBottom ? 16/11 : 16/19;
        if (colPattern === 1) return isBottom ? 16/19 : 16/11;
        if (colPattern === 2) return isBottom ? 2/1 : 8/11;
        if (colPattern === 3) return isBottom ? 4/3 : 8/9;
        return isBottom ? 8/9 : 4/3;
    };

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchItems = () => {
        fetch(`${API}/api/gallery`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setItems(data);
                else setItems([]);
            }).catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    // Create an array of 30 slots, mapping items by their display_order
    const slots = Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
        return items.find(item => item.display_order === i) || null;
    });

    const handleDoubleClick = (slotIndex: number, item: any | null) => {
        setEditingSlotIndex(slotIndex);
        if (item) {
            setEditingItemId(item.id);
            setFormData({ type: item.type, caption: item.caption || "", media_url: item.media_url || "" });
            
            // If it's an image, we can prompt for a replacement (crop). Or just open the modal.
            if (item.type === 'image') {
                setCurrentCropAspect(getAspectForIndex(slotIndex));
                fileInputRef.current?.click();
            } else {
                setIsModalOpen(true);
            }
        } else {
            // Empty slot -> Add new
            setEditingItemId(null);
            setFormData({ type: "image", caption: "", media_url: "" });
            setFile(null);
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        const data = new FormData();
        data.append('type', formData.type);
        data.append('caption', formData.caption);
        data.append('display_order', String(editingSlotIndex ?? 0));
        
        if (formData.type === 'video') {
            data.append('media_url', formData.media_url);
        }
        if (file) {
            data.append('media', file);
        }

        try {
            const url = editingItemId 
                ? `${API}/api/admin/gallery/${editingItemId}`
                : `${API}/api/admin/gallery`;
            const method = editingItemId ? "PUT" : "POST";

            const res = await fetch(url, { method, headers: { "Authorization": `Bearer ${token()}` }, body: data });
            const result = await res.json();
            
            if (!res.ok) { 
                alert(result.error || 'Upload failed'); 
                return; 
            }
            setIsModalOpen(false); 
            setFile(null); 
            setFormData({ type: "image", caption: "", media_url: "" }); 
            setEditingItemId(null);
            setEditingSlotIndex(null);
            fetchItems();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally { 
            setUploading(false); 
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const f = e.target.files[0];
            const dataUrl = await readFile(f);
            setImageSrc(dataUrl);
            
            if (editingSlotIndex === null) {
                // If they clicked the global "+ Add Item", find the first empty slot
                const firstEmpty = slots.findIndex(s => s === null);
                setEditingSlotIndex(firstEmpty !== -1 ? firstEmpty : 0);
                setCurrentCropAspect(getAspectForIndex(firstEmpty !== -1 ? firstEmpty : 0));
            } else if (!isModalOpen) {
                // Only set aspect if we came from double clicking an image block directly (modal is not open)
                setCurrentCropAspect(getAspectForIndex(editingSlotIndex));
            }
        }
        e.target.value = '';
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this gallery item?")) return;
        await fetch(`${API}/api/admin/gallery/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        // Parse IDs (either item ID or empty-slot-X)
        const getSlotIndex = (id: string) => {
            if (String(id).startsWith('empty-slot-')) {
                return parseInt(String(id).replace('empty-slot-', ''));
            }
            return slots.findIndex(s => s && s.id === id);
        };

        const activeIndex = getSlotIndex(String(active.id));
        const overIndex = getSlotIndex(String(over.id));

        if (activeIndex === -1 || overIndex === -1) return;

        const activeItem = slots[activeIndex];
        const overItem = slots[overIndex];

        if (!activeItem) return; // Cannot drag an empty slot

        // Optimistic UI Update
        const newItems = [...items];
        const activeItemInState = newItems.find(i => i.id === activeItem.id);
        if (!activeItemInState) return;

        const updates: {id: string, display_order: number}[] = [];

        if (overItem) {
            // Swap
            const overItemInState = newItems.find(i => i.id === overItem.id);
            if (overItemInState) {
                activeItemInState.display_order = overIndex;
                overItemInState.display_order = activeIndex;
                updates.push({ id: activeItem.id, display_order: overIndex });
                updates.push({ id: overItem.id, display_order: activeIndex });
            }
        } else {
            // Transfer
            activeItemInState.display_order = overIndex;
            updates.push({ id: activeItem.id, display_order: overIndex });
        }

        setItems(newItems); // Apply optimistic update

        // Save to backend
        try {
            await fetch(`${API}/api/admin/gallery/reorder`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token()}` 
                },
                body: JSON.stringify({ items: updates })
            });
        } catch (error) {
            console.error("Reorder failed, fetching original state", error);
            fetchItems(); // Revert on failure
        }
    };

    const imagesCount = items.filter(i => i.type === 'image').length;
    const videosCount = items.filter(i => i.type === 'video').length;

    // We only make the filled slots and empty slots sortable.
    const sortableIds = slots.map((item, i) => item ? item.id : `empty-slot-${i}`);

    return (
        <div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            <i className="fa-solid fa-images text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Grid Gallery</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Drag & drop to swap or transfer items. Double-click any slot to add or edit media.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex gap-4 text-sm font-bold text-slate-700">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Filled Slots</span>
                            <span className="text-lg text-purple-600">{items.length} / 30</span>
                        </div>
                    </div>
                </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
                    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-2 pt-2 snap-x hide-scrollbar">
                        {Array.from({ length: Math.ceil(TOTAL_SLOTS / 2) }).map((_, colIndex) => {
                            const i = colIndex * 2;
                            const j = i + 1;
                            const colPattern = colIndex % 5;
                            
                            let h1, h2;
                            if (colPattern === 0) { h1 = "h-[190px]"; h2 = "h-[110px]"; }
                            else if (colPattern === 1) { h1 = "h-[110px]"; h2 = "h-[190px]"; }
                            else if (colPattern === 2) { h1 = "h-[220px]"; h2 = "h-[80px]"; }
                            else if (colPattern === 3) { h1 = "h-[180px]"; h2 = "h-[120px]"; }
                            else { h1 = "h-[120px]"; h2 = "h-[180px]"; }

                            return (
                                <div key={`col-${colIndex}`} className="flex flex-col gap-4 w-[240px] shrink-0 snap-start">
                                    <SortableGallerySlot 
                                        slotIndex={i} 
                                        item={slots[i]} 
                                        heightClass={h1} 
                                        onDoubleClick={handleDoubleClick}
                                        onDelete={handleDelete}
                                    />
                                    {j < TOTAL_SLOTS && (
                                        <SortableGallerySlot 
                                            slotIndex={j} 
                                            item={slots[j]} 
                                            heightClass={h2} 
                                            onDoubleClick={handleDoubleClick}
                                            onDelete={handleDelete}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Modal for adding/editing a block (Video mostly, or uploading new image) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">
                                {editingItemId ? `Edit Slot ${editingSlotIndex! + 1}` : `Add Media to Slot ${editingSlotIndex! + 1}`}
                            </h2>
                            <button onClick={() => { setIsModalOpen(false); setFile(null); }} className="text-slate-400 hover:text-slate-700">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Media Type</label>
                                <select 
                                    value={formData.type} 
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video (YouTube)</option>
                                </select>
                            </div>
                            
                            {formData.type === 'image' ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Image File</label>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setCurrentCropAspect(getAspectForIndex(editingSlotIndex || 0));
                                                fileInputRef.current?.click();
                                            }}
                                            className="px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 hover:bg-gray-100 hover:border-gray-400 text-sm font-bold text-gray-600 transition-all flex-1 text-left flex justify-between items-center"
                                        >
                                            <span>{file ? file.name : "Select and crop image..."}</span>
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                        </button>
                                    </div>
                                    {file && <p className="text-[11px] font-bold text-emerald-600 mt-2"><i className="fa-solid fa-check mr-1"></i> Image ready for upload</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">YouTube URL</label>
                                    <input 
                                        required
                                        value={formData.media_url} 
                                        onChange={e => setFormData({...formData, media_url: e.target.value})} 
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                                        placeholder="https://www.youtube.com/watch?v=..." 
                                    />
                                    {formData.media_url && (
                                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-start gap-4">
                                            <img src={getYouTubeData(formData.media_url).thumbnailUrl} alt="Thumbnail preview" className="w-24 h-auto rounded-lg object-cover" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">Thumbnail Preview</p>
                                                <p className="text-[10px] text-gray-500 mt-1">Automatically fetched from YouTube. Videos open in a popup player on the frontend.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Caption (Optional)</label>
                                <input 
                                    value={formData.caption} 
                                    onChange={e => setFormData({...formData, caption: e.target.value})} 
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors" 
                                    placeholder="Brief description..."
                                />
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={uploading || (formData.type === 'image' && !file && !editingItemId)} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50">
                                    {uploading ? <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Saving...</> : 'Save to Slot'}
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
                            // If we were directly editing an existing item, upload it right away
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
                            setEditingSlotIndex(null);
                        } else {
                            // If we are adding a new item, open the modal to fill caption/type
                            setIsModalOpen(true);
                        }
                    }}
                    onCancel={() => {
                        setImageSrc(null);
                        if (editingItemId) setEditingItemId(null);
                    }}
                />
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
}
