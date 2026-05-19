"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  FileText,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author_name: string;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

const CATEGORIES = ["Tips Latihan", "Nutrisi", "Recovery", "Yoga", "Tips Gym", "Motivasi", "Lainnya"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "Tips Latihan",
  excerpt: "",
  content: "",
  cover_image_url: "",
  author_name: "Admin DE GYM BALI",
  read_time_minutes: 5,
  is_published: false,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Tips Latihan": "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  "Nutrisi": "bg-green-500/10 text-green-400 border border-green-500/20",
  "Recovery": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "Yoga": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  "Tips Gym": "bg-primary/10 text-primary border border-primary/20",
  "Motivasi": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "Lainnya": "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClient();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setArticles(data || []);
    else toast.error("Gagal memuat artikel");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title,
      slug: a.slug,
      category: a.category,
      excerpt: a.excerpt || "",
      content: a.content || "",
      cover_image_url: a.cover_image_url || "",
      author_name: a.author_name,
      read_time_minutes: a.read_time_minutes,
      is_published: a.is_published,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      category: form.category,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image_url: form.cover_image_url || null,
      author_name: form.author_name,
      read_time_minutes: Number(form.read_time_minutes),
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) toast.error("Gagal memperbarui artikel: " + error.message);
      else { toast.success("Artikel berhasil diperbarui!"); setShowModal(false); fetchArticles(); }
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) toast.error("Gagal menyimpan artikel: " + error.message);
      else { toast.success("Artikel berhasil ditambahkan!"); setShowModal(false); fetchArticles(); }
    }
    setSaving(false);
  };

  const handleTogglePublish = async (a: Article) => {
    const { error } = await supabase
      .from("articles")
      .update({ is_published: !a.is_published, published_at: !a.is_published ? new Date().toISOString() : null })
      .eq("id", a.id);
    if (error) toast.error("Gagal mengubah status");
    else {
      toast.success(a.is_published ? "Artikel disembunyikan" : "Artikel dipublish!");
      fetchArticles();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    setDeleting(id);
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus artikel");
    else { toast.success("Artikel berhasil dihapus"); fetchArticles(); }
    setDeleting(null);
  };

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchPub =
      filterPublished === "all" ||
      (filterPublished === "published" && a.is_published) ||
      (filterPublished === "draft" && !a.is_published);
    return matchSearch && matchPub;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 border border-green-500/20">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Artikel / Blog</h1>
            <p className="text-gray-500 text-sm">Kelola konten artikel dan tips fitness</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-primary text-black font-black text-sm tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          TULIS ARTIKEL
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-white/5 p-5">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total Artikel</p>
          <p className="text-3xl font-black text-white">{articles.length}</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Dipublish</p>
          <p className="text-3xl font-black text-green-400">{articles.filter((a) => a.is_published).length}</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Draft</p>
          <p className="text-3xl font-black text-gray-400">{articles.filter((a) => !a.is_published).length}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-white/10 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
          />
        </div>
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value)}
          className="bg-[#111111] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
        >
          <option value="all">Semua Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FileText className="w-12 h-12 text-gray-700" />
            <p className="text-gray-500 font-medium">
              {search ? "Tidak ada artikel yang sesuai." : "Belum ada artikel."}
            </p>
            {!search && (
              <button onClick={openAdd} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Tulis Artikel Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">JUDUL</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">KATEGORI</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">PENULIS</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">TGL BUAT</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-white line-clamp-1">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">/{a.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${CATEGORY_COLORS[a.category] || CATEGORY_COLORS["Lainnya"]}`}>
                        {a.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{a.author_name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tracking-widest px-2.5 py-1 ${a.is_published ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-gray-500/10 text-gray-500 border border-gray-500/20"}`}>
                        {a.is_published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleTogglePublish(a)}
                          className={`p-2 transition-colors ${a.is_published ? "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10" : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"}`}
                          title={a.is_published ? "Sembunyikan" : "Publish"}
                        >
                          {a.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(a)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.title)}
                          disabled={deleting === a.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus"
                        >
                          {deleting === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
          <div className="bg-[#111111] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-black text-white">
                {editing ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Judul Artikel *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  placeholder="Judul artikel yang menarik"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Slug URL</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="judul-artikel-yang-menarik"
                  className="w-full bg-white/5 border border-white/10 text-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-primary/50 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Estimasi Baca (Menit)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.read_time_minutes}
                    onChange={(e) => setForm({ ...form, read_time_minutes: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Penulis</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">URL Gambar Cover</label>
                  <input
                    type="url"
                    value={form.cover_image_url}
                    onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Ringkasan (Excerpt)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel (tampil di preview)"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Konten Artikel</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis isi artikel di sini..."
                  rows={10}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-y"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="is_published" className="text-sm font-bold text-gray-300">
                  Publish sekarang (tampil di halaman publik)
                </label>
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
                  {editing ? "SIMPAN PERUBAHAN" : "SIMPAN ARTIKEL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
