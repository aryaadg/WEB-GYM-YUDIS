import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin, Award, Users, Dumbbell, Trophy } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali lebih dekat DE GYM BALI — pusat kebugaran premium yang hadir untuk membantu Anda mencapai tujuan fitness terbaik.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-primary/3 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-primary font-black tracking-widest text-sm mb-4">SIAPA KAMI</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
              TENTANG <br />
              <span className="text-primary">DE GYM BALI</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              DE GYM BALI bukan sekadar tempat olahraga — ini adalah komunitas dan gaya hidup. Kami hadir untuk membantu setiap orang meraih versi terbaik dari dirinya melalui program fitness yang terstruktur dan lingkungan yang mendukung.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
                  alt="DE GYM BALI Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-primary p-8 hidden md:block">
                <div className="text-5xl font-black text-black">2020</div>
                <div className="text-black font-black text-xs tracking-widest">BERDIRI SEJAK</div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-primary font-black tracking-widest text-sm mb-4">KISAH KAMI</p>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
                  PERJALANAN MENUJU <span className="text-primary">EXCELLENCE</span>
                </h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Didirikan pada tahun 2020, DE GYM BALI lahir dari sebuah visi sederhana: menciptakan ruang yang inklusif, profesional, dan menginspirasi untuk semua orang yang ingin hidup lebih sehat.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Kini, dengan lebih dari <strong className="text-white">2000+ member aktif</strong>, kami terus berinovasi menghadirkan fasilitas terbaik, program latihan terkini, dan komunitas yang saling mendukung.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { value: "5+", label: "Tahun Berpengalaman" },
                  { value: "2000+", label: "Member Aktif" },
                  { value: "25+", label: "Trainer Profesional" },
                  { value: "50+", label: "Kelas per Minggu" },
                ].map((stat, i) => (
                  <div key={i} className="border border-white/10 p-4">
                    <div className="text-3xl font-black text-primary">{stat.value}</div>
                    <div className="text-xs font-bold tracking-widest text-gray-500 mt-1">
                      {stat.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <p className="text-primary font-black tracking-widest text-sm">FILOSOFI KAMI</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">NILAI-NILAI KAMI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Trophy,
                title: "EXCELLENCE",
                desc: "Kami berkomitmen untuk selalu memberikan standar tertinggi dalam setiap aspek — dari peralatan, pelatih, hingga kebersihan dan layanan.",
              },
              {
                icon: Users,
                title: "KOMUNITAS",
                desc: "Di DE GYM BALI, Anda bukan sekadar member. Anda adalah bagian dari keluarga yang saling mendukung dan menginspirasi satu sama lain.",
              },
              {
                icon: Award,
                title: "INTEGRITAS",
                desc: "Kami transparan dalam harga, jujur dalam saran, dan konsisten dalam memberikan hasil yang nyata bagi setiap member.",
              },
            ].map((val, i) => (
              <div
                key={i}
                className="group border border-white/10 p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <val.icon
                  className="w-12 h-12 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-black tracking-widest mb-4">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-primary font-black tracking-widest text-sm mb-4">HUBUNGI KAMI</p>
                <h2 className="text-5xl font-black tracking-tighter">KAMI SIAP MEMBANTU</h2>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Punya pertanyaan tentang kelas, membership, atau fasilitas kami? Jangan ragu untuk menghubungi tim kami. Kami dengan senang hati akan membantu Anda.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border border-white/10 p-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lokasi</p>
                    <p className="text-white font-bold">Jl. Fitness No. 1, Kota Anda, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">WhatsApp</p>
                    <a
                      href="https://wa.me/6281234567890"
                      className="text-white font-bold hover:text-primary transition-colors"
                    >
                      +62 812 3456 7890
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <InstagramIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Instagram</p>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-bold hover:text-primary transition-colors"
                    >
                      @degymbali
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <Dumbbell className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-3xl font-black mb-4">SIAP BERGABUNG?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Mulai perjalanan fitness Anda bersama ribuan member DE GYM BALI. Dapatkan trial gratis 1 hari untuk merasakan perbedaannya!
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-black font-black px-8 py-4 flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  HUBUNGI KAMI
                </a>
                <Link
                  href="/join"
                  className="bg-white/10 text-white font-black px-8 py-4 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                >
                  LIHAT PAKET MEMBERSHIP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
