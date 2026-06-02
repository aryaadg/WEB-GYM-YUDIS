"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Dumbbell, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function MemberLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
    } else {
      router.push("/member/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111111] border border-white/10 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-primary/10 border border-primary/20 mb-5">
              <Dumbbell className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              DE GYM <span className="text-primary">BALI</span>
            </h1>
            <p className="text-gray-500 font-bold tracking-widest text-xs mt-2">
              MEMBER PORTAL LOGIN
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  id="member-email"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all font-medium"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  id="member-password"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/50 py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-black py-4 font-black text-sm tracking-widest transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "MASUK KE PORTAL MEMBER"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-600 text-xs">
              Belum punya akun?{" "}
              <Link href="/join" className="text-primary hover:underline font-bold">
                Daftar Membership
              </Link>
            </p>
            <p className="text-gray-700 text-xs">
              <Link href="/" className="hover:text-gray-500 transition-colors">
                ← Kembali ke Beranda
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
