"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'admin' | 'member' }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (pathname !== "/login" && !pathname.startsWith("/admin/login")) {
          router.push("/login");
        }
        setLoading(false);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role !== requiredRole) {
          // Redirect to their respective dashboard if they are in the wrong place
          if (profile?.role === 'admin') router.push("/admin/dashboard");
          else if (profile?.role === 'member') router.push("/member");
          else router.push("/");
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname, supabase, requiredRole]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}