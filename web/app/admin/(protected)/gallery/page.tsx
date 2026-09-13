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

// Helpers to extract and embed size in caption
const parseSize = (caption: string | null) => {
    if (!caption) return { size: 'standard', cleanCaption: '' };
    const match = caption.match(/^SIZE:(standard|wide|tall|large)\|?(.*)$/);
    if (match) return { size: match[1], cleanCaption: match[2] };
    return { size: 'standard', cleanCaption: caption };
};

const buildCaption = (size: string, cleanCaption: string) => {
    if (size === 'standard' && !cleanCaption) return '';
    return `SIZE:${size}|${cleanCaption}`;
};

function SortableGallerySlot({ 
    slotIndex, 
    item, 
    isLocked,
    onDoubleClick, 
    onDelete 
}: { 
    slotIndex: number; 
    item: any | null; 
    isLocked: boolean;
    onDoubleClick: (slotIndex: number, item: any | null) => void;
    onDelete: (id: string) => void;
}) {
    const id = item ? item.id : `empty-slot-${slotIndex}`;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id,
        disabled: isLocked && !item // Can't drag locked empty slots
    });
    
    const style = { 
        transform: CSS.Transform.toString(transform), 
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1
    };

    const { size, cleanCaption } = parseSize(item?.caption);

    let gridClass = "col-span-1 row-span-1 min-h-[160px] md:min-h-[180px]";
    if (item) {
        if (size === 'wide') gridClass = "col-span-1 md:col-span-2 row-span-1 min-h-[160px] md:min-h-[180px]";
        else if (size === 'tall') gridClass = "col-span-1 row-span-2 min-h-[336px] md:min-h-[376px]";
        else if (size === 'large') gridClass = "col-span-1 md:col-span-2 row-span-2 min-h-[336px] md:min-h-[376px]";
    }

    if (!item) {
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                {...(isLocked ? {} : attributes)} 
                {...(isLocked ? {} : listeners)}
                onClick={() => {
                    if (isLocked) alert("Please fill the previous slots first!");
                }}
                onDoubleClick={() => {
                    if (!isLocked) onDoubleClick(slotIndex, null);
                }} 
                className={`relative group bg-gray-50 border-2 border-dashed ${isLocked ? 'border-gray-200 cursor-not-allowed opacity-50' : 'border-gray-300 cursor-pointer hover:bg-gray-100 hover:border-gray-400'} rounded-xl flex flex-col items-center justify-center shrink-0 transition-all ${gridClass}`}
            >
                <i className={`fa-solid ${isLocked ? 'fa-lock text-gray-300' : 'fa-plus text-gray-400 group-hover:scale-110'} text-2xl mb-2 transition-transform`}></i>
                <span className={`text-xs font-semibold ${isLocked ? 'text-gray-300' : 'text-gray-400'} uppercase tracking-wider`}>Slot {slotIndex + 1}</span>
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
            className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col shrink-0 ${gridClass}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-grow relative overflow-hidden bg-gray-100">
                <Image src={displayUrl} alt={cleanCaption} fill className="object-cover pointer-events-none" unoptimized />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <i className="fa-solid fa-play text-purple-600 ml-1 text-sm"></i>
                        </div>
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {size}
                </div>
            </div>
            <div className="p-2 border-t border-gray-100 flex justify-between items-center bg-gray-50 h-9 shrink-0">
                <p className="text-xs text-gray-600 font-medium truncate" title={cleanCaption || item.type}>
                    <span className="text-gray-400 mr-1">#{slotIndex + 1}</span> {cleanCaption || (item.type === 'video' ? 'Video' : 'Image')}
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
    const TOTAL_SLOTS = 30; // 30 fixed blocks
    const [items, setItems] = useState<any[]>([]);
    
    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditOptionsModalOpen, setIsEditOptionsModalOpen] = useState(false);
    
    const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Form State (Add/Edit)
    const [formData, setFormData] = useState({ type: "image", caption: "", media_url: "", size: "standard" });
    const [file, setFile] = useState<File | null>(null);
    
    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Build the 30 slots
    const slots = Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
        return items.find(item => item.display_order === i) || null;
    });

    // Find first empty index to enforce sequential filling
    const firstEmptyIndex = slots.findIndex(s => !s);
    const maxAllowedSlot = firstEmptyIndex === -1 ? TOTAL_SLOTS - 1 : firstEmptyIndex;

    const handleDoubleClick = (slotIndex: number, item: any | null) => {
        setEditingSlotIndex(slotIndex);
        if (item) {
            setEditingItem(item);
            const { size, cleanCaption } = parseSize(item.caption);
            setFormData({ type: item.type, caption: cleanCaption, media_url: item.media_url || "", size });
            
            // Open Options Modal instead of forcing crop immediately
            setIsEditOptionsModalOpen(true);
        } else {
            if (slotIndex > maxAllowedSlot) return; // Disallow skipping
            // Empty slot -> Add new
            setEditingItem(null);
            setFormData({ type: "image", caption: "", media_url: "", size: "standard" });
            setFile(null);
            setIsAddModalOpen(true);
        }
    };

    const handleSaveSlot = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setUploading(true);
        
        const data = new FormData();
        data.append('type', formData.type);
        data.append('caption', buildCaption(formData.size, formData.caption));
        data.append('display_order', String(editingSlotIndex ?? 0));
        
        if (formData.type === 'video') {
            data.append('media_url', formData.media_url);
        }
        if (file) {
            data.append('media', file);
        }

        try {
            const url = editingItem 
                ? `${API}/api/admin/gallery/${editingItem.id}`
                : `${API}/api/admin/gallery`;
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, { method, headers: { "Authorization": `Bearer ${token()}` }, body: data });
            const result = await res.json();
            
            if (!res.ok) { 
                alert(result.error || 'Operation failed'); 
                return; 
            }
            setIsAddModalOpen(false); 
            setIsEditOptionsModalOpen(false);
            setFile(null); 
            setEditingItem(null);
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
            setIsEditOptionsModalOpen(false); // Close options modal if open
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

        const getSlotIndex = (id: string) => {
            if (String(id).startsWith('empty-slot-')) return parseInt(String(id).replace('empty-slot-', ''));
            return slots.findIndex(s => s && s.id === id);
        };

        const activeIndex = getSlotIndex(String(active.id));
        const overIndex = getSlotIndex(String(over.id));

        if (activeIndex === -1 || overIndex === -1) return;
        
        // Prevent dragging to slots far ahead (skipping)
        if (overIndex > maxAllowedSlot && !slots[overIndex]) {
            alert("You cannot skip slots! Drag to the next available empty slot.");
            return;
        }

        const activeItem = slots[activeIndex];
        const overItem = slots[overIndex];
        if (!activeItem) return;

        const newItems = [...items];
        const activeItemInState = newItems.find(i => i.id === activeItem.id);
        if (!activeItemInState) return;

        const updates: {id: string, display_order: number}[] = [];

        if (overItem) {
            const overItemInState = newItems.find(i => i.id === overItem.id);
            if (overItemInState) {
                activeItemInState.display_order = overIndex;
                overItemInState.display_order = activeIndex;
                updates.push({ id: activeItem.id, display_order: overIndex });
                updates.push({ id: overItem.id, display_order: activeIndex });
            }
        } else {
            activeItemInState.display_order = overIndex;
            updates.push({ id: activeItem.id, display_order: overIndex });
        }

        setItems(newItems);

        try {
            await fetch(`${API}/api/admin/gallery/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ items: updates })
            });
            fetchItems(); // Sync back
        } catch (error) {
            console.error("Reorder failed", error);
            fetchItems();
        }
    };

    const sortableIds = slots.map((item, i) => item ? item.id : `empty-slot-${i}`);

    return (
        <div className="pb-20">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            <i className="fa-solid fa-images text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dynamic Grid Gallery</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Drag & drop, double click to edit, and resize blocks. Sequential filling enforced.
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
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-min" style={{ gridAutoFlow: 'dense' }}>
                        {slots.map((item, i) => (
                            <SortableGallerySlot 
                                key={item ? item.id : `empty-${i}`}
                                slotIndex={i} 
                                item={item} 
                                isLocked={i > maxAllowedSlot}
                                onDoubleClick={handleDoubleClick}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Modal for adding media (Empty Slot) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">
                                Add Media to Slot {editingSlotIndex! + 1}
                            </h2>
                            <button onClick={() => { setIsAddModalOpen(false); setFile(null); }} className="text-slate-400 hover:text-slate-700">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveSlot} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Block Size</label>
                                    <select 
                                        value={formData.size} 
                                        onChange={e => setFormData({...formData, size: e.target.value})}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                    >
                                        <option value="standard">Standard (1x1)</option>
                                        <option value="wide">Wide (2x1)</option>
                                        <option value="tall">Tall (1x2)</option>
                                        <option value="large">Large (2x2)</option>
                                    </select>
                                </div>
                            </div>
                            
                            {formData.type === 'image' ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Image File</label>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 hover:bg-gray-100 hover:border-gray-400 text-sm font-bold text-gray-600 transition-all flex justify-between items-center"
                                    >
                                        <span>{file ? file.name : "Select and crop image..."}</span>
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">YouTube URL</label>
                                    <input 
                                        required value={formData.media_url} 
                                        onChange={e => setFormData({...formData, media_url: e.target.value})} 
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white" 
                                        placeholder="https://youtube.com/watch?v=..." 
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Caption (Optional)</label>
                                <input 
                                    value={formData.caption} 
                                    onChange={e => setFormData({...formData, caption: e.target.value})} 
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:bg-white" 
                                />
                            </div>
                            
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={uploading || (formData.type === 'image' && !file)} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50">
                                    {uploading ? 'Saving...' : 'Save to Slot'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Editing Options (Filled Slot) */}
            {isEditOptionsModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-sm p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Edit Slot {editingSlotIndex! + 1}</h2>
                            <button onClick={() => setIsEditOptionsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            {editingItem.type === 'image' && (
                                <button onClick={() => setImageSrc(editingItem.media_url)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-colors">
                                    <i className="fa-solid fa-crop-simple w-5"></i> Rotate / Re-Crop Image
                                </button>
                            )}
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition-colors">
                                <i className="fa-solid fa-upload w-5"></i> Replace Media
                            </button>
                            
                            <div className="pt-3 border-t border-gray-100">
                                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Change Block Size</label>
                                <select 
                                    value={formData.size} 
                                    onChange={e => {
                                        setFormData({...formData, size: e.target.value});
                                    }}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white"
                                >
                                    <option value="standard">Standard (1x1)</option>
                                    <option value="wide">Wide (2x1)</option>
                                    <option value="tall">Tall (1x2)</option>
                                    <option value="large">Large (2x2)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button onClick={() => setIsEditOptionsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-slate-50 w-full text-center">Cancel</button>
                            <button onClick={handleSaveSlot} disabled={uploading} className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 w-full text-center disabled:opacity-50">
                                {uploading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {imageSrc && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    onCropComplete={async (croppedFile) => {
                        setFile(croppedFile);
                        setImageSrc(null);
                        
                        // Proceed to save immediately if we were editing an existing item
                        if (editingItem) {
                            setUploading(true);
                            const data = new FormData();
                            data.append('media', croppedFile);
                            try {
                                const res = await fetch(`${API}/api/admin/gallery/${editingItem.id}`, { 
                                    method: "PUT", headers: { "Authorization": `Bearer ${token()}` }, body: data 
                                });
                                if (res.ok) fetchItems();
                                else alert('Failed to update image.');
                            } catch(e) { console.error(e); }
                            setUploading(false);
                            setEditingItem(null);
                            setEditingSlotIndex(null);
                        } else {
                            setIsAddModalOpen(true);
                        }
                    }}
                    onCancel={() => setImageSrc(null)}
                />
            )}
            
        </div>
    );
}
