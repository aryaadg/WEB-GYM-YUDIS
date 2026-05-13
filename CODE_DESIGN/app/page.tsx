"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Calendar, ArrowRight, Play, MapPin, Instagram } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [classes, setClasses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase not configured");
        return;
      }
      try {
        const { data } = await supabase
          .from("classes")
          .select("*, coaches(name)")
          .eq("is_active", true)
          .limit(3);
        setClasses(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white scroll-smooth">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
              alt="Gym Hero" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          </div>
          
          <div className="container relative z-10 px-6 md:px-12">
            <div className="max-w-4xl space-y-6">
              <Badge className="bg-primary text-black font-bold tracking-widest rounded-none px-4 py-1">
                PREMIUM FITNESS BALI
              </Badge>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9]">
                UNLEASH YOUR <br />
                <span className="text-primary">POTENTIAL</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-xl font-medium">
                Experience the most elite fitness destination in Kuta, Bali. World-class equipment, expert coaching, and a community that drives results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg font-black px-10 h-16 rounded-none" asChild>
                  <Link href="/join">JOIN THE CLUB</Link>
                </Button>
                <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg font-black px-10 h-16 rounded-none" asChild>
                  <Link href="/classes">EXPLORE CLASSES</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-primary rounded-full" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-white/10 bg-black">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "SQUARE METERS", value: "2000+" },
                { label: "ELITE COACHES", value: "25+" },
                { label: "WEEKLY CLASSES", value: "50+" },
                { label: "MODERN MACHINES", value: "150+" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl md:text-6xl font-black text-primary">{stat.value}</div>
                  <div className="text-xs font-bold tracking-widest text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[20rem] font-black text-white/[0.02] leading-none select-none pointer-events-none">
            PLATINUM
          </div>
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-none overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
                    alt="Gym Interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary p-8 hidden md:flex flex-col justify-end">
                  <Dumbbell size={48} className="text-black mb-4" />
                  <h3 className="text-2xl font-black text-black leading-tight">WORLD CLASS EQUIPMENT</h3>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-primary font-black tracking-widest text-sm">WHY CHOOSE US</h2>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                    THE ULTIMATE <br /> FITNESS HUB
                  </h3>
                </div>
                <p className="text-xl text-gray-400 leading-relaxed">
                  DE GYM Platinum is not just a gym; it's a lifestyle destination. We've curated the finest fitness experience in Bali, combining luxury amenities with hardcore training values.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  {[
                    { title: "24/7 ACCESS", desc: "Train whenever inspiration strikes." },
                    { title: "LUXURY SPA", desc: "Recover like a pro in our sauna." },
                    { title: "JUICE BAR", desc: "Fuel your body with premium nutrition." },
                    { title: "FREE PARKING", desc: "Hassle-free visits every time." },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary" />
                        <h4 className="font-black tracking-widest text-sm">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <Button className="bg-white text-black hover:bg-primary hover:text-black font-black px-10 h-14 rounded-none transition-colors" asChild>
                  <Link href="/about">LEARN MORE ABOUT US</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-32 bg-[#050505]">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-primary font-black tracking-widest text-sm">OUR LOCATIONS</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter">FIND YOUR CLUB</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { 
                  name: "DE GYM KUTA", 
                  address: "Jl. Sunset Road No. 1, Kuta, Bali",
                  image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop"
                },
                { 
                  name: "DE GYM RENON", 
                  address: "Jl. Raya Puputan No. 10, Renon, Denpasar",
                  image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                },
              ].map((loc, i) => (
                <div key={i} className="group relative aspect-video overflow-hidden cursor-pointer">
                  <img 
                    src={loc.image} 
                    alt={loc.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 space-y-2">
                    <h4 className="text-3xl font-black tracking-tighter">{loc.name}</h4>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={16} className="text-primary" />
                      {loc.address}
                    </div>
                    <Button variant="link" className="text-primary p-0 font-black tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                      VIEW DETAILS <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 relative overflow-hidden bg-primary">
          <div className="container relative z-10 px-6 mx-auto text-center space-y-10">
            <h2 className="text-6xl md:text-9xl font-black text-black tracking-tighter leading-none">
              READY TO <br /> START?
            </h2>
            <p className="text-2xl text-black/80 font-bold max-w-2xl mx-auto">
              Join the DE GYM Platinum family today and transform your life with the best in the business.
            </p>
            <Button size="lg" className="bg-black text-white hover:bg-black/90 text-xl font-black px-16 h-20 rounded-none" asChild>
              <Link href="/join">GET STARTED NOW</Link>
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-black/5 leading-none select-none pointer-events-none">
            JOIN
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}