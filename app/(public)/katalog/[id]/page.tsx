import { notFound } from "next/navigation";

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CarGallery from "@/components/public/CarGallery";
import CarTabs from "@/components/public/CarTabs";
import CarCard from "@/components/public/CarCard";
import { formatCurrency } from "@/lib/utils";
import { 
  MessageSquare, 
  ChevronRight, 
  Calendar, 
  Gauge, 
  Fuel, 
  Share2 
} from "lucide-react";
import { Car } from "@/lib/types";

export const dynamic = 'force-dynamic';

async function getCarDetails(id: string) {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

async function getOtherCars(excludeId: string) {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(image_url)')
    .eq('status', 'tersedia')
    .eq('car_images.is_primary', true)
    .neq('id', excludeId)
    .limit(3);

  if (error) return [];
  return data || [];
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await getCarDetails(params.id);
  
  if (!car) {
    notFound();
  }

  const otherCars = await getOtherCars(params.id);
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";
  const waMessage = encodeURIComponent(`Halo GG Autocar, saya tertarik dengan unit ${car.brand} ${car.model} (${car.year}). Apakah masih tersedia?`);
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="bg-[#1a1a2e] min-h-screen text-white">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: GALLERY (8 cols) */}
          <div className="lg:col-span-8 lg:sticky lg:top-32 self-start">
            <CarGallery images={car.car_images || []} />
          </div>

          {/* RIGHT: MAIN INFO (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className={car.condition === 'baru' ? 'bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase' : 'bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase'}>
                    {car.condition}
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">{car.transmission}</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                {car.brand} <br />
                <span className="text-accent">{car.model} {car.year}</span>
              </h1>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Harga Tunai</p>
                    <h2 className="text-3xl font-black text-accent tracking-tighter">
                        {formatCurrency(car.price)}
                    </h2>
                </div>
                {car.price_credit > 0 && (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Harga Kredit</p>
                      <h2 className="text-3xl font-black text-white tracking-tighter">
                          {formatCurrency(car.price_credit)}
                      </h2>
                  </div>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <Calendar className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Tahun</p>
                    <p className="text-sm font-black text-white">{car.year}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <Gauge className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Km</p>
                    <p className="text-sm font-black text-white">{car.condition === 'baru' ? '0' : (car.mileage?.toLocaleString() || "-")}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <Fuel className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Bensin</p>
                    <p className="text-sm font-black text-white capitalize">{car.fuel_type}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <Link
                    href={waLink}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#22c35e] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 transition-all active:scale-95"
                >
                    <MessageSquare className="w-6 h-6 fill-current" />
                    Tanya via WhatsApp
                </Link>
                <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl border border-white/10 font-bold tracking-tight transition-all">
                        <Share2 className="w-4 h-4" />
                        Share Unit
                    </button>
                </div>
              </div>
            </div>

            {/* Additional Mini Info Cards */}
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Ringkasan Unit</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Warna</span>
                  <span className="text-white font-bold">{car.color || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Jenis Bahan Bakar</span>
                  <span className="text-white font-bold capitalize">{car.fuel_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Nomor Plat</span>
                  <span className="text-white font-bold">{car.license_plate || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: TABS (Specs, Tax, Desc) */}
        <CarTabs car={car} />

        {/* BOTTOM: CAR LISTING (Other cars) */}
        {otherCars.length > 0 && (
            <section className="mt-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white tracking-tight">Mobil Lainnya</h2>
                    <Link href="/katalog" className="text-accent font-bold flex items-center gap-1 hover:underline">
                        Lihat Semua
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherCars.map((other: Car) => (
                        <CarCard key={other.id} car={other} />
                    ))}
                </div>
            </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
