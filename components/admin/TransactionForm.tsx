"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { 
  Check, 
  Loader2, 
  Search, 
  User, 
  Phone, 
  MapPin, 
  Banknote, 
  Calendar as CalendarIcon,
  MessageSquare,
  Car as CarIcon
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CarOption {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
}

interface TransactionFormProps {
  availableCars: CarOption[];
}

export default function TransactionForm({ availableCars }: TransactionFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    car_id: "",
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    sale_price: 0,
    payment_method: "tunai",
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  const [searchCar, setSearchCar] = useState("");
  const [showCarDropdown, setShowCarDropdown] = useState(false);

  const filteredCars = availableCars.filter(car => 
    `${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(searchCar.toLowerCase())
  );

  const handleSelectCar = (car: CarOption) => {
    setFormData({
      ...formData,
      car_id: car.id,
      sale_price: car.price
    });
    setSearchCar(`${car.brand} ${car.model} (${car.year}) - ${formatCurrency(car.price)}`);
    setShowCarDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.car_id) {
        setError("Silakan pilih mobil terlebih dahulu.");
        return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Insert Transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([formData]);
      
      if (txError) throw txError;

      // 2. Update Car Status
      const { error: carError } = await supabase
        .from('cars')
        .update({ status: 'terjual' })
        .eq('id', formData.car_id);

      if (carError) throw carError;

      router.push("/admin/transaksi");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mencatat transaksi.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left Column: Car Selection */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <CarIcon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-xl font-black text-primary tracking-tight">Pilih Unit</h3>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Cari Mobil Tersedia</label>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Ketik merek atau model..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent font-bold text-sm"
                    value={searchCar}
                    onChange={(e) => {
                        setSearchCar(e.target.value);
                        setShowCarDropdown(true);
                    }}
                    onFocus={() => setShowCarDropdown(true)}
                />
            </div>

            {showCarDropdown && searchCar && filteredCars.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredCars.map((car) => (
                        <button
                            key={car.id}
                            type="button"
                            onClick={() => handleSelectCar(car)}
                            className="w-full text-left px-6 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                            <p className="font-black text-primary text-sm">{car.brand} {car.model} ({car.year})</p>
                            <p className="text-xs font-bold text-accent">{formatCurrency(car.price)}</p>
                        </button>
                    ))}
                </div>
            )}
          </div>
        </div>

        {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                <p className="font-bold">{error}</p>
            </div>
        )}
      </div>

      {/* Right Column: Customer & Details */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <h3 className="text-xl font-black text-primary col-span-full border-b border-gray-50 pb-4">Data Pelanggan</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <User className="w-3 h-3" /> Nama Lengkap
            </label>
            <input name="customer_name" required value={formData.customer_name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold" placeholder="Contoh: Budi Santoso" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Nomor Telepon
            </label>
            <input name="customer_phone" value={formData.customer_phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold" placeholder="0812xxxx" />
          </div>
          <div className="space-y-2 col-span-full">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Alamat
            </label>
            <textarea name="customer_address" value={formData.customer_address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-medium h-24" placeholder="Alamat lengkap pelanggan..." />
          </div>

          <h3 className="text-xl font-black text-primary col-span-full border-b border-gray-50 pb-4 mt-4">Rincian Pembayaran</h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Banknote className="w-3 h-3" /> Harga Jual (IDR)
            </label>
            <input name="sale_price" type="number" required value={formData.sale_price} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-black text-accent" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Metode Pembayaran
            </label>
            <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold">
                <option value="tunai">Tunai / Cash</option>
                <option value="kredit">Kredit</option>
                <option value="leasing">Leasing / Finance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <CalendarIcon className="w-3 h-3" /> Tanggal Transaksi
            </label>
            <input name="transaction_date" type="date" required value={formData.transaction_date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-bold" />
          </div>

          <div className="space-y-2 col-span-full">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Catatan Tambahan
            </label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent font-medium h-24" placeholder="Keterangan tambahan jika ada..." />
          </div>

          <div className="col-span-full pt-4">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                Konfirmasi & Simpan Transaksi
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
