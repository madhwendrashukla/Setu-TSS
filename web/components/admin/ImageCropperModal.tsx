"use client";
import { useState, useCallback } from "react";
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "@/utils/cropImage";

interface ImageCropperModalProps {
    imageSrc: string;
    onCropComplete: (croppedImage: File) => void;
    onCancel: () => void;
    aspect?: number; // E.g., 16/9, 1 for square, undefined for free crop
}

export function ImageCropperModal({ imageSrc, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSave = useCallback(async () => {
        try {
            setIsProcessing(true);
            if (!imageSrc || !croppedAreaPixels) return;
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    }, [imageSrc, croppedAreaPixels, onCropComplete]);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className="w-full max-w-4xl relative h-[60vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                />
            </div>
            
            <div className="w-full max-w-4xl mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full max-w-xs">
                    <label className="text-white text-xs uppercase font-bold tracking-wider mb-2 block">Zoom</label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-accent-blue"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50"
                    >
                        {isProcessing ? "Processing..." : "Crop & Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
