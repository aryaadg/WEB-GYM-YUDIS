"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { createClient } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Mail, UserSquare2 } from "lucide-react";

export default function PublicCoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCoaches = async () => {
      const { data } = await supabase
        .from("coaches")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });
      setCoaches(data || []);
      setLoading(false);
    };
    fetchCoaches();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl font-bold">Our Expert Coaches</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the professionals dedicated to helping you achieve your fitness goals.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading coaches...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {coaches.map((coach) => (
                <Card key={coach.id} className="group overflow-hidden border-none shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                      {coach.photo_url ? (
                        <img 
                          src={coach.photo_url} 
                          alt={coach.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <UserSquare2 className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <div className="flex gap-4">
                          {coach.instagram && (
                            <a href={`https://instagram.com/${coach.instagram.replace('@', '')}`} target="_blank" className="text-white hover:text-primary">
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {coach.email && (
                            <a href={`mailto:${coach.email}`} className="text-white hover:text-primary">
                              <Mail className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{coach.name}</h3>
                      <p className="text-primary font-medium text-sm mb-2">{coach.specialization}</p>
                      <p className="text-muted-foreground text-sm line-clamp-2 px-4">
                        {coach.bio || "Professional fitness instructor dedicated to your growth."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}