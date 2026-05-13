"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "CLASSES", href: "/classes" },
  { name: "COACHES", href: "/coaches" },
  { name: "BLOG", href: "/blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        scrolled ? "bg-black/95 backdrop-blur-md py-3 border-b border-white/10" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span>DE GYM <span className="text-primary">PLATINUM</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-xs font-bold tracking-widest transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-white/80"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <Button className="bg-white text-black hover:bg-white/90 font-bold text-xs tracking-widest px-6 rounded-none" asChild>
                <Link href="/login">LOGIN</Link>
              </Button>
              <Button className="bg-primary text-black hover:bg-primary/90 font-bold text-xs tracking-widest px-6 rounded-none" asChild>
                <Link href="/join">JOIN NOW</Link>
              </Button>
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
      <div className={cn(
        "fixed inset-0 z-50 bg-black transition-all duration-500 ease-in-out md:hidden flex flex-col items-center justify-center",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <button 
          className="absolute top-6 right-6 text-white p-2" 
          onClick={() => setIsOpen(false)}
        >
          <X size={32} />
        </button>
        
        <div className="flex flex-col items-center space-y-8">
          {navItems.map((item, i) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-4xl font-black tracking-tighter transition-all duration-300",
                pathname === item.href ? "text-primary scale-110" : "text-white hover:text-primary",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {item.name}
            </Link>
          ))}
          
          <div className={cn(
            "flex flex-col gap-4 w-64 pt-8 transition-all duration-500 delay-300",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <Button className="w-full bg-white text-black h-14 font-black text-lg rounded-none" asChild onClick={() => setIsOpen(false)}>
              <Link href="/login">LOGIN</Link>
            </Button>
            <Button className="w-full bg-primary text-black h-14 font-black text-lg rounded-none" asChild onClick={() => setIsOpen(false)}>
              <Link href="/join">JOIN NOW</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 text-center">
          <p className="text-gray-500 text-xs font-bold tracking-widest">DE GYM PLATINUM BALI</p>
        </div>
      </div>
    </>
  );
}