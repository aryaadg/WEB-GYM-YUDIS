"use client"

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface CarGalleryProps {
  images: { image_url: string; is_primary: boolean }[];
}

export default function CarGallery({ images }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images
  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/10] bg-white/5 rounded-3xl overflow-hidden flex flex-col items-center justify-center border border-white/5">
        <Image src="/placeholder-car.jpg" alt="No image" fill className="object-cover opacity-20" />
        <p className="relative z-10 text-gray-500 font-medium">Foto tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/10] bg-black rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
        <img
          src={images[activeIndex].image_url}
          alt="Main Car View"
          className="w-full h-full object-cover transition-all duration-700"
        />
        
        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-accent transition-colors"
                aria-label="Previous image"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
                onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-accent transition-colors"
                aria-label="Next image"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
        </div>

        {/* Zoom Icon Placeholder */}
        <div className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-lg">
            <Maximize2 className="w-4 h-4 text-white/70" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-2 px-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
                "relative aspect-video w-24 sm:w-32 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
                activeIndex === idx ? "border-accent scale-95 shadow-lg shadow-accent/20" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <img
              src={img.image_url}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
