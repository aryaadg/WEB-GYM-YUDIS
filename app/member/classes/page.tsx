"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, CheckCircle2, Loader2, ArrowLeft, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ClassData = {
  id: string;
  name: string;
  description: string;
  schedule_time: string;
  duration_minutes: number;
  capacity: number;
  is_active: boolean;
  trainer: {
    full_name: string;
  } | null;
  _count: {
    bookings: number;
  };
};

type BookingData = {
  class_id: string;
  status: string;
};

export default function MemberClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [myBookings, setMyBookings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const fetchData = async () => {
    try {
      // Cek session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/member/login");
        return;
      }

      // Ambil id member
      const { data: memberData } = await supabase
        .from("members")
        .select("id, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (!memberData) {
        toast.error("Data member tidak ditemukan");
        router.push("/member/dashboard");
        return;
      }

      setMemberId(memberData.id);

      if (memberData.status !== "Aktif") {
        toast.error("Membership Anda belum aktif. Selesaikan pembayaran di gym.");
        router.push("/member/dashboard");
        return;
      }

      // Ambil jadwal kelas yang aktif & akan datang
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select(`
          *,
          trainer:trainer_id (full_name)
        `)
        .eq("is_active", true)
        .gte("schedule_time", new Date().toISOString())
        .order("schedule_time", { ascending: true });

      if (classesError) throw classesError;

      // Hitung jumlah booking untuk masing-masing kelas secara manual
      const { data: allBookings, error: allBookingsError } = await supabase
        .from("class_bookings")
        .select("class_id")
        .eq("status", "Booked");

      if (allBookingsError) throw allBookingsError;

      const bookingsCountMap = allBookings.reduce((acc: any, curr) => {
        acc[curr.class_id] = (acc[curr.class_id] || 0) + 1;
        return acc;
      }, {});

      const processedClasses = classesData.map((cls: any) => ({
        ...cls,
        _count: { bookings: bookingsCountMap[cls.id] || 0 }
      }));
      
      setClasses(processedClasses);

      // Ambil booking milik member ini
      const { data: myBookingsData, error: myBookingsError } = await supabase
        .from("class_bookings")
        .select("class_id, status")
        .eq("member_id", memberData.id);

      if (myBookingsError) throw myBookingsError;

      const myBookingsMap: Record<string, string> = {};
      myBookingsData.forEach(b => {
        myBookingsMap[b.class_id] = b.status;
      });
      setMyBookings(myBookingsMap);

    } catch (error: any) {
      console.error(error);
      toast.error("Gagal memuat jadwal kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase, router]);

  const handleBook = async (classId: string) => {
    if (!memberId) return;
    setActionLoading(classId);

    try {
      const { error } = await supabase
        .from("class_bookings")
        .insert({
          class_id: classId,
          member_id: memberId,
          status: "Booked"
        });

      if (error) {
        if (error.code === '23505') {
           throw new Error("Anda sudah membooking kelas ini.");
        }
        throw error;
      }
      
      toast.success("Berhasil booking kelas!");
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Gagal booking kelas");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (classId: string) => {
    if (!memberId) return;
    setActionLoading(classId);

    try {
      const { error } = await supabase
        .from("class_bookings")
        .update({ status: "Cancelled" })
        .eq("class_id", classId)
        .eq("member_id", memberId);

      if (error) throw error;
      
      toast.success("Booking dibatalkan");
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error("Gagal membatalkan booking");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/member/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <p className="font-black text-white text-sm uppercase tracking-widest">Jadwal Kelas</p>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Booking Kelas</h1>
          <p className="text-gray-400 text-sm mt-2">
            Amankan slot Anda untuk kelas-kelas eksklusif di DE GYM BALI. Kuota sangat terbatas!
          </p>
        </div>

        {classes.length === 0 ? (
          <div className="bg-[#111111] border border-white/10 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Belum ada jadwal kelas</h3>
            <p className="text-gray-400">Jadwal kelas akan segera diperbarui oleh admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => {
              const date = new Date(cls.schedule_time);
              const isFull = cls._count.bookings >= cls.capacity;
              const myStatus = myBookings[cls.id];
              const isBooked = myStatus === "Booked";
              
              return (
                <div key={cls.id} className={`bg-[#111111] border p-6 flex flex-col ${isBooked ? 'border-primary/50' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-white">{cls.name}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                        <User className="w-4 h-4 text-primary" />
                        <span>Trainer: {cls.trainer?.full_name || "Instruktur Gym"}</span>
                      </div>
                    </div>
                    {isBooked && (
                      <span className="bg-primary/20 text-primary text-xs font-black px-2 py-1 rounded">TERDAFTAR</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 flex-grow">{cls.description || "Tidak ada deskripsi."}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{date.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{date.toLocaleTimeString("id-ID", { hour: '2-digit', minute:'2-digit' })} ({cls.duration_minutes} Menit)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Info className="w-4 h-4 text-gray-500" />
                      <span>Sisa Kuota: <strong className={isFull ? "text-red-400" : "text-green-400"}>{cls.capacity - cls._count.bookings}</strong> / {cls.capacity}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    {isBooked ? (
                      <button
                        onClick={() => handleCancel(cls.id)}
                        disabled={actionLoading === cls.id}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-sm transition-colors"
                      >
                        {actionLoading === cls.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        BATALKAN BOOKING
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBook(cls.id)}
                        disabled={isFull || actionLoading === cls.id}
                        className={`w-full flex items-center justify-center gap-2 py-3 font-bold text-sm transition-colors ${
                          isFull 
                            ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        {actionLoading === cls.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {isFull ? "KUOTA PENUH" : "JOIN KELAS"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
