import { createSupabaseServerClient } from "@/lib/supabase-server";

import CarListTable from "@/components/admin/CarListTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getCars() {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(image_url)')
    .eq('car_images.is_primary', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }

  return data || [];
}

export default async function AdminMobilPage() {
  const cars = await getCars();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Kelola Mobil</h1>
          <p className="text-gray-500 font-medium">Manajemen stok unit GG Autocar.</p>
        </div>
        <Link
          href="/admin/mobil/tambah"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tambah Mobil
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <CarListTable initialCars={cars} />
      </div>
    </div>
  );
}
