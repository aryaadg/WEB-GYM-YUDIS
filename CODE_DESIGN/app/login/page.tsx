"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Lakukan Autentikasi
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message || "Email atau password salah");
        setLoading(false);
        return;
      }

      const user = authData.user;
      console.log("LOGIN BERHASIL:", user.id);
      toast.success("Berhasil masuk!");

      // 2. Tentukan rute tujuan (Default ke member)
      let targetRoute = "/member";

      try {
        // Coba ambil profil untuk cek role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          targetRoute = "/admin/dashboard";
        } else if (profile?.role === "instructor") {
          targetRoute = "/instructor";
        }
        
        console.log("ROLE DITEMUKAN:", profile?.role || "member");
      } catch (err) {
        console.log("Gagal ambil profil, menggunakan rute default member");
      }

      // 3. PENGALIHAN PAKSA (Harus di luar try-catch profil agar selalu jalan)
      console.log("MENGALIHKAN KE:", targetRoute);
      window.location.href = targetRoute;

    } catch (error: any) {
      console.error("Kesalahan sistem:", error);
      toast.error("Terjadi kesalahan sistem. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>
      
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Dumbbell className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
          <CardDescription>Masukkan email dan password Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@degym.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
                </span>
              ) : "Masuk Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}