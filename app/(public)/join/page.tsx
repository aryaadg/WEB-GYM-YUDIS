import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Dumbbell } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Membership",
  description: "Bergabunglah dengan YUDIS GYM dan mulai perjalanan fitness terbaik Anda sekarang.",
};

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

export default function JoinPage() {
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
                  <p className="font-black tracking-widest text-xs text-gray-500 mb-2">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xs text-gray-500">Rp</span>
                    <span
                      className={`text-4xl font-black ${
                        plan.highlighted ? "text-primary" : "text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.desc}</p>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <p className="text-xs font-black tracking-widest text-gray-400 mb-4">
                    TERMASUK:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f, fi) => (
                      <li
                        key={fi}
                        className="flex items-start gap-3 text-sm text-gray-600 line-through"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-black tracking-widest text-sm h-14 flex items-center justify-center transition-colors mt-auto ${
                    plan.highlighted
                      ? "bg-primary text-black hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {plan.cta}
                </a>
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
              {
                q: "Apakah ada masa percobaan gratis?",
                a: "Ya! Kami menyediakan 1 hari trial gratis untuk Anda merasakan fasilitas dan suasana YUDIS GYM sebelum mendaftar membership.",
              },
              {
                q: "Apakah ada kontrak jangka panjang?",
                a: "Tidak ada kontrak mengikat. Membership dapat dibatalkan kapan saja dengan pemberitahuan 7 hari sebelum periode tagihan berikutnya.",
              },
              {
                q: "Bagaimana cara mendaftar?",
                a: "Klik tombol daftar dan hubungi kami via WhatsApp. Tim kami akan memandu proses pendaftaran dan pembayaran dengan mudah.",
              },
              {
                q: "Apakah bisa freeze membership?",
                a: "Ya, Anda dapat membekukan membership hingga 30 hari per tahun jika tidak dapat berlatih karena sakit atau keperluan penting.",
              },
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
    </div>
  );
}
