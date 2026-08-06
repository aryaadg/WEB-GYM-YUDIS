"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Dumbbell, LogOut, Calendar, Clock, CheckCircle2, AlertTriangle, Loader2, RefreshCw, QrCode } from "lucide-react";
import Link from "next/link";

type MemberData = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  membership_type: "Basic" | "Premium" | "Elite";
  membership_start: string | null;
  membership_end: string | null;
  status: string;
  qr_code: string;
};

const TYPE_COLORS: Record<string, string> = {
  Basic: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Premium: "text-primary border-primary/30 bg-primary/10",
  Elite: "text-purple-400 border-purple-500/30 bg-purple-500/10",
};

function getRemainingDays(endDate: string | null): number {
  if (!endDate) return 0;
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MemberDashboardPage() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [_userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Cek session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/member/login");
        return;
      }

      const email = session.user.email || null;
      const name = session.user.user_metadata?.full_name || session.user.email || "Member";
      setUserEmail(email);
      setUserName(name);

      // Ambil data member
      if (email) {
        const { data } = await supabase
          .from("members")
          .select("*")
          .eq("email", email)
          .single();

        if (data) {
          setMember(data);
        } else {
          // Fallback: cari dari bookings yang sudah paid
          const { data: booking } = await supabase
            .from("bookings")
            .select("*")
            .eq("email", email)
            .eq("status", "paid")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (booking) {
            setMember({
              id: booking.id,
              full_name: booking.full_name,
              email: booking.email,
              phone: booking.phone,
              membership_type: booking.membership_type,
              membership_start: booking.membership_start,
              membership_end: booking.membership_end,
              status: "Aktif",
            });
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/member/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const remainingDays = member ? getRemainingDays(member.membership_end) : 0;
  const totalDays = 30;
  const usedDays = totalDays - remainingDays;
  const progressPercent = Math.min(100, Math.max(0, (usedDays / totalDays) * 100));

  const isExpiringSoon = remainingDays > 0 && remainingDays <= 7;
  const isExpired = remainingDays === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-black text-white text-sm">DE GYM BALI</p>
            <p className="text-gray-500 text-xs">Member Portal</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        {/* Greeting */}
        <div>
          <p className="text-gray-500 text-sm">Selamat datang kembali 👋</p>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            {member?.full_name || userName || "Member"}
          </h1>
        </div>

        {!member ? (
          // Tidak ada data member
          <div className="bg-[#111111] border border-white/10 p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
            <h2 className="text-xl font-black text-white">Data Member Tidak Ditemukan</h2>
            <p className="text-gray-400 text-sm">
              Akun Anda belum memiliki membership aktif, atau pembayaran belum dikonfirmasi.
            </p>
            <Link
              href="/join"
              className="inline-block bg-primary text-black font-black text-sm px-6 py-3 hover:bg-primary/90 transition-colors"
            >
              DAFTAR MEMBERSHIP
            </Link>
          </div>
        ) : (
          <>
            {/* Membership Status Card */}
            <div className={`bg-[#111111] border p-6 space-y-4 ${
              isExpired ? "border-red-500/30" : isExpiringSoon ? "border-yellow-500/30" : "border-white/10"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Paket Membership</p>
                  <span className={`text-xs font-black tracking-widest px-3 py-1 border ${TYPE_COLORS[member.membership_type]}`}>
                    {member.membership_type.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-sm font-black ${isExpired ? "text-red-400" : "text-green-400"}`}>
                    {isExpired ? "EXPIRED" : "AKTIF"}
                  </span>
                </div>
              </div>

              {/* Sisa Hari — Highlight Utama */}
              <div className={`p-5 text-center ${
                isExpired
                  ? "bg-red-500/10 border border-red-500/20"
                  : isExpiringSoon
                  ? "bg-yellow-500/10 border border-yellow-500/20"
                  : "bg-primary/5 border border-primary/20"
              }`}>
                {isExpired ? (
                  <>
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-4xl font-black text-red-400">EXPIRED</p>
                    <p className="text-gray-400 text-sm mt-2">Membership Anda telah habis. Silakan perpanjang.</p>
                  </>
                ) : (
                  <>
                    <Clock className={`w-6 h-6 mx-auto mb-2 ${isExpiringSoon ? "text-yellow-400" : "text-primary"}`} />
                    <p className={`text-6xl font-black ${isExpiringSoon ? "text-yellow-400" : "text-primary"}`}>
                      {remainingDays}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">hari tersisa sebelum diperpanjang</p>
                    {isExpiringSoon && (
                      <p className="text-yellow-400 text-xs font-bold mt-2 animate-pulse">
                        ⚠️ Segera perpanjang membership Anda!
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* QR Code Section */}
              <div className="bg-[#111111] border border-white/10 p-6 flex flex-col items-center text-center space-y-4">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Code Member Anda
                </h2>
                <div className="bg-white p-4 rounded-sm inline-block">
                  <QRCodeSVG 
                    value={member.qr_code || member.id} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-gray-500 text-xs font-mono bg-white/5 px-3 py-1 rounded">
                  ID: {member.qr_code || member.id}
                </p>
                {member.status === "Tidak Aktif" || member.status === "Expired" ? (
                   <p className="text-yellow-400 text-sm font-medium animate-pulse">
                     Tunjukkan QR Code ini ke kasir/resepsionis gym untuk melakukan pembayaran dan aktivasi membership Anda.
                   </p>
                ) : (
                   <p className="text-gray-400 text-sm">
                     Scan QR Code ini di meja resepsionis saat kedatangan.
                   </p>
                )}
              </div>

              {/* Progress Bar */}
              {!isExpired && member.status === "Aktif" && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Digunakan: {usedDays} hari</span>
                    <span>Total: {totalDays} hari</span>
                  </div>
                  <div className="w-full bg-white/5 h-2">
                    <div
                      className={`h-2 transition-all ${isExpiringSoon ? "bg-yellow-400" : "bg-primary"}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Detail Membership */}
            <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Detail Membership</h2>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: "Tanggal Mulai", value: formatDate(member.membership_start) },
                  { icon: Calendar, label: "Tanggal Berakhir", value: formatDate(member.membership_end) },
                  { icon: CheckCircle2, label: "Email", value: member.email },
                  { icon: CheckCircle2, label: "No. HP", value: member.phone },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                    <item.icon className="w-4 h-4 text-gray-500 shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jadwal Kelas */}
              <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Jadwal Kelas</h2>
                <p className="text-gray-400 text-sm h-10">
                  Lihat jadwal kelas gym hari ini dan amankan slot Anda (kuota terbatas).
                </p>
                <Link
                  href="/member/classes"
                  className="flex items-center justify-center gap-2 w-full bg-white text-black font-black text-sm py-4 hover:bg-gray-200 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  BOOKING KELAS
                </Link>
              </div>

              {/* Perpanjang Membership */}
              <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Perpanjang Membership</h2>
                <p className="text-gray-400 text-sm h-10">
                  {isExpired
                    ? "Membership Anda telah habis. Daftar ulang untuk melanjutkan."
                    : `Membership masih aktif ${remainingDays} hari. Perpanjang sekarang.`}
                </p>
                <Link
                  href="/join"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-black font-black text-sm py-4 hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  {isExpired ? "DAFTAR ULANG" : "PERPANJANG"}
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Kontak */}
        <p className="text-center text-gray-600 text-xs">
          Butuh bantuan?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "6281338332112"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            Hubungi kami via WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
