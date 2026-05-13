"use client"

import { Phone } from "lucide-react";

export default function FloatingWA() {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281338332112";
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[999] bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center"
      aria-label="Chat WhatsApp"
    >
      <Phone className="w-8 h-8 fill-current" />
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
        Hubungi Kami via WhatsApp
      </span>
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10"></span>
    </a>
  );
}
