import { createSupabaseServerClient } from "@/lib/supabase-server";
import TransactionForm from "@/components/admin/TransactionForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getAvailableCars() {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('id, brand, model, year, price')
    .eq('status', 'tersedia')
    .order('brand', { ascending: true });

  if (error) {
    console.error('Error fetching available cars:', error);
    return [];
  }

  return data || [];
}

export default async function TambahTransaksiPage() {
  const availableCars = await getAvailableCars();

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col gap-4">
        <Link 
          href="/admin/transaksi"
          className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors w-fit"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Catat Transaksi Penjualan</h1>
          <p className="text-gray-500 font-medium">Rekam data penjualan unit baru atau bekas ke database.</p>
        </div>
      </header>

      <TransactionForm availableCars={availableCars} />
    </div>
  );
}
