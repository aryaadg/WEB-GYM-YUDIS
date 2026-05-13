import { createSupabaseServerClient } from "@/lib/supabase-server";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FilterBar from "@/components/public/FilterBar";
import { Car } from "@/lib/types";

export const dynamic = 'force-dynamic';

async function getCars() {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(image_url, is_primary)')
    .order('status', { ascending: true })   // 'tersedia' < 'terjual' alphabetically
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }

  return (data || []) as (Car & { car_images: { image_url: string; is_primary: boolean }[] })[];
}

export default async function KatalogPage() {
  const cars = await getCars();
  
  // Extract unique brands for the filter dropdown
  const brands = Array.from(new Set(cars.map((c) => c.brand))).sort() as string[];

  return (
    <div className="bg-[#1a1a2e] min-h-screen text-white">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">
                Katalog <span className="text-accent">Mobil Unggulan</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Jelajahi berbagai pilihan mobil berkualitas kami di Denpasar, Bali. Temukan unit impian Anda hari ini.
            </p>
        </header>

        {/* Filter & Results (Client Component) */}
        <FilterBar initialCars={cars} brands={brands} />
      </main>

      <Footer />
    </div>
  );
}
