import Link from "next/link";
import { Dumbbell, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter text-white">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span>DE GYM <span className="text-primary">PLATINUM</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              The ultimate fitness destination in Kuta, Bali. Elevate your lifestyle with world-class equipment and expert coaching in a premium environment.
            </p>
            <div className="flex gap-5">
              <Instagram className="h-5 w-5 text-gray-400 hover:text-primary transition-colors cursor-pointer" />
              <Facebook className="h-5 w-5 text-gray-400 hover:text-primary transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6">QUICK LINKS</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary transition-colors">ABOUT US</Link></li>
              <li><Link href="/classes" className="hover:text-primary transition-colors">CLASSES</Link></li>
              <li><Link href="/coaches" className="hover:text-primary transition-colors">COACHES</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">BLOG</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary transition-colors">ADMIN LOGIN</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6">CONTACT US</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Jl. Sunset Road No. 1, Kuta, Bali, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@degymplatinum.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-xs tracking-widest text-white mb-6">OPENING HOURS</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>MON - FRI</span>
                <span className="text-white font-bold">06:00 - 22:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>SATURDAY</span>
                <span className="text-white font-bold">07:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>SUNDAY</span>
                <span className="text-white font-bold">08:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-xs font-bold tracking-widest text-gray-600">
            © {new Date().getFullYear()} DE GYM PLATINUM. ALL RIGHTS RESERVED.
          </p>
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
}