"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";
import {
    DndContext,
    DragOverlay,
    pointerWithin,
    rectIntersection,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    useDroppable,
    useDraggable,
    CollisionDetection,
} from '@dnd-kit/core';

function readFile(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string), false);
        reader.readAsDataURL(file);
    });
}

function getVideoData(url: string) {
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
    if (driveMatch) {
        return {
            embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
            thumbnailUrl: `https://placehold.co/600x400/1e293b/FFFFFF/png?text=Play+Video`
        };
    }

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

function getSizeFromItem(item: any | null): string {
    if (!item?.caption) return '1x1';
    const sizeMatch = item.caption.match(/^SIZE:([^|]+)\|/);
    return sizeMatch ? sizeMatch[1] : '1x1';
}

function getCleanCaption(item: any | null): string {
    if (!item?.caption) return '';
    return item.caption.replace(/^SIZE:[^|]+\|/, '');
}

function getSizeLabel(size: string): string {
    if (size === '1x2') return 'Tall (1×2)';
    if (size === '2x1') return 'Wide (2×1)';
    if (size === '2x2') return 'Large (2×2)';
    return 'Square (1×1)';
}

function getGridStyleFromSize(size: string): React.CSSProperties {
    if (size === '1x2') return { gridColumn: 'span 1', gridRow: 'span 2' };
    if (size === '2x1') return { gridColumn: 'span 2', gridRow: 'span 1' };
    if (size === '2x2') return { gridColumn: 'span 2', gridRow: 'span 2' };
    return { gridColumn: 'span 1', gridRow: 'span 1' };
}

// Resilient Collision Detection: pointerWithin -> rectIntersection -> closestCenter
const customCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
        return pointerCollisions;
    }
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
        return rectCollisions;
    }
    return closestCenter(args);
};

interface GallerySlotProps {
    slotIndex: number;
    item: any | null;
    isLocked: boolean;
    dragActiveId: string | null;
    dragActiveSize: string | null;
    onDoubleClick: (slotIndex: number, item: any | null) => void;
    onDelete: (id: string) => void;
}

function GallerySlot({
    slotIndex,
    item,
    isLocked,
    dragActiveId,
    dragActiveSize,
    onDoubleClick,
    onDelete,
}: GallerySlotProps) {
    const id = item ? item.id : `empty-slot-${slotIndex}`;
    const size = item ? getSizeFromItem(item) : '1x1';
    const gridStyle = getGridStyleFromSize(size);

    const isCurrentActive = dragActiveId === id;
    const isDragInProgress = dragActiveId !== null;

    // Outer container is Droppable
    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id,
        disabled: isLocked && !item,
    });

    // Inner card is Draggable
    const {
        attributes,
        listeners,
        setNodeRef: setDragRef,
        isDragging,
    } = useDraggable({
        id,
        disabled: !item || isLocked,
    });

    // Can receive drop only if same size!
    const canReceiveDrop = isDragInProgress && !isCurrentActive && (
        item ? (dragActiveSize === size) : (dragActiveSize === '1x1')
    );

    // Empty Slot
    if (!item) {
        const isTargetMatch = isDragInProgress && canReceiveDrop;
        const isInvalidTarget = isDragInProgress && !canReceiveDrop && !isCurrentActive;

        return (
            <div
                ref={setDropRef}
                style={gridStyle}
                onDoubleClick={() => {
                    if (!isLocked) onDoubleClick(slotIndex, null);
                }}
                onClick={() => {
                    if (isLocked) alert("Please fill the previous slots first!");
                }}
                className={`relative group rounded-2xl flex flex-col items-center justify-center w-full h-full transition-all duration-200 select-none overflow-hidden
                    ${isLocked
                        ? 'bg-gray-50/80 border-2 border-dashed border-gray-200 cursor-not-allowed opacity-40'
                        : 'bg-white border-2 border-dashed border-slate-300 cursor-pointer hover:bg-purple-50/50 hover:border-purple-300 shadow-2xs'
                    }
                    ${isTargetMatch && isOver
                        ? '!border-emerald-500 !bg-emerald-50/90 ring-4 ring-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.4)] scale-[1.02] z-20'
                        : ''
                    }
                    ${isTargetMatch && !isOver
                        ? '!border-emerald-400 !bg-emerald-50/30 ring-2 ring-emerald-400/40 border-dashed animate-pulse'
                        : ''
                    }
                    ${isInvalidTarget
                        ? 'opacity-30 border-dashed border-slate-200 bg-slate-100 cursor-not-allowed'
                        : ''
                    }
                `}
            >
                {isTargetMatch && isOver ? (
                    <div className="flex flex-col items-center gap-1.5 text-emerald-700 animate-bounce pointer-events-none">
                        <i className="fa-solid fa-arrow-down text-2xl"></i>
                        <span className="text-xs font-black uppercase tracking-wider">Drop Here</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Slot #{slotIndex + 1}</span>
                    </div>
                ) : isTargetMatch && !isOver ? (
                    <div className="flex flex-col items-center gap-1 text-emerald-600 pointer-events-none">
                        <i className="fa-solid fa-arrows-to-dot text-lg"></i>
                        <span className="text-[11px] font-bold">1x1 Empty Slot</span>
                        <span className="text-[10px] text-emerald-500 font-medium">#{slotIndex + 1}</span>
                    </div>
                ) : isInvalidTarget ? (
                    <div className="flex flex-col items-center gap-1 text-slate-400 pointer-events-none">
                        <i className="fa-solid fa-ban text-sm text-rose-400"></i>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">1x1 Only</span>
                    </div>
                ) : (
                    <>
                        <i className={`fa-solid ${isLocked ? 'fa-lock text-slate-300' : 'fa-plus text-slate-400 group-hover:scale-110 group-hover:text-purple-600'} text-2xl mb-2 transition-all`}></i>
                        <span className={`text-xs font-bold ${isLocked ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>Slot {slotIndex + 1}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Square (1×1)</span>
                    </>
                )}
            </div>
        );
    }

    // Filled Slot
    const isVideo = item.type === 'video' || (item.media_url && (item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be') || item.media_url.includes('drive.google.com')));
    let displayUrl = item.media_url || '';
    if (isVideo && item.media_url) {
        displayUrl = getVideoData(item.media_url).thumbnailUrl;
    }
    const displayCaption = getCleanCaption(item);

    const isMatchAndHovered = canReceiveDrop && isOver;
    const isMatchAndNotHovered = canReceiveDrop && !isOver;
    const isDifferentSizeAndDragging = isDragInProgress && !isCurrentActive && !canReceiveDrop;

    return (
        <div
            ref={setDropRef}
            style={gridStyle}
            className={`relative rounded-2xl w-full h-full transition-all duration-200 select-none
                ${isMatchAndHovered 
                    ? '!ring-4 !ring-emerald-400 !border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.7)] scale-[1.02] z-30' 
                    : ''}
                ${isMatchAndNotHovered 
                    ? '!ring-2 !ring-emerald-400/80 !border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.25)]' 
                    : ''}
                ${isDifferentSizeAndDragging 
                    ? 'opacity-35 grayscale-[70%]' 
                    : ''}
            `}
        >
            <div
                ref={setDragRef}
                onDoubleClick={() => onDoubleClick(slotIndex, item)}
                className={`relative group bg-[#1e293b] border border-gray-700/60 rounded-2xl overflow-hidden shadow-sm flex flex-col w-full h-full
                    ${isDragging ? 'opacity-20 scale-95 ring-2 ring-purple-400' : 'opacity-100'}
                `}
            >
                {/* Draggable Media Container */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-grow relative overflow-hidden bg-gray-900 cursor-grab active:cursor-grabbing"
                >
                    <Image
                        src={displayUrl}
                        alt={displayCaption}
                        fill
                        className="object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                    />

                    {/* Video Play Overlay */}
                    {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                                <i className="fa-solid fa-play text-purple-600 ml-1 text-sm"></i>
                            </div>
                        </div>
                    )}

                    {/* Top Badge: Size & Slot Number */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white px-2 py-0.5 rounded-md shadow-sm border border-white/10">
                            #{slotIndex + 1}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border
                            ${size === '1x1' ? 'bg-slate-800/90 text-slate-200 border-slate-600/50' : ''}
                            ${size === '2x1' ? 'bg-blue-900/90 text-blue-200 border-blue-500/50' : ''}
                            ${size === '1x2' ? 'bg-amber-900/90 text-amber-200 border-amber-500/50' : ''}
                            ${size === '2x2' ? 'bg-purple-900/90 text-purple-200 border-purple-500/50' : ''}
                        `}>
                            {getSizeLabel(size)}
                        </span>
                    </div>

                    {/* SWAP HIGHLIGHT OVERLAY: When hovering over valid same-size block */}
                    {isMatchAndHovered && (
                        <div className="absolute inset-0 bg-emerald-600/40 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none z-20 animate-in fade-in zoom-in-95 duration-150">
                            <div className="bg-emerald-500 text-white rounded-2xl px-5 py-2.5 flex items-center gap-2.5 shadow-2xl font-black text-sm border border-emerald-300">
                                <i className="fa-solid fa-arrows-rotate text-lg animate-spin" style={{ animationDuration: '3s' }}></i>
                                <span>SWAP WITH THIS BLOCK</span>
                            </div>
                            <span className="mt-2 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm shadow">
                                Both are {getSizeLabel(size)}
                            </span>
                        </div>
                    )}

                    {/* READY FOR SWAP BADGE: Same-size block, not hovered yet */}
                    {isMatchAndNotHovered && (
                        <div className="absolute inset-0 bg-emerald-950/20 pointer-events-none z-10 flex items-start justify-end p-2">
                            <span className="bg-emerald-500/95 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md border border-emerald-300/40 animate-pulse">
                                <i className="fa-solid fa-check"></i> Can Swap
                            </span>
                        </div>
                    )}

                    {/* SIZE MISMATCH OVERLAY: Different size block */}
                    {isDifferentSizeAndDragging && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none z-20">
                            <div className="bg-rose-950/90 text-rose-300 border border-rose-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-bold shadow-lg">
                                <i className="fa-solid fa-ban text-rose-400"></i>
                                <span>Size mismatch ({size})</span>
                            </div>
                            <span className="text-[10px] text-gray-300 mt-1 font-medium">
                                Needs {getSizeLabel(dragActiveSize || '')}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Caption & Controls Bar */}
                <div className="p-2 border-t border-gray-800 flex justify-between items-center bg-gray-900/95 h-10 shrink-0">
                    <p className="text-xs text-gray-300 font-medium truncate flex-1 mr-2" title={displayCaption || item.type}>
                        {displayCaption || (item.type === 'video' ? 'Video' : 'Image')}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] text-purple-300 font-mono font-bold bg-purple-950/80 border border-purple-700/50 px-1.5 py-0.5 rounded">
                            {size}
                        </span>
                        <div
                            {...attributes}
                            {...listeners}
                            title="Drag to swap"
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-purple-400 px-1.5 py-1 rounded hover:bg-gray-800 transition-colors"
                        >
                            <i className="fas fa-grip-vertical text-xs"></i>
                        </div>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    title="Delete this block"
                    className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-600 text-white text-xs w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md flex items-center justify-center cursor-pointer hover:scale-110"
                >
                    <i className="fa-regular fa-trash-can text-xs"></i>
                </button>
            </div>
        </div>
    );
}

// Floating Drag Overlay Card
function DragOverlayCard({ item }: { item: any }) {
    if (!item) return null;
    const size = getSizeFromItem(item);
    const isVideo = item?.type === 'video' || (item?.media_url && (item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be') || item.media_url.includes('drive.google.com')));
    let displayUrl = item?.media_url || '';
    if (isVideo && item?.media_url) {
        displayUrl = getVideoData(item.media_url).thumbnailUrl;
    }
    const displayCaption = getCleanCaption(item);

    const w = 320 * (size === '2x1' || size === '2x2' ? 2 : 1) + (size === '2x1' || size === '2x2' ? 24 : 0);
    const h = 320 * (size === '1x2' || size === '2x2' ? 2 : 1) + (size === '1x2' || size === '2x2' ? 24 : 0);

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-400 ring-4 ring-purple-500/40 bg-[#1e293b] flex flex-col pointer-events-none scale-105"
            style={{ width: `${w}px`, height: `${h}px` }}
        >
            <div className="flex-grow relative overflow-hidden bg-gray-900 pointer-events-none">
                <Image
                    src={displayUrl}
                    alt={displayCaption}
                    fill
                    className="object-cover pointer-events-none"
                    unoptimized
                />
                <div className="absolute inset-0 bg-purple-600/20 pointer-events-none"></div>

                <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xl border border-purple-300/40 pointer-events-none">
                    <i className="fa-solid fa-arrows-rotate text-[11px]"></i>
                    <span>Swapping {getSizeLabel(size)}</span>
                </div>
            </div>

            <div className="p-2 border-t border-gray-800 flex justify-between items-center bg-gray-900/95 h-10 shrink-0 pointer-events-none">
                <p className="text-xs text-gray-200 font-medium truncate flex-1 mr-2">{displayCaption || 'Gallery Item'}</p>
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                    <span className="font-mono bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">{size}</span>
                    <i className="fas fa-grip-vertical"></i>
                </div>
            </div>
        </div>
    );
}

export default function AdminGallery() {
    const TOTAL_SLOTS = 30;
    const [items, setItems] = useState<any[]>([]);
    
    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditOptionsModalOpen, setIsEditOptionsModalOpen] = useState(false);
    const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Form & Crop
    const [formData, setFormData] = useState({
        type: "image",
        caption: "",
        media_url: "",
        size: "1x1",
    });
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [currentCropAspect, setCurrentCropAspect] = useState<number>(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // DnD State
    const [dragActiveId, setDragActiveId] = useState<string | null>(null);
    const [dragActiveItem, setDragActiveItem] = useState<any | null>(null);
    const [dragActiveSize, setDragActiveSize] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const showFeedback = useCallback((type: 'success' | 'error' | 'info', message: string, duration = 4000) => {
        setFeedback({ type, message });
        setTimeout(() => {
            setFeedback(prev => prev?.message === message ? null : prev);
        }, duration);
    }, []);

    const scroll = (direction: 'left' | 'right', amount = 660) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -amount : amount,
                behavior: 'smooth'
            });
        }
    };

    const scrollToEdge = (edge: 'start' | 'end') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: edge === 'start' ? 0 : scrollContainerRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (scrollContainerRef.current && e.deltaY !== 0 && !e.shiftKey) {
            scrollContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    const token = () => localStorage.getItem("adminToken") || "";
    const API = "";

    const fetchItems = useCallback(() => {
        fetch(`${API}/api/gallery`, {
            headers: { "Authorization": `Bearer ${token()}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                setItems([]);
            }
        })
        .catch(console.error);
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Slots mapping: Each index 0..29 is mapped to item with display_order === i
    const slots = Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
        return items.find(item => item.display_order === i) || null;
    });

    const firstEmptyIndex = slots.findIndex(s => !s);
    const maxAllowedSlot = firstEmptyIndex === -1 ? TOTAL_SLOTS - 1 : firstEmptyIndex;

    const handleDoubleClick = (slotIndex: number, item: any | null) => {
        setEditingSlotIndex(slotIndex);
        
        let size = "1x1";
        let caption = "";

        if (item) {
            caption = item.caption || "";
            const sizeMatch = caption.match(/^SIZE:([^|]+)\|/);
            if (sizeMatch) {
                size = sizeMatch[1];
                caption = caption.replace(/^SIZE:[^|]+\|/, '');
            }
        }

        if (size === '1x2') setCurrentCropAspect(320 / 664);
        else if (size === '2x1') setCurrentCropAspect(664 / 320);
        else setCurrentCropAspect(1);

        if (item) {
            setEditingItem(item);
            setFormData({
                type: item.type,
                caption: caption,
                media_url: item.media_url || "",
                size: size,
            });
            setIsEditOptionsModalOpen(true);
        } else {
            if (slotIndex > maxAllowedSlot) return;
            setEditingItem(null);
            setFormData({
                type: "image",
                caption: "",
                media_url: "",
                size: "1x1",
            });
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
            
            const res = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token()}` },
                body: data
            });

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
            showFeedback('success', `Saved Slot #${(editingSlotIndex ?? 0) + 1} successfully!`);
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
        await fetch(`${API}/api/admin/gallery/${id}`, { 
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token()}` }
        });
        fetchItems();
        showFeedback('info', 'Gallery item deleted.');
    };

    const handleAutoFixGaps = async () => {
        if (!confirm("This will automatically shift all images to fill empty gaps. Are you sure?")) return;
        const filledItems = slots.filter(s => s);
        const updates = filledItems.map((item, i) => ({
            id: item.id,
            display_order: i
        }));

        try {
            await fetch(`${API}/api/admin/gallery/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ items: updates })
            });
            fetchItems();
            showFeedback('success', 'Gaps filled successfully!');
        } catch (error) {
            console.error("Auto-fix failed", error);
            showFeedback('error', 'Auto-fix failed.');
        }
    };

    // Sensor setup: distance constraint allows click/dblclick without accidental drag start
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const id = String(active.id);
        const item = items.find(i => i.id === id);
        if (!item) return;

        setDragActiveId(id);
        setDragActiveSize(getSizeFromItem(item));
        setDragActiveItem(item);
    };

    const getSlotIndex = (id: string) => {
        if (id.startsWith('empty-slot-')) return parseInt(id.replace('empty-slot-', ''), 10);
        return slots.findIndex(s => s && s.id === id);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        // Clear active drag states
        setDragActiveId(null);
        setDragActiveSize(null);
        setDragActiveItem(null);

        if (!over || active.id === over.id) return;

        const activeIndex = getSlotIndex(String(active.id));
        const overIndex = getSlotIndex(String(over.id));

        if (activeIndex === -1 || overIndex === -1) return;
        if (activeIndex === overIndex) return;

        const activeItem = slots[activeIndex];
        const overItem = slots[overIndex];
        if (!activeItem) return;

        const activeSize = getSizeFromItem(activeItem);
        const overSize = overItem ? getSizeFromItem(overItem) : '1x1';

        // STRICT SIZE CHECK
        if (activeSize !== overSize) {
            showFeedback(
                'error',
                `❌ Swap Rejected: ${getSizeLabel(activeSize)} block can ONLY be swapped with another ${getSizeLabel(activeSize)} block!`
            );
            return;
        }

        // Apply optimistic swap to state
        const newItems = items.map(it => ({ ...it }));
        const activeInState = newItems.find(i => i.id === activeItem.id);
        if (!activeInState) return;

        const updates: { id: string; display_order: number }[] = [];

        if (overItem) {
            const overInState = newItems.find(i => i.id === overItem.id);
            if (overInState) {
                activeInState.display_order = overIndex;
                overInState.display_order = activeIndex;
                updates.push({ id: activeItem.id, display_order: overIndex });
                updates.push({ id: overItem.id, display_order: activeIndex });
            }
        } else {
            // Drop onto empty slot (only 1x1 allowed)
            if (activeSize !== '1x1') {
                showFeedback('error', `❌ Cannot move ${getSizeLabel(activeSize)} block into empty slot.`);
                return;
            }
            activeInState.display_order = overIndex;
            updates.push({ id: activeItem.id, display_order: overIndex });
        }

        // INSTANT UI UPDATE
        setItems(newItems);
        showFeedback(
            'success',
            overItem 
                ? `✨ Successfully swapped Slot #${activeIndex + 1} and Slot #${overIndex + 1} (${getSizeLabel(activeSize)})!`
                : `✅ Moved block from Slot #${activeIndex + 1} to Slot #${overIndex + 1}!`
        );

        // Sync with backend API
        try {
            const res = await fetch(`${API}/api/admin/gallery/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ items: updates })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("Server reorder returned non-200 status:", res.status, errData);
                showFeedback('error', `Failed to save new order to database (${errData.error || res.statusText}).`);
                fetchItems();
            } else {
                fetchItems();
            }
        } catch (error) {
            console.error("Failed to sync reorder with server:", error);
            showFeedback('error', 'Network error: could not save order.');
            fetchItems();
        }
    };

    return (
        <div className="pb-20">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            {/* Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold shadow-2xs">
                            <i className="fa-solid fa-images text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gallery Editor</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Drag and drop blocks of the <span className="font-bold text-purple-600">same size</span> to swap their positions directly!
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex gap-4 text-sm font-bold text-slate-700 items-center">
                        {firstEmptyIndex !== -1 && slots.filter(s => s).length > firstEmptyIndex && (
                            <button 
                                onClick={handleAutoFixGaps}
                                className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
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

            {/* Strict Rule & Feedback Toast Bar */}
            <div className="mb-4">
                {feedback ? (
                    <div className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border transition-all animate-in fade-in slide-in-from-top-2 duration-200
                        ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : ''}
                        ${feedback.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-300' : ''}
                        ${feedback.type === 'info' ? 'bg-blue-50 text-blue-800 border-blue-300' : ''}
                    `}>
                        <div className="flex items-center gap-2.5 text-sm font-bold">
                            <i className={`text-base ${
                                feedback.type === 'success' ? 'fa-solid fa-circle-check text-emerald-600' :
                                feedback.type === 'error' ? 'fa-solid fa-triangle-exclamation text-rose-600' :
                                'fa-solid fa-circle-info text-blue-600'
                            }`}></i>
                            <span>{feedback.message}</span>
                        </div>
                        <button 
                            onClick={() => setFeedback(null)}
                            className="text-xs font-bold px-2 py-1 rounded hover:bg-black/5 opacity-70 hover:opacity-100 cursor-pointer"
                        >
                            Dismiss
                        </button>
                    </div>
                ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-purple-50/70 border border-purple-200/70 text-purple-900 text-xs font-semibold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-arrows-rotate text-purple-600"></i>
                            <span>
                                <strong>Strict Swap Mode Active:</strong> Only blocks with identical sizes (1×1 ↔ 1×1, 2×1 ↔ 2×1, 1×2 ↔ 1×2, 2×2 ↔ 2×2) can be swapped.
                            </span>
                        </div>
                        <span className="text-[11px] text-purple-600 font-bold hidden md:inline">
                            Valid swap targets highlight green during drag
                        </span>
                    </div>
                )}
            </div>

            {/* Dense Column Grid & Horizontal Scroll System */}
            <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner relative group">
                    
                    {/* Top Horizontal Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5">
                                <i className="fa-solid fa-arrows-left-right text-purple-600"></i>
                                Horizontal Canvas (30 Slots)
                            </span>
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                                Scroll with mouse wheel, buttons, or scrollbar
                            </span>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scrollToEdge('start')}
                                title="Jump to Start (Slot 1)"
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                                <i className="fa-solid fa-angles-left text-slate-400"></i>
                                <span className="hidden sm:inline">Start</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => scroll('left', 660)}
                                title="Scroll Left"
                                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                                <span>Left</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => scroll('right', 660)}
                                title="Scroll Right"
                                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>Right</span>
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollToEdge('end')}
                                title="Jump to End (Slot 30)"
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                                <span className="hidden sm:inline">End</span>
                                <i className="fa-solid fa-angles-right text-slate-400"></i>
                            </button>
                        </div>
                    </div>

                    {/* Floating Left/Right Arrow Overlays */}
                    <button
                        type="button"
                        onClick={() => scroll('left', 660)}
                        aria-label="Scroll left"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/95 hover:bg-purple-600 text-slate-700 hover:text-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                    >
                        <i className="fa-solid fa-chevron-left text-sm"></i>
                    </button>

                    <button
                        type="button"
                        onClick={() => scroll('right', 660)}
                        aria-label="Scroll right"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/95 hover:bg-purple-600 text-slate-700 hover:text-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer"
                    >
                        <i className="fa-solid fa-chevron-right text-sm"></i>
                    </button>

                    {/* Main Scrollable Canvas */}
                    <div
                        ref={scrollContainerRef}
                        onWheel={handleWheel}
                        className="overflow-x-auto pb-6 pt-2 admin-gallery-scroll"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        <div
                            className="grid gap-6 min-w-max pb-2 px-2"
                            style={{
                                gridTemplateRows: 'repeat(2, 320px)',
                                gridAutoColumns: '320px',
                                gridAutoFlow: 'column dense',
                            }}
                        >
                            {slots.map((item, i) => (
                                <GallerySlot
                                    key={item ? item.id : `empty-slot-${i}`}
                                    slotIndex={i}
                                    item={item}
                                    isLocked={i > maxAllowedSlot}
                                    dragActiveId={dragActiveId}
                                    dragActiveSize={dragActiveSize}
                                    onDoubleClick={handleDoubleClick}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Quick Jump Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-200/80 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-600">Quick Jump:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                            >
                                Slots 1–10
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 1600, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                            >
                                Slots 11–20
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 3200, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                            >
                                Slots 21–30
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">
                                Drag blocks to swap • Double click any block to edit / replace
                            </span>
                        </div>
                    </div>
                </div>

                {/* Drag Overlay Preview */}
                <DragOverlay dropAnimation={null}>
                    {dragActiveItem ? (
                        <DragOverlayCard item={dragActiveItem} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <style dangerouslySetInnerHTML={{__html: `
                .admin-gallery-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #a855f7 #e2e8f0;
                }
                .admin-gallery-scroll::-webkit-scrollbar {
                    height: 12px;
                }
                .admin-gallery-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 9999px;
                    margin: 0 4px;
                }
                .admin-gallery-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 9999px;
                    border: 3px solid #f1f5f9;
                }
                .admin-gallery-scroll::-webkit-scrollbar-thumb:hover {
                    background: #a855f7;
                }
            `}} />

            {/* Modal for adding media */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">
                                Add Media to Slot {editingSlotIndex! + 1}
                            </h2>
                            <button onClick={() => { setIsAddModalOpen(false); setFile(null); }} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveSlot} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Block Size (Width x Height)</label>
                                <select 
                                    value={formData.size} 
                                    onChange={e => {
                                        setFormData({...formData, size: e.target.value});
                                        if (e.target.value === '1x2') setCurrentCropAspect(320 / 664);
                                        else if (e.target.value === '2x1') setCurrentCropAspect(664 / 320);
                                        else setCurrentCropAspect(1);
                                    }}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                >
                                    <option value="1x1">Standard Square (1x1)</option>
                                    <option value="2x1">Horizontal Wide (2x1)</option>
                                    <option value="1x2">Vertical Tall (1x2)</option>
                                    <option value="2x2">Large Square (2x2)</option>
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
                                    <option value="video">Video (YouTube / Google Drive)</option>
                                </select>
                            </div>
                            
                            {formData.type === 'image' ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Image File</label>
                                    <button 
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 hover:bg-gray-100 hover:border-gray-400 text-sm font-bold text-gray-600 transition-all flex justify-between items-center cursor-pointer"
                                    >
                                        <span>{file ? file.name : "Select and crop image..."}</span>
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Video URL (YouTube / Google Drive)</label>
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
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-slate-50 cursor-pointer">Cancel</button>
                                <button type="submit" disabled={uploading || (formData.type === 'image' && !file)} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
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
                            <button onClick={() => setIsEditOptionsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Block Size (Width x Height)</label>
                                <select 
                                    value={formData.size} 
                                    onChange={e => {
                                        setFormData({...formData, size: e.target.value});
                                        if (e.target.value === '1x2') setCurrentCropAspect(320 / 664);
                                        else if (e.target.value === '2x1') setCurrentCropAspect(664 / 320);
                                        else setCurrentCropAspect(1);
                                    }}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                >
                                    <option value="1x1">Standard Square (1x1)</option>
                                    <option value="2x1">Horizontal Wide (2x1)</option>
                                    <option value="1x2">Vertical Tall (1x2)</option>
                                    <option value="2x2">Large Square (2x2)</option>
                                </select>
                            </div>

                            {editingItem.type === 'image' && (
                                <button onClick={() => setImageSrc(editingItem.media_url)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-colors cursor-pointer">
                                    <i className="fa-solid fa-crop-simple w-5"></i> Rotate / Re-Crop Image
                                </button>
                            )}
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition-colors cursor-pointer">
                                <i className="fa-solid fa-upload w-5"></i> Replace Media
                            </button>
                            <button onClick={() => handleSaveSlot()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors cursor-pointer">
                                <i className="fa-solid fa-floppy-disk w-5"></i> Save Size Changes
                            </button>
                        </div>
                        
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button onClick={() => setIsEditOptionsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-slate-50 w-full text-center cursor-pointer">Cancel</button>
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
                                if (res.ok) {
                                    fetchItems();
                                    showFeedback('success', 'Image re-cropped and updated successfully!');
                                } else {
                                    alert('Failed to update image.');
                                }
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
