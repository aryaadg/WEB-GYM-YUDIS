import Link from "next/link";
import { Car as CarType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Calendar, Gauge, Fuel, Info } from "lucide-react";

interface CarCardProps {
  car: CarType & { car_images?: { image_url: string; is_primary?: boolean }[] };
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage = car.car_images?.find(img => img.is_primary);
  const displayImage = primaryImage?.image_url || car.car_images?.[0]?.image_url || "/placeholder-car.jpg";
  const isSold = car.status === 'terjual';

  return (
    <div className={`group bg-white/5 rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full relative ${
      isSold 
        ? 'border-red-500/30 opacity-80' 
        : 'border-white/10 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5'
    }`}>
      {/* Image Wrapper */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={displayImage}
          alt={`${car.brand} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${isSold ? 'grayscale-[30%]' : 'group-hover:scale-105'}`}
          loading="lazy"
        />

        {/* TERJUAL Overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-red-600 text-white font-black text-xl px-8 py-3 rounded-2xl rotate-[-8deg] shadow-2xl tracking-widest uppercase border-2 border-red-400">
              TERJUAL
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={car.condition === 'baru' ? 'bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase' : 'bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase'}>
            {car.condition}
          </span>
          <span className="bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {car.transmission}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className={`text-lg font-bold text-white line-clamp-1 ${!isSold && 'group-hover:text-accent transition-colors'}`}>
            {car.brand} {car.model}
          </h3>
          {isSold ? (
            <p className="text-lg font-black text-red-400 mt-1 line-through opacity-60">{formatCurrency(car.price)}</p>
          ) : (
            <p className="text-xl font-black text-accent mt-1">{formatCurrency(car.price)}</p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 my-4 mt-auto">
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-400">{car.year}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-400 line-clamp-1">{car.condition === 'baru' ? '0' : (car.mileage?.toLocaleString() || '-')} km</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] text-gray-400 capitalize">{car.fuel_type}</span>
          </div>
        </div>

        <Link
          href={`/katalog/${car.id}`}
          className={`block w-full text-center py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
            isSold
              ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed pointer-events-none'
              : 'bg-white/10 hover:bg-accent text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          {isSold ? 'Unit Telah Terjual' : 'Lihat Detail'}
        </Link>
      </div>
    </div>
  );
}
