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
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

type Member = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  gender: "Pria" | "Wanita";
  membership_type: "Basic" | "Premium" | "Elite";
  membership_start: string | null;
  membership_end: string | null;
  status: "Aktif" | "Tidak Aktif" | "Expired";
  notes: string | null;
  created_at: string;
};

const EMPTY_FORM = {
  full_name: "",
  email: "",
  phone: "",
  gender: "Pria" as const,
  membership_type: "Basic" as const,
  membership_start: "",
  membership_end: "",
  status: "Aktif" as const,
  notes: "",
};

const STATUS_STYLES: Record<string, string> = {
  Aktif: "bg-green-500/10 text-green-400 border border-green-500/20",
  "Tidak Aktif": "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  Expired: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const TYPE_STYLES: Record<string, string> = {
  Basic: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Premium: "bg-primary/10 text-primary border border-primary/20",
  Elite: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setMembers(data || []);
    else toast.error("Gagal memuat data member");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({
      full_name: m.full_name,
      email: m.email || "",
      phone: m.phone || "",
      gender: m.gender,
      membership_type: m.membership_type,
      membership_start: m.membership_start || "",
      membership_end: m.membership_end || "",
      status: m.status,
      notes: m.notes || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      full_name: form.full_name,
      email: form.email || null,
      phone: form.phone || null,
      gender: form.gender,
      membership_type: form.membership_type,
      membership_start: form.membership_start || null,
      membership_end: form.membership_end || null,
      status: form.status,
      notes: form.notes || null,
    };

    if (editing) {
      const { error } = await supabase.from("members").update(payload).eq("id", editing.id);
      if (error) toast.error("Gagal memperbarui member");
      else { toast.success("Member berhasil diperbarui!"); setShowModal(false); fetchMembers(); }
    } else {
      const { error } = await supabase.from("members").insert(payload);
      if (error) toast.error("Gagal menambah member: " + error.message);
      else { toast.success("Member berhasil ditambahkan!"); setShowModal(false); fetchMembers(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus member "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(id);
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus member");
    else { toast.success("Member berhasil dihapus"); fetchMembers(); }
    setDeleting(null);
  };

  const filtered = members.filter((m) => {
    const matchSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.phone || "").includes(search);
    const matchStatus = filterStatus === "all" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: members.length,
    aktif: members.filter((m) => m.status === "Aktif").length,
    premium: members.filter((m) => m.membership_type === "Premium" || m.membership_type === "Elite").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 border border-primary/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Kelola Member</h1>
            <p className="text-gray-500 text-sm">Manajemen data seluruh member YUDIS GYM</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-black font-black text-sm tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          TAMBAH MEMBER
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Member", value: stats.total, color: "text-white" },
          { label: "Member Aktif", value: stats.aktif, color: "text-green-400" },
          { label: "Premium & Elite", value: stats.premium, color: "text-primary" },
        ].map((s, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 p-5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari nama, email, atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Tidak Aktif">Tidak Aktif</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users className="w-12 h-12 text-gray-700" />
            <p className="text-gray-500 font-medium">
              {search || filterStatus !== "all" ? "Tidak ada member yang sesuai filter." : "Belum ada data member."}
            </p>
            {!search && filterStatus === "all" && (
              <button onClick={openAdd} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Tambah Member Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">NAMA</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">KONTAK</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">PAKET</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">MASA AKTIF</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">{m.full_name}</p>
                        <p className="text-xs text-gray-500">{m.gender}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300">{m.email || "-"}</p>
                      <p className="text-xs text-gray-500">{m.phone || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${TYPE_STYLES[m.membership_type]}`}>
                        {m.membership_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {m.membership_end
                        ? new Date(m.membership_end).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${STATUS_STYLES[m.status]}`}>
                        {m.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(m)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.full_name)}
                          disabled={deleting === m.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          {deleting === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-black text-white">
                {editing ? "Edit Member" : "Tambah Member Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Nama lengkap member"
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
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as "Pria" | "Wanita" })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Paket Membership</label>
                  <select
                    value={form.membership_type}
                    onChange={(e) => setForm({ ...form, membership_type: e.target.value as "Basic" | "Premium" | "Elite" })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="Basic">Basic — Rp 299.000/bln</option>
                    <option value="Premium">Premium — Rp 499.000/bln</option>
                    <option value="Elite">Elite — Rp 899.000/bln</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Mulai Membership</label>
                  <input
                    type="date"
                    value={form.membership_start}
                    onChange={(e) => setForm({ ...form, membership_start: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Berakhir Membership</label>
                  <input
                    type="date"
                    value={form.membership_end}
                    onChange={(e) => setForm({ ...form, membership_end: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Aktif" | "Tidak Aktif" | "Expired" })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Catatan</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Catatan tambahan tentang member (opsional)"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                  />
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
                  className="flex-1 bg-primary text-black font-black text-sm py-3 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editing ? "SIMPAN PERUBAHAN" : "TAMBAH MEMBER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
