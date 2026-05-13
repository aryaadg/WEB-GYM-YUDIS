import { createSupabaseServerClient } from "@/lib/supabase-server";
import TransactionListTable from "@/components/admin/TransactionListTable";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getTransactions() {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*, cars(brand, model, year)')
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
}

export default async function AdminTransaksiPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Catatan Transaksi</h1>
          <p className="text-gray-500 font-medium">Kelola riwayat penjualan unit GG Autocar.</p>
        </div>
        <Link
          href="/admin/transaksi/tambah"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Catat Transaksi
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <TransactionListTable initialTransactions={transactions} />
      </div>
    </div>
  );
}
