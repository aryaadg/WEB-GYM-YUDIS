import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Users, FileText, ArrowRight, UserSquare2, Activity, Dumbbell } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    const supabase = createSupabaseServerClient();

    const [membersRes, trainersRes, articlesRes, activeMembersRes] = await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }),
      supabase.from("trainers").select("id", { count: "exact", head: true }),
      supabase.from("articles").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    ]);

    return {
      totalMembers: membersRes.count || 0,
      totalTrainers: trainersRes.count || 0,
      publishedArticles: articlesRes.count || 0,
      activeMembers: activeMembersRes.count || 0,
    };
  } catch {
    return { totalMembers: 0, totalTrainers: 0, publishedArticles: 0, activeMembers: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { title: "Total Member", value: stats.totalMembers, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", href: "/admin/members" },
    { title: "Member Aktif", value: stats.activeMembers, icon: Activity, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", href: "/admin/members" },
    { title: "Total Trainer", value: stats.totalTrainers, icon: UserSquare2, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", href: "/admin/trainers" },
    { title: "Artikel Published", value: stats.publishedArticles, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", href: "/admin/articles" },
  ];

  const quickLinks = [
    { label: "Tambah Member Baru", href: "/admin/members", icon: Users, color: "text-primary" },
    { label: "Tambah Trainer Baru", href: "/admin/trainers", icon: UserSquare2, color: "text-purple-400" },
    { label: "Tulis Artikel Baru", href: "/admin/articles", icon: FileText, color: "text-green-400" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Admin</h1>
        </div>
        <p className="text-gray-500 font-medium pl-14">
          Selamat datang kembali! Pantau performa DE GYM BALI hari ini.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link key={idx} href={stat.href} className={`bg-[#111111] p-6 border ${stat.border} group hover:border-primary/50 transition-all duration-300 block`}>
            <div className={`w-12 h-12 ${stat.bg} border ${stat.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-2">{stat.title}</p>
            <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-white/5 p-8">
          <h2 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            AKSI CEPAT
          </h2>
          <div className="space-y-3">
            {quickLinks.map((link, i) => (
              <Link key={i} href={link.href} className="flex items-center justify-between p-4 border border-white/5 hover:border-primary/30 hover:bg-primary/5 group transition-all">
                <div className="flex items-center gap-3">
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                  <span className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors">{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 p-8">
          <h2 className="text-lg font-black text-primary tracking-tight mb-6">DE GYM BALI ADMIN</h2>
          <div className="space-y-3 text-sm text-gray-400">
            <p className="leading-relaxed">
              Selamat datang di panel admin <strong className="text-white">DE GYM BALI</strong>. Kelola seluruh operasional gym dengan mudah.
            </p>
            <div className="space-y-2 pt-2">
              {[
                "Kelola data member dan status keanggotaan",
                "Kelola profil trainer dan pelatih",
                "Tulis dan publish artikel fitness",
                "Pantau statistik gym secara real-time",
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
