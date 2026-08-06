/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, Plus, Edit2, Trash2, X, Calendar, Clock, User, Save, Users, Phone } from "lucide-react";
import { toast } from "sonner";

type ClassData = {
  id: string;
  name: string;
  description: string | null;
  trainer_id: string | null;
  schedule_time: string;
  duration_minutes: number;
  capacity: number;
  is_active: boolean;
  trainer: { full_name: string } | null;
  _count: { bookings: number };
  participants: Participant[];
};

type Participant = {
  id: string;
  full_name: string;
  phone: string | null;
  membership_type: string;
  booked_at: string;
};

type TrainerData = {
  id: string;
  full_name: string;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  trainer_id: "",
  schedule_date: "",
  schedule_time: "",
  duration_minutes: 60,
  capacity: 10,
  is_active: true,
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewParticipantsClass, setViewParticipantsClass] = useState<ClassData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get Classes
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select(`
          *,
          trainer:trainer_id(full_name)
        `)
        .order("schedule_time", { ascending: false });

      if (classesError) throw classesError;

      // Get bookings with member details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("class_bookings")
        .select(`
          class_id,
          created_at,
          members (
            id,
            full_name,
            phone,
            membership_type
          )
        `)
        .eq("status", "Booked");

      if (bookingsError) throw bookingsError;

      const classParticipantsMap: Record<string, Participant[]> = {};
      
      bookingsData.forEach((b: any) => {
        if (!classParticipantsMap[b.class_id]) {
          classParticipantsMap[b.class_id] = [];
        }
        if (b.members) {
          classParticipantsMap[b.class_id].push({
            id: b.members.id,
            full_name: b.members.full_name,
            phone: b.members.phone,
            membership_type: b.members.membership_type,
            booked_at: b.created_at
          });
        }
      });

      const processed = classesData.map((c: any) => ({
        ...c,
        _count: { bookings: classParticipantsMap[c.id]?.length || 0 },
        participants: classParticipantsMap[c.id] || []
      }));

      setClasses(processed);

      // Get Trainers
      const { data: trainersData, error: trainersError } = await supabase
        .from("trainers")
        .select("id, full_name")
        .eq("is_active", true);

      if (trainersError) throw trainersError;
      setTrainers(trainersData);

    } catch (error: any) {
      toast.error("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  const handleOpenModal = (cls?: ClassData) => {
    if (cls) {
      const dateObj = new Date(cls.schedule_time);
      const date = dateObj.toLocaleDateString('en-CA'); 
      const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      setForm({
        name: cls.name,
        description: cls.description || "",
        trainer_id: cls.trainer_id || "",
        schedule_date: date,
        schedule_time: time,
        duration_minutes: cls.duration_minutes,
        capacity: cls.capacity,
        is_active: cls.is_active,
      });
      setEditingId(cls.id);
    } else {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.schedule_date || !form.schedule_time || !form.capacity) {
      toast.error("Mohon isi field yang wajib");
      return;
    }

    setSubmitting(true);
    try {
      const combinedDateTime = new Date(`${form.schedule_date}T${form.schedule_time}:00`);
      
      const payload = {
        name: form.name,
        description: form.description || null,
        trainer_id: form.trainer_id || null,
        schedule_time: combinedDateTime.toISOString(),
        duration_minutes: form.duration_minutes,
        capacity: form.capacity,
        is_active: form.is_active
      };

      if (editingId) {
        const { error } = await supabase
          .from("classes")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Kelas berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("classes")
          .insert(payload);
        if (error) throw error;
        toast.success("Kelas berhasil ditambahkan");
      }
      
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan kelas");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini? Semua data booking member akan ikut terhapus.")) return;

    try {
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Kelas berhasil dihapus");
      fetchData();
    } catch (error: any) {
      toast.error("Gagal menghapus kelas");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Jadwal Kelas</h1>
          <p className="text-gray-400 text-sm mt-1">Kelola jadwal dan booking kelas member</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-black font-black text-sm px-4 py-2 hover:bg-primary/90 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kelas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls) => {
          const isFull = cls._count.bookings >= cls.capacity;
          const date = new Date(cls.schedule_time);

          return (
            <div key={cls.id} className={`bg-[#111111] border ${!cls.is_active ? 'border-red-500/30 opacity-75' : 'border-white/10'} p-6 flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-lg text-white">{cls.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(cls)} className="p-1.5 text-gray-400 hover:text-white transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cls.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{date.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{date.toLocaleTimeString("id-ID", { hour: '2-digit', minute:'2-digit' })} ({cls.duration_minutes} Menit)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{cls.trainer?.full_name || "Tanpa Trainer"}</span>
                </div>
              </div>

              <div className={`p-4 border flex items-center justify-between ${isFull ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/5 border-primary/20'}`}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Terisi</p>
                  <p className={`text-lg font-black ${isFull ? 'text-red-400' : 'text-primary'}`}>
                    {cls._count.bookings} / {cls.capacity}
                  </p>
                </div>
                <button
                  onClick={() => setViewParticipantsClass(cls)}
                  className="bg-white/10 hover:bg-white/20 transition-colors p-2 text-white flex items-center gap-2 text-sm font-bold border border-white/10"
                >
                  <Users className="w-4 h-4" />
                  Peserta
                </button>
              </div>
            </div>
          );
        })}
        
        {classes.length === 0 && (
          <div className="col-span-full text-center py-12 border border-white/10 bg-[#111111]">
            <p className="text-gray-400">Belum ada kelas. Klik &quot;Tambah Kelas&quot; untuk membuat baru.</p>
          </div>
        )}
      </div>

      {/* Participants Modal */}
      {viewParticipantsClass && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-black text-white">Peserta {viewParticipantsClass.name}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(viewParticipantsClass.schedule_time).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} - 
                  {new Date(viewParticipantsClass.schedule_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button onClick={() => setViewParticipantsClass(null)} className="text-gray-400 hover:text-white transition-colors p-1 bg-white/5 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto max-h-[60vh]">
              {viewParticipantsClass.participants.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  Belum ada member yang mendaftar di kelas ini.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-white/5 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">NAMA MEMBER</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">KONTAK</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">WAKTU DAFTAR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {viewParticipantsClass.participants.map((p, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-sm">{p.full_name}</p>
                          <span className="text-xs font-bold px-2 py-0.5 mt-1 inline-block bg-primary/10 text-primary border border-primary/20">
                            {p.membership_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone className="w-3 h-3 text-gray-500" />
                            {p.phone || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(p.booked_at).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <p className="text-gray-400 text-sm">
                Total terisi: <strong className="text-white">{viewParticipantsClass._count.bookings}</strong> dari <strong className="text-white">{viewParticipantsClass.capacity}</strong> kuota
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-black text-white">
                {editingId ? "Edit Kelas" : "Tambah Kelas Baru"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  placeholder="Misal: Yoga Dasar"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 h-24 resize-none"
                  placeholder="Deskripsi kelas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={form.schedule_date}
                    onChange={(e) => setForm({ ...form, schedule_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Jam *</label>
                  <input
                    type="time"
                    required
                    value={form.schedule_time}
                    onChange={(e) => setForm({ ...form, schedule_time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Durasi (Menit)</label>
                  <input
                    type="number"
                    min="15"
                    required
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Kapasitas (Orang) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Trainer</label>
                <select
                  value={form.trainer_id}
                  onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                >
                  <option value="">-- Pilih Trainer --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">Kelas Aktif (Bisa dibooking member)</label>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-white/5 text-white border border-white/10 py-3 font-bold text-sm hover:bg-white/10 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-black font-black text-sm py-3 flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Menyimpan..." : "Simpan Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
