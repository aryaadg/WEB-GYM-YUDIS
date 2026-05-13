import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Users, Flame, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelas Fitness",
  description: "Temukan kelas fitness terbaik di YUDIS GYM. Yoga, Pilates, HIIT, Zumba, Muay Thai dan banyak lagi.",
};

const classes = [
  {
    name: "HIIT Training",
    category: "CARDIO",
    duration: "45 menit",
    level: "Semua Level",
    schedule: "Senin, Rabu, Jumat",
    time: "06:00 & 18:00",
    desc: "High-Intensity Interval Training yang efektif membakar lemak dan meningkatkan stamina dalam waktu singkat.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    color: "bg-red-500",
  },
  {
    name: "Yoga & Mindfulness",
    category: "FLEKSIBILITAS",
    duration: "60 menit",
    level: "Pemula - Menengah",
    schedule: "Selasa, Kamis, Sabtu",
    time: "07:00 & 17:00",
    desc: "Kombinasi gerakan yoga dengan teknik mindfulness untuk keseimbangan fisik dan mental.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
    color: "bg-purple-500",
  },
  {
    name: "Muay Thai",
    category: "BELA DIRI",
    duration: "60 menit",
    level: "Semua Level",
    schedule: "Senin, Rabu, Jumat",
    time: "17:00 & 19:00",
    desc: "Latihan seni bela diri Muay Thai yang membangun kekuatan, kelincahan, dan kepercayaan diri.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2034&auto=format&fit=crop",
    color: "bg-orange-500",
  },
  {
    name: "Zumba Dance",
    category: "DANCE FITNESS",
    duration: "45 menit",
    level: "Pemula",
    schedule: "Selasa, Kamis",
    time: "08:00 & 19:00",
    desc: "Kelas dance fitness yang menyenangkan dengan musik Latin yang energik. Membakar kalori sambil bersenang-senang.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    color: "bg-pink-500",
  },
  {
    name: "Pilates",
    category: "CORE STRENGTH",
    duration: "50 menit",
    level: "Semua Level",
    schedule: "Senin, Rabu, Sabtu",
    time: "09:00 & 16:00",
    desc: "Latihan Pilates untuk memperkuat otot inti, meningkatkan postur, dan fleksibilitas tubuh.",
    image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=2041&auto=format&fit=crop",
    color: "bg-blue-500",
  },
  {
    name: "Bodybuilding",
    category: "STRENGTH",
    duration: "90 menit",
    level: "Menengah - Lanjut",
    schedule: "Senin - Sabtu",
    time: "Fleksibel",
    desc: "Program pembentukan otot intensif dengan panduan trainer berpengalaman menggunakan alat gym modern.",
    image: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=2070&auto=format&fit=crop",
    color: "bg-yellow-500",
  },
];

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Hero */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-primary font-black tracking-widest text-sm mb-4">PROGRAM LATIHAN</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              KELAS <span className="text-primary">FITNESS</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Lebih dari 50 kelas per minggu dengan instruktur bersertifikat. Temukan kelas yang sesuai dengan tujuan dan level fitness Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls, i) => (
              <div
                key={i}
                className="group bg-[#111111] border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className={`absolute top-4 left-4 ${cls.color} text-white text-xs font-black tracking-widest px-3 py-1`}>
                    {cls.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-black tracking-tighter">{cls.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{cls.desc}</p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{cls.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Flame className="w-3.5 h-3.5 text-primary" />
                      <span>{cls.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{cls.schedule} • {cls.time}</span>
                    </div>
                  </div>

                  <Link
                    href="/join"
                    className="flex items-center gap-2 text-primary font-black text-xs tracking-widest group-hover:translate-x-2 transition-transform pt-2"
                  >
                    DAFTAR KELAS <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-primary font-black tracking-widest text-sm">
            <Users className="w-4 h-4" />
            MULAI SEKARANG
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
            SIAP BERGABUNG?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Daftar membership sekarang dan dapatkan akses ke semua kelas premium.
          </p>
          <Link
            href="/join"
            className="bg-primary text-black hover:bg-primary/90 font-black px-12 h-16 inline-flex items-center justify-center text-lg transition-colors"
          >
            DAFTAR MEMBERSHIP
          </Link>
        </div>
      </section>
    </div>
  );
}
