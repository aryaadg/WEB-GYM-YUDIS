import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Tips Fitness",
  description: "Baca artikel, tips fitness, dan panduan nutrisi terbaru dari trainer profesional YUDIS GYM.",
};

const articles = [
  {
    title: "5 Latihan HIIT Terbaik untuk Pemula yang Ingin Turun Berat Badan",
    category: "TIPS LATIHAN",
    excerpt: "High-Intensity Interval Training adalah metode latihan paling efektif untuk membakar lemak. Berikut 5 gerakan dasar yang cocok untuk pemula.",
    readTime: "5 menit",
    date: "10 Mei 2025",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    slug: "#",
    featured: true,
  },
  {
    title: "Protein: Berapa Kebutuhan Harian Anda?",
    category: "NUTRISI",
    excerpt: "Protein adalah nutrisi paling penting untuk pembentukan otot. Pelajari cara menghitung kebutuhan protein harian Anda dengan tepat.",
    readTime: "4 menit",
    date: "5 Mei 2025",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
    slug: "#",
    featured: false,
  },
  {
    title: "Kenapa Tidur Cukup Sama Pentingnya dengan Latihan?",
    category: "RECOVERY",
    excerpt: "Banyak orang mengabaikan pentingnya tidur dalam perjalanan fitness mereka. Pelajari hubungan antara kualitas tidur dan performa latihan.",
    readTime: "6 menit",
    date: "1 Mei 2025",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1887&auto=format&fit=crop",
    slug: "#",
    featured: false,
  },
  {
    title: "Yoga untuk Atlet: Fleksibilitas yang Meningkatkan Performa",
    category: "YOGA",
    excerpt: "Yoga bukan hanya untuk relaksasi. Pelajari bagaimana rutin yoga 20 menit per hari dapat meningkatkan performa atletik Anda secara signifikan.",
    readTime: "7 menit",
    date: "25 April 2025",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
    slug: "#",
    featured: false,
  },
  {
    title: "Panduan Lengkap: Cara Memilih Personal Trainer yang Tepat",
    category: "TIPS GYM",
    excerpt: "Investasi pada Personal Trainer bisa mengubah perjalanan fitness Anda. Berikut kriteria penting yang harus Anda pertimbangkan sebelum memilih.",
    readTime: "8 menit",
    date: "20 April 2025",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    slug: "#",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "TIPS LATIHAN": "bg-orange-500",
  "NUTRISI": "bg-green-500",
  "RECOVERY": "bg-blue-500",
  "YOGA": "bg-purple-500",
  "TIPS GYM": "bg-primary",
};

export default function BlogPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Hero */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-primary font-black tracking-widest text-sm mb-4">KNOWLEDGE BASE</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              BLOG & <span className="text-primary">TIPS</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Artikel, tips fitness, dan panduan nutrisi terbaru dari trainer dan ahli kesehatan YUDIS GYM.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-primary font-black tracking-widest text-xs mb-8">ARTIKEL UNGGULAN</p>
            <div className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
              <div className="bg-[#111111] p-10 flex flex-col justify-center gap-6">
                <div className={`self-start ${categoryColors[featured.category] || "bg-primary"} text-black text-xs font-black tracking-widest px-3 py-1`}>
                  {featured.category}
                </div>
                <h2 className="text-3xl font-black tracking-tighter leading-tight">
                  {featured.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{featured.date}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featured.readTime}
                    </div>
                  </div>
                  <Link
                    href={featured.slug}
                    className="flex items-center gap-2 text-primary font-black text-xs tracking-widest group-hover:translate-x-2 transition-transform"
                  >
                    BACA <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-primary font-black tracking-widest text-xs mb-8">ARTIKEL TERBARU</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rest.map((article, i) => (
              <Link
                key={i}
                href={article.slug}
                className="group bg-[#111111] border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 left-4 ${categoryColors[article.category] || "bg-primary"} text-black text-xs font-black tracking-widest px-3 py-1`}>
                    {article.category}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{article.date}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
