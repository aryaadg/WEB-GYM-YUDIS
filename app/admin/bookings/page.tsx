"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { CalendarCheck, Loader2, Search, Trash2, MessageCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

type Booking = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  membership_type: "Basic" | "Premium" | "Elite";
  start_date: string | null;
  message: string | null;
  status: "Baru" | "Dikonfirmasi" | "Dibatalkan";
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  Baru: "bg-primary/10 text-primary border border-primary/20",
  Dikonfirmasi: "bg-green-500/10 text-green-400 border border-green-500/20",
  Dibatalkan: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const TYPE_STYLES: Record<string, string> = {
  Basic: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Premium: "bg-primary/10 text-primary border border-primary/20",
  Elite: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};



export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setBookings(data || []);
    else toast.error("Gagal memuat booking");
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    setUpdating(id);
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error("Gagal update status");
    else { toast.success(`Status diubah ke ${status}`); fetchBookings(); }
    setUpdating(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus booking dari "${name}"?`)) return;
    setDeleting(id);
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus");
    else { toast.success("Booking dihapus"); fetchBookings(); }
    setDeleting(null);
  };

  const openWhatsApp = (booking: Booking) => {
    const startDate = booking.start_date
      ? new Date(booking.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "Belum ditentukan";
    const msg = encodeURIComponent(
      `Halo ${booking.full_name}! 👋\n\n` +
      `Kami dari *YUDIS GYM* ingin mengkonfirmasi pendaftaran membership Anda:\n\n` +
      `Paket     : *${booking.membership_type}*\n` +
      `Mulai     : ${startDate}\n\n` +
      `Silakan hubungi kami untuk langkah selanjutnya. Terima kasih! 💪`
    );
    window.open(`https://wa.me/${booking.phone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.full_name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: bookings.length,
    baru: bookings.filter((b) => b.status === "Baru").length,
    dikonfirmasi: bookings.filter((b) => b.status === "Dikonfirmasi").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Booking Masuk</h1>
            <p className="text-gray-500 text-sm">Pendaftaran membership dari halaman website</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Booking", value: stats.total, color: "text-white" },
          { label: "Menunggu Konfirmasi", value: stats.baru, color: "text-primary" },
          { label: "Dikonfirmasi", value: stats.dikonfirmasi, color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 p-5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari nama, email, atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">Semua Status</option>
          <option value="Baru">Baru</option>
          <option value="Dikonfirmasi">Dikonfirmasi</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <CalendarCheck className="w-12 h-12 text-gray-700" />
            <p className="text-gray-500 font-medium">
              {search || filterStatus !== "all" ? "Tidak ada booking yang sesuai." : "Belum ada booking masuk."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">NAMA</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">KONTAK</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">PAKET</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">MULAI</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{b.full_name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{b.phone}</p>
                      <p className="text-xs text-gray-500">{b.email || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${TYPE_STYLES[b.membership_type]}`}>
                        {b.membership_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {b.start_date
                        ? new Date(b.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${STATUS_STYLES[b.status]}`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {/* WhatsApp */}
                        <button
                          onClick={() => openWhatsApp(b)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                          title="Hubungi via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        {/* Konfirmasi */}
                        {b.status !== "Dikonfirmasi" && (
                          <button
                            onClick={() => updateStatus(b.id, "Dikonfirmasi")}
                            disabled={updating === b.id}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                            title="Konfirmasi"
                          >
                            {updating === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        )}
                        {/* Batalkan */}
                        {b.status !== "Dibatalkan" && (
                          <button
                            onClick={() => updateStatus(b.id, "Dibatalkan")}
                            disabled={updating === b.id}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Batalkan"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {/* Hapus */}
                        <button
                          onClick={() => handleDelete(b.id, b.full_name)}
                          disabled={deleting === b.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          {deleting === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info pesan */}
      {filtered.some((b) => b.message) && (
        <div className="bg-[#111111] border border-white/5 p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">PESAN / CATATAN DARI CALON MEMBER</h3>
          {filtered.filter((b) => b.message).map((b) => (
            <div key={b.id} className="border-l-2 border-primary/40 pl-4 py-1">
              <p className="text-xs text-gray-500 mb-1 font-bold">{b.full_name} — {b.membership_type}</p>
              <p className="text-sm text-gray-300">{b.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
