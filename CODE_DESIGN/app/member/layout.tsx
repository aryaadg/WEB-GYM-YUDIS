import { AuthGuard } from "@/components/admin/auth-guard";
import { Toaster } from "@/components/ui/sonner";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="font-bold text-xl">Member Portal</h1>
            <button className="text-sm text-muted-foreground hover:text-primary">Sign Out</button>
          </div>
        </header>
        <main className="container mx-auto p-8">
          {children}
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthGuard>
  );
}