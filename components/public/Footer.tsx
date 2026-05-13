import Link from "next/link";
import { Dumbbell, MapPin, Phone, Mail, Clock } from "lucide-react";

// Custom SVG Icons untuk social media
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white"
            >
              <Dumbbell className="h-8 w-8 text-primary" />
              <span>
                YUDIS <span className="text-primary">GYM</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pusat kebugaran premium dengan peralatan modern, pelatih profesional, dan komunitas yang selalu mendukung perjalanan fitness Anda.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram YUDIS GYM"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook YUDIS GYM"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6">NAVIGASI</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">BERANDA</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">TENTANG KAMI</Link>
              </li>
              <li>
                <Link href="/classes" className="hover:text-primary transition-colors">KELAS</Link>
              </li>
              <li>
                <Link href="/coaches" className="hover:text-primary transition-colors">TRAINER</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">BLOG</Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary transition-colors">ADMIN LOGIN</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6">HUBUNGI KAMI</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Jl. Fitness No. 1, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  +62 812 3456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@yudisgym.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              JAM OPERASIONAL
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>SENIN - JUMAT</span>
                <span className="text-white font-bold">06:00 - 22:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>SABTU</span>
                <span className="text-white font-bold">07:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>MINGGU</span>
                <span className="text-white font-bold">08:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold tracking-widest text-gray-600">
            © {currentYear} YUDIS GYM. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xs text-gray-700 font-medium">Premium Fitness & Training Center</p>
        </div>
      </div>
    </footer>
  );
}
