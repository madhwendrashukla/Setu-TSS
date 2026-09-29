"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getEmbedUrl, fetchYouTubeTitle } from '@/lib/video';

function SortableVideoItem({ 
    item, 
    onEdit, 
    onDelete 
}: { 
    item: any; 
    onEdit: (item: any) => void; 
    onDelete: (id: string) => void; 
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const embedUrl = getEmbedUrl(item.youtube_url);

    return (
        <div ref={setNodeRef} style={style} className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
            {/* Drag Handle */}
            <div 
                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur rounded-lg p-2 shadow-sm cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-900 transition" 
                {...attributes} 
                {...listeners}
                title="Drag to reorder"
            >
                <i className="fas fa-grip-vertical"></i>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                <button 
                    type="button"
                    onPointerDown={(e) => { e.stopPropagation(); onEdit(item); }}
                    className="bg-white/95 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-200 hover:border-blue-600 transition flex items-center gap-1 cursor-pointer"
                    title="Edit Title & URL"
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Edit</span>
                </button>
                <button 
                    type="button"
                    onPointerDown={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="bg-white/95 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-200 hover:border-red-600 transition flex items-center gap-1 cursor-pointer"
                    title="Remove Video"
                >
                    <i className="fa-solid fa-trash"></i>
                    <span>Delete</span>
                </button>
            </div>

            {/* Video Preview */}
            <div className="w-full aspect-video bg-gray-900 relative flex items-center justify-center border-b border-gray-100">
                {embedUrl ? (
                    <iframe 
                        className="w-full h-full pointer-events-none"
                        src={`${embedUrl}?controls=0`} 
                        title={item.title || "Video"}
                        frameBorder="0" 
                    ></iframe>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <i className="fas fa-play-circle text-4xl text-accent-blue"></i>
                        <span className="text-xs">No video preview</span>
                    </div>
                )}
            </div>

            {/* Card Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug" title={item.title}>
                        {item.title || <span className="text-gray-400 italic">No Title (Will not show title on landing page)</span>}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 truncate flex items-center gap-1.5">
                        <i className="fa-brands fa-youtube text-red-500 shrink-0"></i>
                        <span className="truncate">{item.youtube_url}</span>
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-400">
                        Order: #{item.display_order !== undefined ? item.display_order + 1 : 1}
                    </span>
                    <button 
                        type="button"
                        onClick={() => onEdit(item)}
                        className="text-xs font-medium text-accent-blue hover:underline flex items-center gap-1"
                    >
                        <i className="fa-solid fa-pencil text-[10px]"></i> Edit Title
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminBottomVideos() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formData, setFormData] = useState({ title: "", youtube_url: "", display_order: 0 });
    const [uploading, setUploading] = useState(false);
    const [fetchingTitle, setFetchingTitle] = useState(false);
    const [fetchSuccessMessage, setFetchSuccessMessage] = useState<string | null>(null);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchItems = () => {
        fetch(`${API}/api/admin/bottom_videos`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => setItems(Array.isArray(data) ? data : []))
            .catch(console.error);
    };

    useEffect(() => { 
        fetchItems(); 
    }, []);

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ title: "", youtube_url: "", display_order: items.length });
        setFetchSuccessMessage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setEditingItem(item);
        setFormData({ 
            title: item.title || "", 
            youtube_url: item.youtube_url || "", 
            display_order: item.display_order ?? 0 
        });
        setFetchSuccessMessage(null);
        setIsModalOpen(true);
    };

    const handleAutoFetchTitle = async (urlToFetch?: string) => {
        const url = urlToFetch || formData.youtube_url;
        if (!url || !url.trim()) {
            alert("Please enter a valid YouTube URL first.");
            return;
        }

        setFetchingTitle(true);
        setFetchSuccessMessage(null);
        try {
            const fetched = await fetchYouTubeTitle(url.trim(), API, token() || undefined);
            if (fetched) {
                setFormData(prev => ({ ...prev, title: fetched }));
                setFetchSuccessMessage("Title successfully fetched from YouTube!");
                setTimeout(() => setFetchSuccessMessage(null), 4000);
            } else {
                alert("Could not fetch title from this YouTube URL. Please check the link or enter the title manually.");
            }
        } catch (error) {
            console.error("Auto-fetch title error:", error);
            alert("Error fetching YouTube title.");
        } finally {
            setFetchingTitle(false);
        }
    };

    const handleUrlBlur = () => {
        if (formData.youtube_url && !formData.title.trim()) {
            handleAutoFetchTitle(formData.youtube_url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const url = editingItem 
                ? `${API}/api/admin/bottom_videos/${editingItem.id}`
                : `${API}/api/admin/bottom_videos`;
            const method = editingItem ? "PUT" : "POST";

            const payload = editingItem 
                ? { ...formData }
                : { ...formData, display_order: items.length };

            const res = await fetch(url, { 
                method, 
                headers: { 
                    "Authorization": `Bearer ${token()}`, 
                    "Content-Type": "application/json" 
                }, 
                body: JSON.stringify(payload) 
            });

            const result = await res.json();
            if (!res.ok) { 
                alert(result.error || `Failed to ${editingItem ? 'update' : 'add'} video`); 
                return; 
            }

            setIsModalOpen(false); 
            setEditingItem(null);
            setFormData({ title: "", youtube_url: "", display_order: 0 }); 
            fetchItems();
        } catch (error) {
            console.error("Submit error:", error);
            alert(`Error ${editingItem ? 'updating' : 'adding'} video`);
        } finally { 
            setUploading(false); 
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this video?")) return;
        try {
            await fetch(`${API}/api/admin/bottom_videos/${id}`, { 
                method: "DELETE", 
                headers: { "Authorization": `Bearer ${token()}` } 
            });
            fetchItems();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        // Update display_order for all affected items
        const updates = newItems.map((item, index) => ({
            id: item.id,
            display_order: index,
        }));

        setItems(newItems);

        try {
            await fetch(`${API}/api/admin/bottom_videos/reorder`, {
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

    const previewEmbedUrl = getEmbedUrl(formData.youtube_url);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bottom Video Gallery</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage, edit titles, and drag to rearrange promotional YouTube videos shown on the landing page carousel.
                    </p>
                </div>
                <button 
                    onClick={openAddModal} 
                    className="bg-black text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition shadow-sm flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-plus text-sm"></i>
                    <span>Add Video</span>
                </button>
            </div>

            {/* Video Grid or Empty State */}
            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 shadow-sm flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl mb-1">
                        <i className="fa-solid fa-film"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No videos added yet</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                        Add YouTube videos with titles that will appear in the interactive carousel near the bottom of your landing page.
                    </p>
                    <button 
                        onClick={openAddModal} 
                        className="mt-2 bg-black text-white font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition"
                    >
                        + Add First Video
                    </button>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <SortableVideoItem 
                                    key={item.id} 
                                    item={item} 
                                    onEdit={openEditModal}
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Add / Edit Video Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl my-8 relative">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingItem ? "Edit Video & Title" : "Add YouTube Video"}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {editingItem ? "Update the title or URL of this video" : "Paste a YouTube link and customize its title"}
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* YouTube URL Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">
                                        YouTube URL <span className="text-red-500">*</span>
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={() => handleAutoFetchTitle()}
                                        disabled={fetchingTitle || !formData.youtube_url}
                                        className="text-xs font-semibold text-accent-blue hover:text-accent-violet transition flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        title="Automatically fetch title from YouTube"
                                    >
                                        {fetchingTitle ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin"></i>
                                                <span>Fetching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                                <span>Auto-Fetch Title</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input 
                                        type="url" 
                                        required 
                                        value={formData.youtube_url} 
                                        onChange={e => setFormData({ ...formData, youtube_url: e.target.value })}
                                        onBlur={handleUrlBlur}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition pr-10" 
                                        placeholder="https://www.youtube.com/watch?v=..." 
                                    />
                                    <i className="fa-brands fa-youtube absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"></i>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Supports regular videos, shorts, and youtu.be links.
                                </p>
                            </div>

                            {/* Fetch Success Alert */}
                            {fetchSuccessMessage && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs flex items-center gap-2 animate-fadeIn">
                                    <i className="fa-solid fa-circle-check text-green-600"></i>
                                    <span>{fetchSuccessMessage}</span>
                                </div>
                            )}

                            {/* Video Title Field */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">
                                        Video Title
                                    </label>
                                    <span className="text-xs text-gray-400">Editable</span>
                                </div>
                                <input 
                                    type="text" 
                                    value={formData.title} 
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" 
                                    placeholder="e.g. The Reality of Building a Startup" 
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    This title is displayed right underneath the video card on the website.
                                </p>
                            </div>

                            {/* Live Video Preview Box */}
                            {previewEmbedUrl && (
                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                                        Live Video Preview:
                                    </label>
                                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-gray-200 shadow-inner">
                                        <iframe 
                                            className="w-full h-full"
                                            src={previewEmbedUrl}
                                            title="Live Preview"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={uploading || fetchingTitle} 
                                    className="bg-black text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {uploading && <i className="fa-solid fa-spinner fa-spin"></i>}
                                    <span>
                                        {uploading 
                                            ? (editingItem ? 'Saving Changes...' : 'Adding Video...') 
                                            : (editingItem ? 'Save Changes' : 'Add Video')
                                        }
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
