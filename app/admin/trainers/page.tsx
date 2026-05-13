"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  UserSquare2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type Trainer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  specialty: string;
  experience_years: number;
  certifications: string[] | null;
  bio: string | null;
  photo_url: string | null;
  instagram_url: string | null;
  is_active: boolean;
  created_at: string;
};

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  specialty: "",
  experience_years: 1,
  certifications: "",
  bio: "",
  photo_url: "",
  instagram_url: "",
  is_active: true,
};

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTrainers(data || []);
    else toast.error("Gagal memuat data trainer");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (t: Trainer) => {
    setEditing(t);
    setForm({
      full_name: t.full_name,
      email: t.email || "",
      phone: t.phone || "",
      specialty: t.specialty,
      experience_years: t.experience_years,
      certifications: (t.certifications || []).join(", "),
      bio: t.bio || "",
      photo_url: t.photo_url || "",
      instagram_url: t.instagram_url || "",
      is_active: t.is_active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const certsArray = form.certifications
      ? form.certifications.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      full_name: form.full_name,
      email: form.email || null,
      phone: form.phone || null,
      specialty: form.specialty,
      experience_years: Number(form.experience_years),
      certifications: certsArray.length > 0 ? certsArray : null,
      bio: form.bio || null,
      photo_url: form.photo_url || null,
      instagram_url: form.instagram_url || null,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase.from("trainers").update(payload).eq("id", editing.id);
      if (error) toast.error("Gagal memperbarui trainer");
      else { toast.success("Trainer berhasil diperbarui!"); setShowModal(false); fetchTrainers(); }
    } else {
      const { error } = await supabase.from("trainers").insert(payload);
      if (error) toast.error("Gagal menambah trainer: " + error.message);
      else { toast.success("Trainer berhasil ditambahkan!"); setShowModal(false); fetchTrainers(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus trainer "${name}"?`)) return;
    setDeleting(id);
    const { error } = await supabase.from("trainers").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus trainer");
    else { toast.success("Trainer berhasil dihapus"); fetchTrainers(); }
    setDeleting(null);
  };

  const filtered = trainers.filter(
    (t) =>
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20">
            <UserSquare2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Kelola Trainer</h1>
            <p className="text-gray-500 text-sm">Manajemen data trainer & pelatih YUDIS GYM</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-black font-black text-sm tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          TAMBAH TRAINER
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/5 p-5">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total Trainer</p>
          <p className="text-3xl font-black text-white">{trainers.length}</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Trainer Aktif</p>
          <p className="text-3xl font-black text-green-400">{trainers.filter((t) => t.is_active).length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Cari nama atau spesialisasi trainer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111111] border border-white/10 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
        />
      </div>

      {/* Grid Cards */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-[#111111] border border-white/5">
          <UserSquare2 className="w-12 h-12 text-gray-700" />
          <p className="text-gray-500 font-medium">
            {search ? "Tidak ada trainer yang sesuai." : "Belum ada data trainer."}
          </p>
          {!search && (
            <button onClick={openAdd} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Tambah Trainer Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div key={t.id} className="bg-[#111111] border border-white/10 group hover:border-primary/30 transition-all">
              {/* Photo */}
              <div className="relative aspect-square overflow-hidden bg-white/5">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover object-top opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserSquare2 className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                {/* Active badge */}
                <div className={`absolute top-3 right-3 text-xs font-black tracking-widest px-2.5 py-1 ${t.is_active ? "bg-green-500 text-white" : "bg-gray-600 text-gray-200"}`}>
                  {t.is_active ? "AKTIF" : "NON-AKTIF"}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-black text-white text-lg">{t.full_name}</h3>
                  <p className="text-primary text-xs font-black tracking-widest">{t.specialty}</p>
                </div>
                <p className="text-xs text-gray-500">{t.experience_years} tahun pengalaman</p>
                {t.bio && <p className="text-xs text-gray-400 line-clamp-2">{t.bio}</p>}
                {t.certifications && t.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.certifications.slice(0, 2).map((c, i) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5">{c}</span>
                    ))}
                    {t.certifications.length > 2 && (
                      <span className="text-xs text-gray-600">+{t.certifications.length - 2} lagi</span>
                    )}
                  </div>
                )}
                <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 py-2 text-xs font-black text-gray-400 border border-white/10 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" /> EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.full_name)}
                    disabled={deleting === t.id}
                    className="flex-1 py-2 text-xs font-black text-gray-400 border border-white/10 hover:border-red-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                  >
                    {deleting === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    HAPUS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-black text-white">
                {editing ? "Edit Trainer" : "Tambah Trainer Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Nama lengkap trainer"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">No. HP</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Spesialisasi *</label>
                  <input
                    type="text"
                    required
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="cth: HIIT & Cardio"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pengalaman (Tahun)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                    Sertifikasi (pisah dengan koma)
                  </label>
                  <input
                    type="text"
                    value={form.certifications}
                    onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                    placeholder="cth: NSCA-CSCS, CPT ACE, Nutrition Coach"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Bio / Deskripsi</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Deskripsi singkat tentang trainer"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">URL Foto</label>
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/10">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-bold text-gray-300">
                    Trainer Aktif (tampil di halaman publik)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 text-white border border-white/10 py-3 font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-black font-black text-sm py-3 flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editing ? "SIMPAN PERUBAHAN" : "TAMBAH TRAINER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
