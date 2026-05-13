"use client"

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { 
  Upload, 
  Check, 
  Trash2, 
  Star, 
  Loader2, 
  ChevronLeft,
  AlertCircle,
  Calculator
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Car, CarImage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CarFormProps {
  initialData?: Car & { car_images?: CarImage[] };
  isEdit?: boolean;
}

const INTEREST_RATE = 0.08; // 8% flat/tahun
const TENOR_OPTIONS = [12, 24, 36, 48, 60];

function calcInstallment(pokok: number, bulan: number): number {
  if (pokok <= 0) return 0;
  const bunga = pokok * INTEREST_RATE * (bulan / 12);
  return Math.ceil((pokok + bunga) / bulan / 1000) * 1000;
}

export default function CarForm({ initialData, isEdit }: CarFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    price_credit: initialData?.price_credit || 0,
    condition: initialData?.condition || "bekas",
    color: initialData?.color || "",
    transmission: initialData?.transmission || "otomatis",
    fuel_type: initialData?.fuel_type || "bensin",
    mileage: initialData?.mileage || 0,
    license_plate: initialData?.license_plate || "",
    description: initialData?.description || "",
    status: initialData?.status || "tersedia",
  });

  // Status awal sebelum form dibuka (untuk deteksi perubahan ke 'terjual')
  const prevStatus = initialData?.status || "tersedia";

  // Computed credit values
  const dp = Math.ceil((formData.price_credit || formData.price) * 0.2 / 1000000) * 1000000;
  const pokok = (formData.price_credit || formData.price) - dp;

  const formatNumber = (num: number) => num.toLocaleString('id-ID');
  const parseNumber = (str: string) => parseFloat(str.replace(/\./g, '')) || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseNumber(value) }));
  };

  // Images State
  const [existingImages, setExistingImages] = useState<CarImage[]>(initialData?.car_images || []);
  const [newImages, setNewImages] = useState<{ file: File; preview: string; isPrimary: boolean }[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const newImgs = filesArr.map(file => ({ file, preview: URL.createObjectURL(file), isPrimary: false }));
      setNewImages(prev => [...prev, ...newImgs]);
    }
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImages[index].preview);
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: string) => {
    setImagesToDelete(prev => [...prev, id]);
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  const setPrimary = (type: 'existing' | 'new', indexOrId: string | number) => {
    setExistingImages(prev => prev.map(img => ({ ...img, is_primary: false })));
    setNewImages(prev => prev.map(img => ({ ...img, isPrimary: false })));
    if (type === 'existing') {
      setExistingImages(prev => prev.map(img => img.id === indexOrId ? { ...img, is_primary: true } : img));
    } else {
      setNewImages(prev => prev.map((img, i) => i === indexOrId ? { ...img, isPrimary: true } : img));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let carId = initialData?.id;
      const newStatus = formData.status;

      // 1. Save/Update Car
      if (isEdit && carId) {
        const { error: updateError } = await supabase.from('cars').update(formData).eq('id', carId);
        if (updateError) throw updateError;
      } else {
        const { data: newCar, error: insertError } = await supabase.from('cars').insert([formData]).select().single();
        if (insertError) throw insertError;
        carId = newCar.id;
      }

      // 2. Auto-create transaction when status changes to 'terjual'
      if (newStatus === 'terjual' && prevStatus !== 'terjual' && carId) {
        // Check if transaction already exists
        const { data: existingTrx } = await supabase.from('transactions').select('id').eq('car_id', carId).single();
        if (!existingTrx) {
          await supabase.from('transactions').insert([{
            car_id: carId,
            customer_name: 'Pembeli Langsung',
            sale_price: formData.price,
            payment_method: 'tunai',
            notes: `Unit terjual: ${formData.brand} ${formData.model} ${formData.year}`,
            transaction_date: new Date().toISOString().split('T')[0],
          }]);
        }
      }

      // 3. Delete images
      if (imagesToDelete.length > 0 && carId) {
        await supabase.from('car_images').delete().in('id', imagesToDelete);
      }

      // 4. Upload New Images
      if (newImages.length > 0 && carId) {
        for (const img of newImages) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', img.file);
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
          if (!uploadRes.ok) throw new Error('Gagal mengupload gambar.');
          const { url: publicUrl } = await uploadRes.json();
          const { error: imgError } = await supabase.from('car_images').insert([{
            car_id: carId,
            image_url: publicUrl,
            is_primary: img.isPrimary,
            order_index: 0
          }]);
          if (imgError) throw imgError;
        }
      }

      // 5. Update existing images primary status
      if (isEdit && carId) {
        for (const img of existingImages) {
          await supabase.from('car_images').update({ is_primary: img.is_primary }).eq('id', img.id);
        }
      }

      router.push("/admin/mobil");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Kembali
        </button>
        <button type="submit" disabled={loading} className="bg-accent text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 flex items-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          {isEdit ? "Simpan Perubahan" : "Simpan Mobil Baru"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Photos */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-primary mb-6">Foto Kendaraan</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-primary">Klik untuk Upload</p>
                <p className="text-xs font-medium text-gray-400 mt-1">Multi upload (PNG, JPG)</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {existingImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                  <Image src={img.image_url} alt="Existing" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setPrimary('existing', img.id)} className={cn("p-2 rounded-xl transition-all", img.is_primary ? "bg-accent text-white" : "bg-white/20 text-white hover:bg-accent")}>
                      <Star className={cn("w-4 h-4", img.is_primary && "fill-current")} />
                    </button>
                    <button type="button" onClick={() => removeExistingImage(img.id)} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {img.is_primary && <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-[8px] font-black text-white rounded-full uppercase tracking-widest">Utama</div>}
                </div>
              ))}
              {newImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                  <Image src={img.preview} alt="New" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={() => setPrimary('new', idx)} className={cn("p-2 rounded-xl transition-all", img.isPrimary ? "bg-accent text-white" : "bg-white/20 text-white hover:bg-accent")}>
                      <Star className={cn("w-4 h-4", img.isPrimary && "fill-current")} />
                    </button>
                    <button type="button" onClick={() => removeNewImage(idx)} className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {img.isPrimary && <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-[8px] font-black text-white rounded-full uppercase tracking-widest">Utama</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form Data */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <h3 className="text-xl font-black text-primary col-span-full border-b border-gray-50 pb-4">Informasi Dasar</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Merek</label>
              <input name="brand" required value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" placeholder="Contoh: Toyota" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Model</label>
              <input name="model" required value={formData.model} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" placeholder="Contoh: Avanza G 1.3" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tahun</label>
              <input name="year" type="number" min="1990" max="2026" required value={formData.year} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Harga Cash (IDR)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                <input name="price" type="text" required value={formatNumber(formData.price)} onChange={handlePriceChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-accent font-bold text-accent" />
              </div>
            </div>

            {/* ======= HARGA KREDIT - DISEDERHANAKAN ======= */}
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Harga Kredit (IDR) — Opsional</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                <input name="price_credit" type="text" value={formatNumber(formData.price_credit)} onChange={handlePriceChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-accent font-bold text-primary" placeholder="Kosongkan jika sama dengan harga cash" />
              </div>
              <p className="text-xs text-gray-400 ml-1">Sistem otomatis menghitung DP dan cicilan berdasarkan harga ini.</p>
            </div>

            {/* Preview Simulasi Cicilan */}
            {(formData.price_credit > 0 || formData.price > 0) && (
              <div className="col-span-full bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Preview Simulasi Cicilan (Otomatis)</p>
                </div>
                <p className="text-xs text-blue-500">DP estimasi (20%): <span className="font-black">{formatCurrency(dp)}</span> · Pokok: <span className="font-black">{formatCurrency(pokok)}</span></p>
                <div className="grid grid-cols-5 gap-2">
                  {TENOR_OPTIONS.map(t => (
                    <div key={t} className="bg-white rounded-xl p-2 text-center border border-blue-100">
                      <p className="text-[9px] font-bold text-gray-400">{t} bln</p>
                      <p className="text-[11px] font-black text-primary">{formatCurrency(calcInstallment(pokok, t))}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======= SPESIFIKASI ======= */}
            <h3 className="text-xl font-black text-primary col-span-full border-b border-gray-50 pb-4 mt-4">Spesifikasi & Status</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kondisi</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary">
                <option value="baru">Baru</option>
                <option value="bekas">Bekas</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Transmisi</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary">
                <option value="otomatis">Otomatis</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bahan Bakar</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary">
                <option value="bensin">Bensin</option>
                <option value="diesel">Diesel</option>
                <option value="listrik">Listrik</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Warna</label>
              <input name="color" value={formData.color} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Kilometer</label>
              <input name="mileage" type="number" value={formData.mileage} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor Plat</label>
              <input name="license_plate" value={formData.license_plate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary" />
            </div>
            <div className="space-y-2 col-span-full">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Status Ketersediaan</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold text-primary">
                <option value="tersedia">✅ Tersedia</option>
                <option value="terjual">🔴 Terjual — Transaksi otomatis dibuat</option>
              </select>
              {formData.status === 'terjual' && prevStatus !== 'terjual' && (
                <p className="text-xs text-orange-500 font-bold ml-1">⚠️ Mengubah ke Terjual akan otomatis membuat catatan transaksi baru.</p>
              )}
            </div>

            <div className="space-y-2 col-span-full">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Deskripsi Lengkap (Sesuai Caption IG)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-medium h-60 text-primary" placeholder="Masukkan spesifikasi detail seperti - STNK, BPKB, FAKTUR, dll..." />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
