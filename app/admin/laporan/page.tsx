import ReportDashboard from "@/components/admin/ReportDashboard";

export const dynamic = 'force-dynamic';

export default function LaporanPage() {
  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Laporan Penjualan</h1>
        <p className="text-gray-500 font-medium">Analisis performa keuangan dan unit GG Autocar.</p>
      </header>

      <ReportDashboard />
    </div>
  );
}
