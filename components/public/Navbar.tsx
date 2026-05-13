"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Dumbbell } from "lucide-react";

const navLinks = [
  { name: "BERANDA", href: "/" },
  { name: "TENTANG", href: "/about" },
  { name: "KELAS", href: "/classes" },
  { name: "TRAINER", href: "/coaches" },
  { name: "BLOG", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md py-3 border-b border-white/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white"
          >
            <Dumbbell className="h-8 w-8 text-primary" />
            <span>
              YUDIS{" "}
              <span className="text-primary">GYM</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-bold tracking-widest transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-white/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <Link
                href="/admin/login"
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold text-xs tracking-widest px-6 py-2.5 transition-colors"
              >
                LOGIN
              </Link>
              <Link
                href="/join"
                className="bg-primary text-black hover:bg-primary/90 font-bold text-xs tracking-widest px-6 py-2.5 transition-colors"
              >
                DAFTAR SEKARANG
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white p-2 z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black transition-all duration-500 ease-in-out md:hidden flex flex-col items-center justify-center ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="absolute top-6 right-6 text-white p-2"
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>

        <div className="flex flex-col items-center space-y-8">
          {navLinks.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-4xl font-black tracking-tighter transition-all duration-300 ${
                pathname === item.href
                  ? "text-primary scale-110"
                  : "text-white hover:text-primary"
              } ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.name}
            </Link>
          ))}

          <div
            className={`flex flex-col gap-4 w-64 pt-8 transition-all duration-500 delay-300 ${
              isOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full bg-white/10 border border-white/20 text-white h-14 font-black text-lg flex items-center justify-center"
            >
              LOGIN
            </Link>
            <Link
              href="/join"
              onClick={() => setIsOpen(false)}
              className="w-full bg-primary text-black h-14 font-black text-lg flex items-center justify-center"
            >
              DAFTAR SEKARANG
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest">
            YUDIS GYM — PREMIUM FITNESS CENTER
          </p>
        </div>
      </div>
    </>
  );
}
