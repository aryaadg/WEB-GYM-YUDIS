"use client"

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, 
  Trash2, 
  Calendar, 
  Phone, 
  Tag, 
  Eye
} from "lucide-react";
import { createClient } from "@/lib/supabase";

interface CarRef {
  brand: string;
  model: string;
  year: number;
}

interface TransactionItem {
  id: string;
  transaction_date: string;
  customer_name: string;
  customer_phone?: string;
  car_id: string;
  sale_price: number;
  payment_method: string;
  cars?: CarRef;
}

interface TransactionListTableProps {
  initialTransactions: TransactionItem[];
}

export default function TransactionListTable({ initialTransactions }: TransactionListTableProps) {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState({ month: "", year: "" });
  
  const supabase = createClient();

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const txDate = new Date(tx.transaction_date);
    const matchesMonth = periodFilter.month ? (txDate.getMonth() + 1).toString() === periodFilter.month : true;
    const matchesYear = periodFilter.year ? txDate.getFullYear().toString() === periodFilter.year : true;
    
    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus catatan transaksi ini? Status mobil akan tetap 'terjual' kecuali Anda mengubahnya manual.")) return;

    try {
      await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch {
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Filter Bar */}
      <div className="p-8 border-b border-gray-50 bg-white space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama pelanggan..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-accent"
              value={periodFilter.month}
              onChange={(e) => setPeriodFilter({...periodFilter, month: e.target.value})}
            >
              <option value="">Semua Bulan</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={(i+1).toString()}>
                  {new Date(0, i).toLocaleString('id-ID', {month: 'long'})}
                </option>
              ))}
            </select>
            
            <select 
              className="bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold focus:outline-none focus:border-accent"
              value={periodFilter.year}
              onChange={(e) => setPeriodFilter({...periodFilter, year: e.target.value})}
            >
              <option value="">Semua Tahun</option>
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
            Menampilkan {filteredTransactions.length} transaksi
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Pelanggan</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kontak</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Mobil</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Metode</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Harga Jual</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(tx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-[#1a1a2e]">{tx.customer_name}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                        <Phone className="w-3 h-3" />
                        {tx.customer_phone || "-"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-accent" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#1a1a2e] tracking-tight">{tx.cars?.brand} {tx.cars?.model}</span>
                        <span className="text-[10px] font-bold text-gray-400">{tx.cars?.year}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-[10px] font-black uppercase text-gray-600 rounded-full border border-gray-200">
                        {tx.payment_method}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-black text-accent">{formatCurrency(tx.sale_price)}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-xl transition-colors">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                    Catatan transaksi tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
