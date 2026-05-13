"use client"

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { 
  TrendingUp, 
  Banknote, 
  ShoppingBag, 
  Award,
  Loader2,
  Filter,
  ArrowDownToLine,
  Search
} from "lucide-react";

type TransactionItem = {
  id: string;
  transaction_date: string;
  customer_name: string;
  sale_price: number;
  cars?: { brand: string; model: string };
};

type BrandRecapItem = {
  brand: string;
  count: number;
  revenue: number;
};

export default function ReportDashboard() {
  const currentMonth = (new Date().getMonth() + 1).toString();
  const currentYear = new Date().getFullYear().toString();
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ month: currentMonth, year: currentYear });
  const [data, setData] = useState<{
    totalTx: number;
    totalRevenue: number;
    avgPrice: number;
    bestSeller: string;
    transactions: TransactionItem[];
    brandRecap: BrandRecapItem[];
  } | null>(null);

  const supabase = createClient();

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const startDate = new Date(parseInt(filter.year), parseInt(filter.month) - 1, 1).toISOString();
    const endDate = new Date(parseInt(filter.year), parseInt(filter.month), 0).toISOString();

    const { data: txData, error } = await supabase
      .from('transactions')
      .select('*, cars(brand, model, year)')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false });

    if (!error && txData) {
      // Process Summary
      const totalTx = txData.length;
      const totalRevenue = txData.reduce((sum, t) => sum + Number(t.sale_price), 0);
      const avgPrice = totalTx > 0 ? totalRevenue / totalTx : 0;

      // Process Brand Recap
      const brandMap: Record<string, { count: number; revenue: number }> = {};
      txData.forEach(tx => {
        const brand = tx.cars?.brand || "Lainnya";
        if (!brandMap[brand]) {
            brandMap[brand] = { count: 0, revenue: 0 };
        }
        brandMap[brand].count += 1;
        brandMap[brand].revenue += Number(tx.sale_price);
      });

      const brandRecap = Object.entries(brandMap).map(([brand, stats]) => ({
        brand,
        ...stats
      })).sort((a, b) => b.count - a.count);

      const bestSeller = brandRecap.length > 0 ? brandRecap[0].brand : "-";

      setData({
        totalTx,
        totalRevenue,
        avgPrice,
        bestSeller,
        transactions: txData,
        brandRecap
      });
    }
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const summaryCards = [
    { title: "Transaksi Periode", value: data?.totalTx || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Pendapatan", value: formatCurrency(data?.totalRevenue || 0), icon: Banknote, color: "text-accent", bg: "bg-accent/5" },
    { title: "Rata-rata Harga", value: formatCurrency(data?.avgPrice || 0), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Merek Terlaris", value: data?.bestSeller || "-", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Filter Laporan:</span>
        </div>
        <select 
            className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-6 text-sm font-black focus:outline-none focus:ring-2 focus:ring-accent/10"
            value={filter.month}
            onChange={(e) => setFilter({...filter, month: e.target.value})}
        >
            {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={(i+1).toString()}>
                    {new Date(0, i).toLocaleString('id-ID', {month: 'long'})}
                </option>
            ))}
        </select>
        <select 
            className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-6 text-sm font-black focus:outline-none focus:ring-2 focus:ring-accent/10"
            value={filter.year}
            onChange={(e) => setFilter({...filter, year: e.target.value})}
        >
            {[2024, 2025, 2026].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
            ))}
        </select>
        <button 
            disabled={loading}
            onClick={fetchReportData}
            className="bg-[#1a1a2e] text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Tampilkan Laporan
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="font-bold text-gray-400">Memproses Data Laporan...</p>
        </div>
      ) : (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform`}>
                    <card.icon className={`w-32 h-32 ${card.color}`} />
                </div>
                <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center mb-6`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{card.title}</p>
                <h3 className="text-2xl font-black text-[#1a1a2e] tracking-tighter">{card.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Detailed Table */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-primary tracking-tight">Detail Transaksi Periode</h3>
                <button className="p-2 hover:bg-gray-50 text-accent rounded-xl" title="Download CSV">
                    <ArrowDownToLine className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest w-12">No</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Pelanggan</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Unit Mobil</th>
                      <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Harga Jual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.transactions.map((tx, i: number) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5 text-sm font-bold text-gray-400">{i + 1}</td>
                        <td className="px-8 py-5 text-sm font-medium text-[#1a1a2e]">
                            {new Date(tx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-primary">{tx.customer_name}</td>
                        <td className="px-8 py-5">
                            <span className="text-xs font-black text-gray-600 block">{tx.cars?.brand} {tx.cars?.model}</span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-sm text-primary">
                            {formatCurrency(tx.sale_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50/80">
                        <td colSpan={4} className="px-8 py-6 text-sm font-black text-primary text-right uppercase tracking-widest">Total Pendapatan</td>
                        <td className="px-8 py-6 text-right font-black text-lg text-accent">{formatCurrency(data?.totalRevenue || 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Brand Recap */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 h-fit">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-black text-primary tracking-tight">Rekap Per Merek</h3>
              </div>
              <div className="p-2">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Merek</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Unit</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data?.brandRecap.map((item: BrandRecapItem, i: number) => (
                      <tr key={i} className="group">
                        <td className="px-6 py-5 text-sm font-black text-primary group-hover:pl-8 transition-all duration-300">{item.brand}</td>
                        <td className="px-6 py-5 text-center">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{item.count}</span>
                        </td>
                        <td className="px-6 py-5 text-right text-xs font-bold text-gray-400">
                            {formatCurrency(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
