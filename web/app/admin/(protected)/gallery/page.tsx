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

function getSlotHeightFromItem(item: any | null) {
    let size = 'medium';
    if (item && item.caption) {
        const sizeMatch = item.caption.match(/^SIZE:([^|]+)\|/);
        if (sizeMatch) size = sizeMatch[1];
    }
    if (size === 'small') return 220;
    if (size === 'large') return 420;
    if (size === 'tall') return 640;
    return 320; // default medium
}

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
        disabled: isLocked && !item
    });
    
    const style = { 
        transform: CSS.Transform.toString(transform), 
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const heightPx = getSlotHeightFromItem(item);

    if (!item) {
        return (
            <div 
                ref={setNodeRef} 
                style={{ ...style, height: `${heightPx}px` }} 
                {...(isLocked ? {} : attributes)} 
                {...(isLocked ? {} : listeners)}
                onClick={() => {
                    if (isLocked) alert("Please fill the previous slots first!");
                }}
                onDoubleClick={() => {
                    if (!isLocked) onDoubleClick(slotIndex, null);
                }} 
                className={`relative group bg-gray-50 border-2 border-dashed ${isLocked ? 'border-gray-200 cursor-not-allowed opacity-50' : 'border-gray-300 cursor-pointer hover:bg-gray-100 hover:border-gray-400'} rounded-2xl flex flex-col items-center justify-center shrink-0 w-full h-full transition-all`}
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

    let displayCaption = item.caption || '';
    displayCaption = displayCaption.replace(/^SIZE:[^|]+\|/, '');

    return (
        <div 
            ref={setNodeRef} 
            style={{ ...style, height: `${heightPx}px` }} 
            onDoubleClick={() => onDoubleClick(slotIndex, item)} 
            className={`relative group bg-[#1e293b] border border-gray-700/50 rounded-2xl overflow-hidden shadow-sm flex flex-col shrink-0 w-full h-full`}
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-grow relative overflow-hidden bg-gray-900">
                <Image src={displayUrl} alt={displayCaption} fill className="object-cover pointer-events-none" unoptimized />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                            <i className="fa-solid fa-play text-purple-600 ml-1 text-sm"></i>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-gray-800 flex justify-between items-center bg-gray-900/90 h-9 shrink-0">
                <p className="text-xs text-gray-300 font-medium truncate" title={displayCaption || item.type}>
                    <span className="text-gray-500 mr-1">#{slotIndex + 1}</span> {displayCaption || (item.type === 'video' ? 'Video' : 'Image')}
                </p>
                <i className="fas fa-grip-vertical text-gray-500 cursor-grab px-1" {...attributes} {...listeners}></i>
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
    const [formData, setFormData] = useState({ type: "image", caption: "", media_url: "", size: "medium" });
    const [file, setFile] = useState<File | null>(null);
    
    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [currentCropAspect, setCurrentCropAspect] = useState<number>(1);
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

    const slots = Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
        return items.find(item => item.display_order === i) || null;
    });

    const firstEmptyIndex = slots.findIndex(s => !s);
    const maxAllowedSlot = firstEmptyIndex === -1 ? TOTAL_SLOTS - 1 : firstEmptyIndex;

    const handleDoubleClick = (slotIndex: number, item: any | null) => {
        setEditingSlotIndex(slotIndex);
        
        let size = "medium";
        let caption = "";
        if (item) {
            caption = item.caption || "";
            const sizeMatch = caption.match(/^SIZE:([^|]+)\|/);
            if (sizeMatch) {
                size = sizeMatch[1];
                caption = caption.replace(/^SIZE:[^|]+\|/, '');
            }
        }
        
        // Calculate aspect ratio based on selected size
        let heightPx = 320;
        if (size === 'small') heightPx = 220;
        if (size === 'large') heightPx = 420;
        if (size === 'tall') heightPx = 640;

        setCurrentCropAspect(320 / heightPx);

        if (item) {
            setEditingItem(item);
            setFormData({ type: item.type, caption, media_url: item.media_url || "", size });
            setIsEditOptionsModalOpen(true);
        } else {
            if (slotIndex > maxAllowedSlot) return; 
            setEditingItem(null);
            setFormData({ type: "image", caption: "", media_url: "", size: "medium" });
            setFile(null);
            setIsAddModalOpen(true);
        }
    };

    const handleSaveSlot = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setUploading(true);
        
        const finalCaption = `SIZE:${formData.size}|${formData.caption}`;
        
        const data = new FormData();
        data.append('type', formData.type);
        data.append('caption', finalCaption);
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
            setIsEditOptionsModalOpen(false);
        }
        e.target.value = '';
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this gallery item?")) return;
        await fetch(`${API}/api/admin/gallery/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
    };

    const handleAutoFixGaps = async () => {
        if (!confirm("This will automatically shift all images to fill empty gaps. Are you sure?")) return;
        const filledItems = slots.filter(s => s);
        const updates = filledItems.map((item, i) => ({ id: item.id, display_order: i }));
        try {
            await fetch(`${API}/api/admin/gallery/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ items: updates })
            });
            fetchItems();
        } catch (error) {
            console.error("Auto-fix failed", error);
        }
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
            fetchItems(); 
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
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gallery Editor</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Drag & drop and resize your blocks horizontally.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex gap-4 text-sm font-bold text-slate-700 items-center">
                        {firstEmptyIndex !== -1 && slots.filter(s => s).length > firstEmptyIndex && (
                            <button 
                                onClick={handleAutoFixGaps}
                                className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-xs flex items-center gap-2 transition-colors"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i> Fix Gaps
                            </button>
                        )}
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Filled Slots</span>
                            <span className="text-lg text-purple-600">{items.length} / {TOTAL_SLOTS}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Masonry Grid (Matches Frontend EXACTLY) */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner overflow-hidden relative">
                <div className="absolute top-4 left-6 z-10 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                    <i className="fa-solid fa-arrow-right-arrow-left"></i> Scroll horizontally
                </div>
                <div className="overflow-x-auto pb-4 pt-12 hide-scrollbar">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={sortableIds} strategy={rectSortingStrategy}>
                            <div className="h-[720px]" style={{ columnWidth: '320px', columnGap: '24px' }}>
                                {slots.map((item, i) => (
                                    <div key={i} className="mb-6 snap-start shrink-0 inline-block w-full" style={{ breakInside: 'avoid', breakBefore: 'auto', breakAfter: 'auto' }}>
                                        <SortableGallerySlot 
                                            slotIndex={i} 
                                            item={item} 
                                            isLocked={i > maxAllowedSlot}
                                            onDoubleClick={handleDoubleClick}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {/* Modal for adding media */}
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Block Height</label>
                                <select 
                                    value={formData.size} 
                                    onChange={e => {
                                        setFormData({...formData, size: e.target.value});
                                        let h = 320;
                                        if (e.target.value === 'small') h = 220;
                                        if (e.target.value === 'large') h = 420;
                                        if (e.target.value === 'tall') h = 640;
                                        setCurrentCropAspect(320 / h);
                                    }}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                >
                                    <option value="small">Small (~220px)</option>
                                    <option value="medium">Medium (~320px)</option>
                                    <option value="large">Large (~420px)</option>
                                    <option value="tall">Extra Tall (~640px)</option>
                                </select>
                            </div>

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
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Block Height</label>
                                <select 
                                    value={formData.size} 
                                    onChange={e => {
                                        setFormData({...formData, size: e.target.value});
                                        let h = 320;
                                        if (e.target.value === 'small') h = 220;
                                        if (e.target.value === 'large') h = 420;
                                        if (e.target.value === 'tall') h = 640;
                                        setCurrentCropAspect(320 / h);
                                    }}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                >
                                    <option value="small">Small (~220px)</option>
                                    <option value="medium">Medium (~320px)</option>
                                    <option value="large">Large (~420px)</option>
                                    <option value="tall">Extra Tall (~640px)</option>
                                </select>
                            </div>

                            {editingItem.type === 'image' && (
                                <button onClick={() => setImageSrc(editingItem.media_url)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-colors">
                                    <i className="fa-solid fa-crop-simple w-5"></i> Rotate / Re-Crop Image
                                </button>
                            )}
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition-colors">
                                <i className="fa-solid fa-upload w-5"></i> Replace Media
                            </button>
                            <button onClick={() => handleSaveSlot()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors">
                                <i className="fa-solid fa-floppy-disk w-5"></i> Save Height Changes
                            </button>
                        </div>
                        
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button onClick={() => setIsEditOptionsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-slate-50 w-full text-center">Cancel</button>
                        </div>
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
                        
                        // Proceed to save immediately if we were editing an existing item
                        if (editingItem) {
                            setUploading(true);
                            const finalCaption = `SIZE:${formData.size}|${formData.caption}`;
                            const data = new FormData();
                            data.append('caption', finalCaption);
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
