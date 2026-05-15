import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import {
  Dumbbell, Users, Calendar, ArrowRight, Trophy, Zap, Shield, ChevronDown, Clock, UserSquare2, FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

const stats = [
  { label: "METER PERSEGI", value: "2000+" },
  { label: "TRAINER ELIT", value: "25+" },
  { label: "KELAS PER MINGGU", value: "50+" },
  { label: "MESIN MODERN", value: "150+" },
];

const features = [
  { icon: Dumbbell, title: "PERALATAN PREMIUM", desc: "Lebih dari 150 mesin dan alat fitness berteknologi tinggi." },
  { icon: Users, title: "TRAINER BERSERTIFIKAT", desc: "Tim pelatih profesional bersertifikat internasional." },
  { icon: Calendar, title: "KELAS BERAGAM", desc: "50+ kelas per minggu: Yoga, HIIT, Muay Thai, Zumba." },
  { icon: Trophy, title: "HASIL TERBUKTI", desc: "Ribuan member telah transformasi bersama YUDIS GYM." },
  { icon: Zap, title: "AKSES 24/7", desc: "Berlatih kapan saja, gym kami selalu buka." },
  { icon: Shield, title: "LINGKUNGAN AMAN", desc: "CCTV 24 jam, kebersihan terjaga, staff siap membantu." },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Tips Latihan": "bg-orange-500",
  "Nutrisi": "bg-green-500",
  "Recovery": "bg-blue-500",
  "Yoga": "bg-purple-500",
  "Tips Gym": "bg-yellow-500",
  "Motivasi": "bg-red-500",
  "Lainnya": "bg-gray-500",
};

async function getHomepageData() {
  try {
    const supabase = createSupabaseServerClient();

    const [trainersRes, articlesRes, membersRes] = await Promise.all([
      supabase.from("trainers").select("*").eq("is_active", true).limit(3),
      supabase.from("articles").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
      supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    ]);

    return {
      trainers: trainersRes.data || [],
      articles: articlesRes.data || [],
      memberCount: membersRes.count || 0,
    };
  } catch {
    return { trainers: [], articles: [], memberCount: 0 };
  }
}

export default async function LandingPage() {
  const { trainers, articles, memberCount } = await getHomepageData();

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
              alt="YUDIS GYM"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9]">
                UNLEASH YOUR <br />
                <span className="text-primary">POTENTIAL</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-xl font-medium">
                Pusat kebugaran premium dengan peralatan world-class, pelatih ahli, dan komunitas yang mendorong hasil nyata.
              </p>
              {memberCount > 0 && (
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {memberCount}+ Member Aktif
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/join" className="bg-primary text-black hover:bg-primary/90 text-lg font-black px-10 h-16 flex items-center justify-center transition-colors">
                  DAFTAR SEKARANG
                </Link>
                <Link href="/classes" className="bg-white text-black hover:bg-white/90 text-lg font-black px-10 h-16 flex items-center justify-center transition-colors">
                  EXPLORE KELAS
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-white/40">SCROLL</span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="py-20 border-y border-white/10 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl md:text-6xl font-black text-primary">{stat.value}</div>
                  <div className="text-xs font-bold tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="py-32 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-primary font-black tracking-widest text-sm">FASILITAS KAMI</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter">SEMUA YANG ANDA BUTUHKAN</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group border border-white/10 p-8 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  <feature.icon size={40} className="text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-black tracking-widest text-sm mb-3">{feature.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRAINERS FROM SUPABASE ===== */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <h2 className="text-primary font-black tracking-widest text-sm flex items-center gap-2">
                  <UserSquare2 className="w-4 h-4" /> TRAINER KAMI
                </h2>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  LATIH DENGAN <br /><span className="text-primary">YANG TERBAIK</span>
                </h3>
              </div>
              <Link href="/coaches" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-primary font-black text-xs tracking-widest transition-colors group">
                LIHAT SEMUA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {trainers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trainers.map((trainer) => (
                  <div key={trainer.id} className="group border border-white/10 hover:border-primary/40 transition-all overflow-hidden">
                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                      {trainer.photo_url ? (
                        <img src={trainer.photo_url} alt={trainer.full_name} className="w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserSquare2 className="w-16 h-16 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-primary text-black text-xs font-black tracking-widest px-3 py-1">
                          {trainer.experience_years} THN
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h4 className="text-xl font-black text-white">{trainer.full_name}</h4>
                      <p className="text-primary text-xs font-black tracking-widest flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" /> {trainer.specialty}
                      </p>
                      {trainer.bio && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{trainer.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-white/5">
                <UserSquare2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Trainer akan tampil di sini setelah ditambahkan via admin.</p>
              </div>
            )}

            <div className="text-center mt-10 md:hidden">
              <Link href="/coaches" className="text-primary font-black text-xs tracking-widest flex items-center justify-center gap-2">
                LIHAT SEMUA TRAINER <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== ARTICLES FROM SUPABASE ===== */}
        <section className="py-32 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <h2 className="text-primary font-black tracking-widest text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" /> ARTIKEL & TIPS
                </h2>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  PENGETAHUAN <br /><span className="text-primary">FITNESS</span>
                </h3>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-primary font-black text-xs tracking-widest transition-colors group">
                LIHAT SEMUA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug}`} className="group border border-white/10 hover:border-primary/40 transition-all overflow-hidden">
                    <div className="relative aspect-video overflow-hidden bg-white/5">
                      {article.cover_image_url ? (
                        <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute top-4 left-4 ${CATEGORY_COLORS[article.category] || "bg-gray-500"} text-white text-xs font-black tracking-widest px-3 py-1`}>
                        {article.category.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h4 className="font-black text-white text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      {article.excerpt && <p className="text-gray-500 text-sm line-clamp-2">{article.excerpt}</p>}
                      <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                        <span>{article.author_name}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time_minutes} menit
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-white/5">
                <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Artikel akan tampil di sini setelah dipublish via admin.</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== MEMBERSHIP ===== */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-primary font-black tracking-widest text-sm">PILIH PAKET ANDA</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter">MEMBERSHIP</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "BASIC", price: "299K", features: ["Akses gym jam operasional", "Loker & shower", "1 sesi orientasi", "Akses area cardio"], highlighted: false, cta: "PILIH BASIC" },
                { name: "PREMIUM", price: "499K", features: ["Akses gym 24/7", "Semua kelas grup", "2 sesi PT/bulan", "Akses sauna & spa", "Juice bar diskon 20%"], highlighted: true, cta: "PILIH PREMIUM" },
                { name: "ELITE", price: "899K", features: ["Semua benefit Premium", "PT unlimited", "Program diet khusus", "Analisis tubuh bulanan", "Priority booking kelas"], highlighted: false, cta: "PILIH ELITE" },
              ].map((plan, i) => (
                <div key={i} className={`relative border p-8 flex flex-col gap-6 ${plan.highlighted ? "border-primary bg-primary/10 scale-105" : "border-white/10"}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black tracking-widest px-4 py-1 whitespace-nowrap">
                      ⭐ PALING POPULER
                    </div>
                  )}
                  <div>
                    <h4 className="font-black tracking-widest text-xs text-gray-400 mb-2">{plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-black ${plan.highlighted ? "text-primary" : "text-white"}`}>Rp {plan.price}</span>
                      <span className="text-gray-500 text-sm">/bulan</span>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/join" className={`font-black tracking-widest text-sm h-12 flex items-center justify-center transition-colors ${plan.highlighted ? "bg-primary text-black hover:bg-primary/90" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-40 relative overflow-hidden bg-primary">
          <div className="max-w-7xl mx-auto relative z-10 px-6 text-center space-y-10">
            <h2 className="text-6xl md:text-9xl font-black text-black tracking-tighter leading-none">
              SIAP UNTUK <br /> MULAI?
            </h2>
            <p className="text-2xl text-black/80 font-bold max-w-2xl mx-auto">
              Bergabunglah bersama {memberCount > 0 ? `${memberCount}+` : "ribuan"} member YUDIS GYM dan transformasikan hidup Anda.
            </p>
            <Link href="/join" className="bg-black text-white hover:bg-black/90 text-xl font-black px-16 h-20 inline-flex items-center justify-center transition-colors">
              DAFTAR SEKARANG
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-black/5 leading-none select-none pointer-events-none">
            JOIN
          </div>
        </section>
      </main>
    </div>
  );
}
