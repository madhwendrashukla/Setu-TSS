"use client";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableVideoItem({ item, onDelete }: { item: any, onDelete: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur rounded-md p-1.5 shadow-sm cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-900" {...attributes} {...listeners}>
                <i className="fas fa-grip-vertical px-1"></i>
            </div>
            <div className="w-full aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100">
                {item.youtube_url.includes('youtube.com') || item.youtube_url.includes('youtu.be') ? (
                    <iframe 
                        className="w-full h-full pointer-events-none" // Disable pointer events so drag works over iframe
                        src={`https://www.youtube.com/embed/${item.youtube_url.split('v=')[1]?.split('&')[0] || item.youtube_url.split('youtu.be/')[1]}?controls=0`} 
                        title={item.title || "Video"}
                        frameBorder="0" 
                    ></iframe>
                ) : (
                    <i className="fas fa-play-circle text-4xl text-accent-blue"></i>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{item.title || "Untitled Video"}</h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{item.youtube_url}</p>
            </div>
            <button onPointerDown={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow cursor-pointer">
                Remove
            </button>
        </div>
    );
}

export default function AdminBottomVideos() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", youtube_url: "", display_order: 0 });
    const [uploading, setUploading] = useState(false);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchItems = () => {
        fetch(`${API}/api/admin/bottom_videos`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setItems(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const res = await fetch(`${API}/api/admin/bottom_videos`, { 
                method: "POST", 
                headers: { "Authorization": `Bearer ${token()}`, "Content-Type": "application/json" }, 
                body: JSON.stringify({...formData, display_order: items.length }) 
            });
            const result = await res.json();
            if (!res.ok) { alert(result.error || 'Failed to add video'); return; }
            setIsModalOpen(false); 
            setFormData({ title: "", youtube_url: "", display_order: 0 }); 
            fetchItems();
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this video?")) return;
        await fetch(`${API}/api/admin/bottom_videos/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
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

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Bottom Video Gallery</h1>
                    <p className="text-sm text-gray-500 mt-1">Drag and drop to rearrange the video order</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition shadow border border-gray-200">+ Add Video</button>
            </div>

            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 shadow-sm">No videos added yet.</div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <SortableVideoItem key={item.id} item={item} onDelete={handleDelete} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Add Video</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Video Title (Optional)</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" 
                                    placeholder="e.g. Masterclass with Founder" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                                <input type="url" required value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" 
                                    placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <button type="submit" disabled={uploading} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50">
                                {uploading ? 'Adding...' : 'Add Video'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
