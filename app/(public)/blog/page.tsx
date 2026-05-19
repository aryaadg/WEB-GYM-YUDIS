import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Tips Fitness",
  description: "Baca artikel, tips fitness, dan panduan nutrisi terbaru dari trainer profesional DE GYM BALI.",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Tips Latihan": "bg-orange-500",
  "TIPS LATIHAN": "bg-orange-500",
  "Nutrisi": "bg-green-500",
  "NUTRISI": "bg-green-500",
  "Recovery": "bg-blue-500",
  "RECOVERY": "bg-blue-500",
  "Yoga": "bg-purple-500",
  "YOGA": "bg-purple-500",
  "Tips Gym": "bg-primary",
  "TIPS GYM": "bg-primary",
  "Motivasi": "bg-yellow-500",
  "MOTIVASI": "bg-yellow-500",
  "Lainnya": "bg-gray-500",
};

async function getArticles() {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();
  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

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
              Artikel, tips fitness, dan panduan nutrisi terbaru dari trainer dan ahli kesehatan DE GYM BALI.
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {articles.length === 0 && (
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
            <FileText className="w-16 h-16 text-gray-700 mx-auto" />
            <p className="text-gray-500 text-lg font-medium">Belum ada artikel yang dipublikasikan.</p>
            <p className="text-gray-600 text-sm">Tambahkan artikel melalui panel admin.</p>
          </div>
        </section>
      )}

      {/* Featured Article */}
      {featured && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-primary font-black tracking-widest text-xs mb-8">ARTIKEL UNGGULAN</p>
            <div className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 overflow-hidden hover:border-primary/30 transition-colors">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden bg-white/5">
                {featured.cover_image_url ? (
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center min-h-[240px]">
                    <FileText className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
              <div className="bg-[#111111] p-10 flex flex-col justify-center gap-6">
                <div className={`self-start ${CATEGORY_COLORS[featured.category] ?? "bg-gray-500"} text-white text-xs font-black tracking-widest px-3 py-1`}>
                  {featured.category.toUpperCase()}
                </div>
                <h2 className="text-3xl font-black tracking-tighter leading-tight">{featured.title}</h2>
                {featured.excerpt && (
                  <p className="text-gray-400 leading-relaxed">{featured.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{featured.author_name}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featured.read_time_minutes} menit
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
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

      {/* Articles Grid */}
      {rest.length > 0 && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-primary font-black tracking-widest text-xs mb-8">ARTIKEL TERBARU</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-[#111111] border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-white/5">
                    {article.cover_image_url ? (
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center min-h-[180px]">
                        <FileText className="w-12 h-12 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-4 left-4 ${CATEGORY_COLORS[article.category] ?? "bg-gray-500"} text-white text-xs font-black tracking-widest px-3 py-1`}>
                      {article.category.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{article.author_name}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time_minutes} menit
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
      )}
    </div>
  );
}
