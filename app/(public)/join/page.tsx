"use client";

import { useState } from "react";
import { CheckCircle2, Dumbbell, X, Loader2, Send, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

const plans = [
  {
    name: "BASIC",
    price: "299.000",
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
    period: "/bulan",
    desc: "Program intensif untuk hasil maksimal",
    features: [
      "Semua benefit Premium",
      "Sesi Personal Trainer unlimited",
      "Program diet & nutrisi khusus",
      "Analisis komposisi tubuh bulanan",
      "Priority booking semua kelas",
      "Guest pass 2x/bulan",
      "Merchandise YUDIS GYM eksklusif",
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
  start_date: "",
  message: "",
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "6281234567890";

export default function JoinPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const openModal = (planName: string) => {
    setSelectedPlan(planName);
    setForm(EMPTY_FORM);
    setSuccess(false);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setSuccess(false);
  };

  const buildWhatsAppMessage = () => {
    const startDate = form.start_date
      ? new Date(form.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      : "Secepatnya";

    return encodeURIComponent(
      `*PENDAFTARAN MEMBERSHIP YUDIS GYM* 🏋️‍♂️\n\n` +
      `Paket     : *${selectedPlan}*\n` +
      `Nama      : ${form.full_name}\n` +
      `Email     : ${form.email || "-"}\n` +
      `No. HP    : ${form.phone}\n` +
      `Mulai     : ${startDate}\n` +
      `Catatan   : ${form.message || "-"}\n\n` +
      `Mohon konfirmasi pendaftaran saya. Terima kasih! 🙏`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSubmitting(true);

    try {
      // 1. Simpan ke Supabase
      const { error: supabaseError } = await supabase.from("bookings").insert({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone,
        membership_type: selectedPlan as "Basic" | "Premium" | "Elite",
        start_date: form.start_date || null,
        message: form.message || null,
        status: "Baru",
      });

      if (supabaseError) {
        console.error("Supabase error:", supabaseError.message);
        // Lanjut meski ada error supabase (mungkin tabel belum dibuat)
      }

      // 2. Kirim ke Google Sheets (jika webhook URL tersedia)
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "google_sheets_webhook_url")
        .single();

      const webhookUrl = settingsData?.value;
      if (webhookUrl && webhookUrl.startsWith("https://")) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: form.full_name,
              email: form.email,
              phone: form.phone,
              membership_type: selectedPlan,
              start_date: form.start_date,
              message: form.message,
            }),
          });
        } catch {
          // Jangan blokir user jika webhook gagal
          console.warn("Google Sheets webhook failed");
        }
      }

      // 3. Tampilkan sukses
      setSuccess(true);
      toast.success("Booking berhasil! Mengarahkan ke WhatsApp...");

      // 4. Buka WhatsApp setelah 1.5 detik
      setTimeout(() => {
        window.open(`https://wa.me/${WA_NUMBER}?text=${buildWhatsAppMessage()}`, "_blank");
      }, 1500);

    } catch (err) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
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
            Investasikan diri Anda dengan membership YUDIS GYM. Fleksibel, terjangkau, dan tanpa kontrak jangka panjang.
          </p>
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
              { q: "Apakah ada masa percobaan gratis?", a: "Ya! Kami menyediakan 1 hari trial gratis untuk Anda merasakan fasilitas dan suasana YUDIS GYM sebelum mendaftar membership." },
              { q: "Apakah ada kontrak jangka panjang?", a: "Tidak ada kontrak mengikat. Membership dapat dibatalkan kapan saja dengan pemberitahuan 7 hari sebelum periode tagihan berikutnya." },
              { q: "Bagaimana cara mendaftar?", a: "Pilih paket yang sesuai, isi form pendaftaran, dan Anda akan diarahkan ke WhatsApp untuk konfirmasi dengan tim kami." },
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
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              /* ===== SUCCESS STATE ===== */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Booking Terkirim!</h3>
                  <p className="text-gray-400 text-sm">
                    Data Anda sudah kami terima. Anda akan diarahkan ke WhatsApp untuk konfirmasi...
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/20 p-4 text-left space-y-1">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Ringkasan Booking</p>
                  <p className="text-sm text-white"><span className="text-gray-500">Paket:</span> {selectedPlan}</p>
                  <p className="text-sm text-white"><span className="text-gray-500">Nama:</span> {form.full_name}</p>
                  <p className="text-sm text-white"><span className="text-gray-500">HP:</span> {form.phone}</p>
                </div>
                <button
                  onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${buildWhatsAppMessage()}`, "_blank")}
                  className="w-full bg-green-500 text-white font-black text-sm py-4 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  BUKA WHATSAPP SEKARANG
                </button>
                <button onClick={closeModal} className="text-gray-500 text-sm hover:text-white transition-colors">
                  Tutup
                </button>
              </div>
            ) : (
              /* ===== FORM ===== */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <p className="text-sm text-gray-400">
                  Isi form di bawah. Setelah submit, Anda akan diarahkan ke{" "}
                  <span className="text-green-400 font-bold">WhatsApp</span> untuk konfirmasi dengan tim kami.
                </p>

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

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com (opsional)"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Rencana Mulai
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Pesan / Pertanyaan
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Pertanyaan, kondisi kesehatan khusus, atau catatan lainnya (opsional)"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                  />
                </div>

                {/* Paket summary */}
                <div className="bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Paket Dipilih</p>
                    <p className="text-primary font-black text-lg">{selectedPlan}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plans.find(p => p.name !== selectedPlan)?.name || null)}
                    className="text-xs text-gray-500 hover:text-white underline transition-colors"
                  >
                    Ganti paket
                  </button>
                </div>

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
                    {submitting ? "MENGIRIM..." : "KIRIM & WHATSAPP"}
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  Dengan mengirim form ini, Anda menyetujui untuk dihubungi oleh tim YUDIS GYM.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
