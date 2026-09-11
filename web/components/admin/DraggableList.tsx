"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DraggableListProps {
    items: any[];
    onReorder: (newItems: any[]) => void;
    renderRow: (item: any, index: number) => React.ReactNode;
    colCount?: number;
}

export function DraggableList({ items, onReorder, renderRow }: DraggableListProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [showSaved, setShowSaved] = useState(false);
    const [mounted, setMounted] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setMounted(true); }, []);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            setOverIndex(null);
            return;
        }
        const newItems = [...items];
        const [removed] = newItems.splice(dragIndex, 1);
        newItems.splice(dropIndex, 0, removed);
        setDragIndex(null);
        setOverIndex(null);
        onReorder(newItems);
        setShowSaved(true);
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setShowSaved(false), 2000);
    };

    const handleDragEnd = () => {
        setDragIndex(null);
        setOverIndex(null);
    };

    return (
        <>
            {items.map((item, index) => (
                <tr
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-gray-100 transition-colors select-none ${
                        dragIndex === index ? "opacity-40 bg-blue-50" : ""
                    } ${
                        overIndex === index && dragIndex !== index
                            ? "bg-blue-50 border-t-2 border-blue-400"
                            : dragIndex !== index ? "hover:bg-gray-50" : ""
                    }`}
                >
                    <td className="pl-4 py-4 w-8 cursor-grab active:cursor-grabbing">
                        <span className="text-gray-300 hover:text-gray-500 text-xl leading-none font-mono select-none" title="Drag to reorder">
                            &#9959;
                        </span>
                    </td>
                    {renderRow(item, index)}
                </tr>
            ))}
            {mounted && showSaved && createPortal(
                <div className="fixed bottom-6 right-6 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg z-[9999] flex items-center gap-2 pointer-events-none">
                    <i className="fas fa-check"></i> Order Saved
                </div>,
                document.body
            )}
        </>
    );
}
