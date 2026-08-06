"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Dumbbell,
  FileText,
  CalendarCheck,
  ScanLine
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session) {
        // Cek apakah akun ini terdaftar di tabel admins
        const { data: adminUser } = await supabase
          .from("admins")
          .select("id")
          .eq("email", session.user.email)
          .maybeSingle();

        if (!adminUser) {
          // Jika tidak ada di tabel admins, berarti dia member biasa (atau penyusup)!
          router.push("/member/dashboard");
          return;
        }
        
        setUser(session.user);
      }
      setCheckingRole(false);
    };
    getUser();
  }, [supabase, router]);

  // Don't render content while checking role to prevent layout flashing
  if (checkingRole && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Scanner QR", href: "/admin/scanner", icon: ScanLine },
    { name: "Kelola Member", href: "/admin/members", icon: Users },
    { name: "Jadwal Kelas", href: "/admin/classes", icon: CalendarCheck },
    { name: "Kelola Trainer", href: "/admin/trainers", icon: UserSquare2 },
    { name: "Artikel / Blog", href: "/admin/articles", icon: FileText },
    { name: "Pengaturan Website", href: "/admin/pengaturan", icon: Settings },
  ];

  // Don't show layout on login page
  if (pathname === "/admin/login") return <>{children}</>;

  const getPageTitle = () => {
    const current = menuItems.find((item) => pathname.startsWith(item.href));
    return current ? current.name : "Admin Panel";
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "bg-[#111111] text-white transition-all duration-300 ease-in-out flex flex-col border-r border-white/5",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="p-1.5 bg-primary/20 border border-primary/30 shrink-0">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-black text-xl tracking-tight transition-all duration-300">
              DE GYM <span className="text-primary">BALI</span>
            </span>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-8 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 py-3 px-4 transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-black font-black"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive ? "text-black" : "text-gray-400 group-hover:text-white"
                  )}
                />
                {isSidebarOpen && (
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                )}
                {/* Tooltip when collapsed */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-primary text-black text-xs font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full py-3 px-4 text-red-400 hover:text-white hover:bg-red-500/20 transition-all font-bold group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#111111] border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <h1 className="text-xl font-black text-white tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                Logged in as
              </p>
              <p className="text-sm font-black text-white">{user?.email || "Admin"}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Dynamic Content Scrollable */}
        <main className="flex-grow overflow-y-auto p-8 lg:p-10 no-scrollbar bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
