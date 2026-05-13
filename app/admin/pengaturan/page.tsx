"use client"

import { useState, useEffect } from "react";
import { Save, Loader2, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsData {
  hero: { title: string; subtitle: string; cta_text: string; };
  about_short: { title: string; content: string; };
  contact: { address: string; whatsapp: string; instagram: string; };
}

export default function PengaturanPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch {
      setError("Gagal mengambil data pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: keyof SettingsData, field: string, value: string) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan.");
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  if (!settings) return <div className="flex items-center justify-center h-64 text-gray-400">Gagal memuat pengaturan.</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Pengaturan Website</h1>
          <p className="text-gray-500 font-medium">Edit konten teks utama website Anda.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-accent text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Perubahan
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 text-sm">
          <Check className="w-5 h-5" />
          <p className="font-bold">Pengaturan berhasil diperbarui!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-black text-primary border-b border-gray-50 pb-4">Bagian Hero (Halaman Utama)</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Utama</label>
            <input 
                value={settings.hero.title} 
                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sub-Judul</label>
            <textarea 
                value={settings.hero.subtitle} 
                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-medium h-32 text-primary" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Teks Tombol</label>
            <input 
                value={settings.hero.cta_text} 
                onChange={(e) => handleChange('hero', 'cta_text', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xl font-black text-primary border-b border-gray-50 pb-4">Tentang Kami (Singkat)</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Judul Section</label>
            <input 
                value={settings.about_short.title} 
                onChange={(e) => handleChange('about_short', 'title', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Isi Konten</label>
            <textarea 
                value={settings.about_short.content} 
                onChange={(e) => handleChange('about_short', 'content', e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-medium h-32 text-primary" 
            />
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 col-span-full">
          <h3 className="text-xl font-black text-primary border-b border-gray-50 pb-4">Informasi Kontak & Social Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat (Teks)</label>
                <input 
                    value={settings.contact.address} 
                    onChange={(e) => handleChange('contact', 'address', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp (Tanpa + atau Spasi)</label>
                <input 
                    value={settings.contact.whatsapp} 
                    onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
                    placeholder="Contoh: 628123456789"
                />
            </div>
            <div className="space-y-2 col-span-full">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Link Instagram</label>
                <input 
                    value={settings.contact.instagram} 
                    onChange={(e) => handleChange('contact', 'instagram', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" 
                    placeholder="https://www.instagram.com/user"
                />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
