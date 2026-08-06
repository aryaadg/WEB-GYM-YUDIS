"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { CheckCircle2, Dumbbell, X, Loader2, Send, Lock, Eye, EyeOff, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

const plans = [
  {
    name: "BASIC",
    price: "299.000",
    priceNum: 299000,
    period: "/bulan",
    desc: "Untuk pemula yang ingin memulai perjalanan fitness",
    features: [
      "Akses gym jam operasional (06:00 - 22:00)",
      "Loker & shower pribadi",
      "1x sesi orientasi gratis",
      "Akses area cardio & free weight",
      "Aplikasi member digital",
    ],
    notIncluded: ["Kelas grup", "Sesi Personal Trainer", "Akses sauna"],
    cta: "PILIH BASIC",
    highlighted: false,
  },
  {
    name: "PREMIUM",
    price: "499.000",
    priceNum: 499000,
    period: "/bulan",
    desc: "Pengalaman fitness paling komplet dan populer",
    features: [
      "Akses gym 24/7",
      "Semua kelas grup tanpa batas",
      "2x sesi Personal Trainer/bulan",
      "Akses sauna & spa",
      "Juice bar diskon 20%",
      "Loker premium",
      "Aplikasi member digital",
    ],
    notIncluded: ["Sesi PT unlimited"],
    cta: "PILIH PREMIUM",
    highlighted: true,
  },
  {
    name: "ELITE",
    price: "899.000",
    priceNum: 899000,
    period: "/bulan",
    desc: "Program intensif untuk hasil maksimal",
    features: [
      "Semua benefit Premium",
      "Sesi Personal Trainer unlimited",
      "Program diet & nutrisi khusus",
      "Analisis komposisi tubuh bulanan",
      "Priority booking semua kelas",
      "Guest pass 2x/bulan",
      "Merchandise DE GYM BALI eksklusif",
    ],
    notIncluded: [],
    cta: "PILIH ELITE",
    highlighted: false,
  },
];

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  message: "",
};

export default function JoinPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const openModal = (planName: string) => {
    setSelectedPlan(planName);
    setForm(EMPTY_FORM);
  };

  const closeModal = () => {
    setSelectedPlan(null);
  };

  const selectedPlanData = plans.find(p => p.name === selectedPlan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Validasi password
    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setSubmitting(true);

    try {
      // Convert nama plan ke proper case untuk memenuhi DB constraint
      const membershipType = (selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1).toLowerCase()) as "Basic" | "Premium" | "Elite";

      // 1. Sign up user ke Supabase Auth
      toast.loading("Membuat akun member...", { id: "signup" });
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
         throw new Error("Gagal membuat akun");
      }

      // 2. Simpan profil ke tabel members
      const { error: memberError } = await supabase
        .from("members")
        .insert({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          membership_type: membershipType,
          notes: form.message || null,
          status: "Tidak Aktif", // Akan diaktifkan kasir di gym
          auth_user_id: authData.user.id,
        });

      if (memberError) {
        // Jika gagal insert member, tapi auth berhasil, ini butuh manual fix, tapi kita lempar error dulu
        throw new Error("Gagal menyimpan profil member: " + memberError.message);
      }

      // 3. Kirim ke Google Sheets (Opsional)
      try {
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "google_sheets_webhook_url")
          .single();

        const webhookUrl = settingsData?.value;
        if (webhookUrl && webhookUrl.startsWith("https://")) {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: form.full_name,
              email: form.email,
              phone: form.phone,
              membership_type: membershipType,
              message: form.message,
            }),
          });
        }
      } catch {
        // Abaikan error sheet
      }

      toast.dismiss("signup");
      toast.success("Pendaftaran berhasil! Mengarahkan ke dashboard...");
      
      // Redirect ke member dashboard untuk melihat QR code
      window.location.href = '/member/dashboard';

    } catch (err: unknown) {
      toast.dismiss("signup");
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      toast.error(msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Hero */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-primary font-black tracking-widest text-sm mb-4">JADILAH BAGIAN KAMI</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            PILIH <span className="text-primary">PAKET</span> ANDA
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Investasikan diri Anda dengan membership DE GYM BALI. Fleksibel, terjangkau, dan tanpa kontrak jangka panjang.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-gray-500 text-sm">Sudah punya akun?</span>
            <Link href="/member/login" className="text-primary font-bold text-sm hover:underline">
              Login Member →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative border p-8 flex flex-col gap-6 ${
                  plan.highlighted
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-white/10 bg-[#111111]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black tracking-widest px-6 py-1.5 whitespace-nowrap">
                    ⭐ PALING POPULER
                  </div>
                )}

                <div>
                  <p className="font-black tracking-widest text-xs text-gray-500 mb-2">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs text-gray-500">Rp</span>
                    <span className={`text-4xl font-black ${plan.highlighted ? "text-primary" : "text-white"}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.desc}</p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <p className="text-xs font-black tracking-widest text-gray-400 mb-4">TERMASUK:</p>
                  <ul className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-gray-600 line-through">
                        <CheckCircle2 className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openModal(plan.name)}
                  className={`font-black tracking-widest text-sm h-14 flex items-center justify-center transition-colors mt-auto ${
                    plan.highlighted
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-primary font-black tracking-widest text-sm">FAQ</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">PERTANYAAN UMUM</h3>
          </div>
          <div className="space-y-4">
            {[
              { q: "Apakah ada masa percobaan gratis?", a: "Ya! Kami menyediakan 1 hari trial gratis untuk Anda merasakan fasilitas dan suasana DE GYM BALI sebelum mendaftar membership." },
              { q: "Apakah ada kontrak jangka panjang?", a: "Tidak ada kontrak mengikat. Membership dapat dibatalkan kapan saja dengan pemberitahuan 7 hari sebelum periode tagihan berikutnya." },
              { q: "Bagaimana cara mendaftar?", a: "Pilih paket yang sesuai, isi form pendaftaran, dan Anda akan mendapatkan QR Code. Tunjukkan QR Code tersebut ke kasir/resepsionis di gym untuk melakukan pembayaran dan aktivasi akun." },
              { q: "Apakah bisa freeze membership?", a: "Ya, Anda dapat membekukan membership hingga 30 hari per tahun jika tidak dapat berlatih karena sakit atau keperluan penting." },
            ].map((faq, i) => (
              <div key={i} className="border border-white/10 p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <Dumbbell className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-white mb-2">{faq.q}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKING MODAL ===== */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <p className="text-xs font-black text-gray-500 tracking-widest">PAKET DIPILIH</p>
                <h2 className="text-xl font-black text-primary mt-1">
                  {selectedPlan} MEMBERSHIP
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">
                  Rp {selectedPlanData?.price}/bulan
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Info pembayaran */}
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 p-3">
                <CreditCard className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-gray-300">
                  Setelah mendaftar, Anda akan mendapatkan <strong className="text-primary">QR Code</strong> di dashboard. Tunjukkan QR Code tersebut ke resepsionis gym untuk melakukan pembayaran dan aktivasi akun.
                </p>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Nama lengkap Anda"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                />
              </div>

              {/* Nomor HP */}
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Nomor HP / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Email * <span className="text-gray-600 font-normal normal-case tracking-normal">(digunakan untuk login)</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Password * <span className="text-gray-600 font-normal normal-case tracking-normal">(min. 6 karakter)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Buat password akun Anda"
                    className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">Password ini digunakan untuk login ke portal member setelah pendaftaran.</p>
              </div>

              {/* Pesan opsional */}
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                  Catatan <span className="text-gray-600 font-normal normal-case tracking-normal">(opsional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Kondisi kesehatan khusus atau pertanyaan lainnya"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                />
              </div>

              {/* Paket summary */}
              <div className="bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Paket Dipilih</p>
                  <p className="text-primary font-black text-lg">{selectedPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tagihan di Gym</p>
                  <p className="text-white font-black">Rp {selectedPlanData?.price}</p>
                </div>
              </div>

              {/* Durasi info */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span>Membership aktif <strong className="text-white">30 hari</strong> sejak pembayaran dikonfirmasi di gym</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white/5 text-white border border-white/10 py-3 font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-black font-black text-sm py-3 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitting ? "MEMPROSES..." : "DAFTAR SEKARANG"}
                </button>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Dengan mendaftar, Anda menyetujui syarat & ketentuan DE GYM BALI.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
