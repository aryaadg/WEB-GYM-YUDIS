"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import {
  Save,
  Loader2,
  CheckCircle2,
  Settings,
  MapPin,
  Phone,
  Mail,
  Clock,
  Link2,
  Video,
  Globe,
  Image,
  BarChart2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

type Settings = Record<string, string>;

type Field = {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

type Section = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Field[];
};

const SECTIONS: Section[] = [
  {
    id: "info",
    label: "Informasi Gym",
    icon: Settings,
    fields: [
      { key: "gym_name", label: "Nama Gym", placeholder: "DE GYM BALI" },
      { key: "gym_tagline", label: "Tagline", placeholder: "Unleash Your Potential" },
      { key: "gym_description", label: "Deskripsi", placeholder: "Deskripsi singkat gym", multiline: true },
    ],
  },
  {
    id: "contact",
    label: "Kontak & Lokasi",
    icon: MapPin,
    fields: [
      { key: "gym_address", label: "Alamat Lengkap", placeholder: "Jl. Fitness No. 1, Jakarta Selatan", multiline: true },
      { key: "gym_whatsapp", label: "Nomor WhatsApp (tanpa +)", placeholder: "6281234567890", icon: Phone },
      { key: "gym_email", label: "Email", placeholder: "info@degymbali.com", icon: Mail },
      { key: "maps_embed_url", label: "URL Embed Google Maps", placeholder: "https://maps.google.com/maps?...", multiline: true },
    ],
  },
  {
    id: "social",
    label: "Media Sosial",
    icon: Globe,
    fields: [
      { key: "gym_instagram", label: "Instagram URL", placeholder: "https://instagram.com/degymbali", icon: Link2 },
      { key: "gym_facebook", label: "Facebook URL", placeholder: "https://facebook.com/degymbali" },
      { key: "gym_tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@degymbali" },
      { key: "gym_youtube", label: "YouTube URL", placeholder: "https://youtube.com/@degymbali", icon: Video },
    ],
  },
  {
    id: "hours",
    label: "Jam Operasional",
    icon: Clock,
    fields: [
      { key: "jam_senin_jumat", label: "Senin – Jumat", placeholder: "05:00 - 23:00" },
      { key: "jam_sabtu", label: "Sabtu", placeholder: "06:00 - 22:00" },
      { key: "jam_minggu", label: "Minggu & Hari Libur", placeholder: "07:00 - 21:00" },
    ],
  },
  {
    id: "hero",
    label: "Tampilan Hero",
    icon: Image,
    fields: [
      { key: "hero_image_url", label: "URL Gambar Background Hero", placeholder: "https://images.unsplash.com/...", multiline: true },
    ],
  },
  {
    id: "stats",
    label: "Statistik Gym",
    icon: BarChart2,
    fields: [
      { key: "stat_luas", label: "Luas Area", placeholder: "2000+" },
      { key: "stat_trainer", label: "Jumlah Trainer", placeholder: "25+" },
      { key: "stat_kelas", label: "Kelas per Minggu", placeholder: "50+" },
      { key: "stat_mesin", label: "Jumlah Mesin", placeholder: "150+" },
    ],
  },
  {
    id: "pricing",
    label: "Harga Membership",
    icon: CreditCard,
    fields: [
      { key: "membership_basic_price", label: "Harga Basic (Rp, tanpa titik)", placeholder: "299000" },
      { key: "membership_premium_price", label: "Harga Premium (Rp, tanpa titik)", placeholder: "499000" },
      { key: "membership_elite_price", label: "Harga Elite (Rp, tanpa titik)", placeholder: "899000" },
    ],
  },
];

export default function PengaturanPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("info");
  const supabase = createClient();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (!error && data) {
      const map: Settings = {};
      data.forEach((row: { key: string; value: string }) => {
        map[row.key] = row.value ?? "";
      });
      setSettings(map);
    } else {
      toast.error("Gagal memuat pengaturan");
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const currentSection = SECTIONS.find((s) => s.id === activeSection);
    if (!currentSection) return;

    const upsertPayload = currentSection.fields.map((f) => ({
      key: f.key,
      value: settings[f.key] ?? "",
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(upsertPayload, { onConflict: "key" });

    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
    } else {
      toast.success("Pengaturan berhasil disimpan!");
    }
    setSaving(false);
  };

  const currentSection = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Pengaturan Website</h1>
            <p className="text-gray-500 text-sm">Kelola seluruh konten dan informasi DE GYM BALI</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-primary text-black font-black text-sm tracking-widest px-6 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          SIMPAN
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-[#111111] border border-white/5 overflow-hidden">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-bold transition-colors border-b border-white/5 last:border-0 ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <section.icon className="w-4 h-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-[#111111] border border-white/5 p-8">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <currentSection.icon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-black text-white">{currentSection.label}</h2>
                </div>

                {currentSection.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={settings[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={settings[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
                      />
                    )}
                    <p className="text-xs text-gray-600 mt-1 font-mono">{field.key}</p>
                  </div>
                ))}

                {/* Preview khusus untuk hero image */}
                {activeSection === "hero" && settings["hero_image_url"] && (
                  <div className="mt-4">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">PREVIEW</p>
                    <div className="relative aspect-video w-full overflow-hidden border border-white/10">
                      <img
                        src={settings["hero_image_url"]}
                        alt="Hero preview"
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  </div>
                )}

                {/* Preview untuk pricing */}
                {activeSection === "pricing" && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">PREVIEW HARGA</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {["basic", "premium", "elite"].map((type) => {
                        const price = parseInt(settings[`membership_${type}_price`] || "0");
                        return (
                          <div key={type} className="p-3 border border-white/10">
                            <p className="text-xs text-gray-500 uppercase font-black">{type}</p>
                            <p className="text-primary font-black text-lg mt-1">
                              Rp {price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-gray-600">/bulan</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-black font-black text-sm tracking-widest px-8 py-3 flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    SIMPAN {currentSection.label.toUpperCase()}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
