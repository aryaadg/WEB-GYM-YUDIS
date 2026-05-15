import type { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, Award, UserSquare2 } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trainer Kami",
  description: "Kenali trainer profesional bersertifikat di YUDIS GYM yang siap membimbing perjalanan fitness Anda.",
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

async function getTrainers() {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("trainers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function CoachesPage() {
  const trainers = await getTrainers();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Hero */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-primary font-black tracking-widest text-sm mb-4">TIM PROFESIONAL</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              TRAINER <span className="text-primary">KAMI</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Tim trainer bersertifikat internasional kami siap membimbing dan memotivasi Anda meraih hasil terbaik.
            </p>
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {trainers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <UserSquare2 className="w-16 h-16 text-gray-700" />
              <p className="text-gray-500 text-lg font-medium">Belum ada trainer yang terdaftar.</p>
              <p className="text-gray-600 text-sm">Tambahkan trainer melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="group bg-[#111111] border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    {trainer.photo_url ? (
                      <img
                        src={trainer.photo_url}
                        alt={trainer.full_name}
                        className="w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserSquare2 className="w-20 h-20 text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Instagram */}
                    {trainer.instagram_url && (
                      <a
                        href={trainer.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-primary hover:border-primary transition-colors"
                        aria-label={`Instagram ${trainer.full_name}`}
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                    )}

                    {/* Experience Badge */}
                    <div className="absolute bottom-4 left-4 bg-primary text-black text-xs font-black tracking-widest px-3 py-1">
                      {trainer.experience_years} TAHUN
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter">{trainer.full_name}</h3>
                      <p className="text-primary font-black text-xs tracking-widest mt-1 flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" />
                        {trainer.specialty}
                      </p>
                    </div>

                    {trainer.bio && (
                      <p className="text-gray-400 text-sm leading-relaxed">{trainer.bio}</p>
                    )}

                    {/* Certifications */}
                    {trainer.certifications && trainer.certifications.length > 0 && (
                      <div className="space-y-1.5">
                        {trainer.certifications.map((cert: string, ci: number) => (
                          <div key={ci} className="flex items-center gap-2 text-xs text-gray-500">
                            <Award className="w-3 h-3 text-primary shrink-0" />
                            {cert}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/join"
                      className="w-full bg-white/5 border border-white/10 hover:bg-primary hover:border-primary hover:text-black text-white font-black text-xs tracking-widest py-3 flex items-center justify-center transition-all"
                    >
                      BOOK SESI PRIVATE
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black">
            LATIH DENGAN YANG TERBAIK
          </h2>
          <p className="text-black/70 text-lg max-w-xl mx-auto font-bold">
            Konsultasikan tujuan fitness Anda dengan trainer profesional kami secara gratis untuk sesi pertama.
          </p>
          <Link
            href="/join"
            className="bg-black text-white hover:bg-black/90 font-black px-12 h-16 inline-flex items-center justify-center text-lg transition-colors"
          >
            MULAI PERJALANAN ANDA
          </Link>
        </div>
      </section>
    </div>
  );
}
