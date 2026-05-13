"use client"

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  X,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase";

interface CarItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  condition: string;
  status: string;
  tax_pkb?: number;
  price_credit?: number;
  car_images?: { image_url: string }[];
}

interface CarListTableProps {
  initialCars: CarItem[];
}

export default function CarListTable({ initialCars }: CarListTableProps) {
  const [cars, setCars] = useState<CarItem[]>(initialCars);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);

  const supabase = createClient();

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (carId: string) => {
    setIsDeletingLoading(true);
    
    // 1. Delete car from table (cascade will handle car_images)
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (!error) {
        setCars(cars.filter(c => c.id !== carId));
        setIsDeleting(null);
    } else {
        alert("Gagal menghapus mobil: " + error.message);
    }
    
    setIsDeletingLoading(false);
  };

  return (
    <div className="flex flex-col">
      {/* Table Header / Search */}
      <div className="p-8 border-b border-gray-50 bg-white">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari merek atau model mobil..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Mobil</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tahun</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Cash</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kredit</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img
                          src={car.car_images?.[0]?.image_url || "/placeholder-car.jpg"}
                          alt={car.brand}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#1a1a2e] tracking-tight">{car.brand} {car.model}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{car.condition}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-600">{car.year}</td>
                  <td className="px-8 py-6 text-sm font-black text-accent">{formatCurrency(car.price)}</td>
                  <td className="px-8 py-6 text-sm font-black text-primary">{car.price_credit ? formatCurrency(car.price_credit) : "-"}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      car.status === 'tersedia' 
                        ? 'bg-green-100 text-green-600 border border-green-200' 
                        : 'bg-red-100 text-red-600 border border-red-200'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/mobil/${car.id}/edit`}
                            className="p-2 hover:bg-primary/5 text-primary rounded-xl transition-colors"
                            title="Edit Unit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setIsDeleting(car.id)}
                            className="p-2 hover:bg-red-50 text-red-400 rounded-xl transition-colors"
                            title="Hapus Unit"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                        Tidak ada unit ditemukan.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm animate-in fade-in" onClick={() => !isDeletingLoading && setIsDeleting(null)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-[#1a1a2e] mb-2 tracking-tight">Konfirmasi Hapus</h3>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Apakah Anda yakin ingin menghapus unit ini? Tindakan ini permanen dan akan menghapus semua foto di storage.
                </p>
                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => setIsDeleting(null)}
                        disabled={isDeletingLoading}
                        className="flex-1 py-4 rounded-2xl font-bold bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all border border-gray-100 whitespace-nowrap"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleDelete(isDeleting)}
                        disabled={isDeletingLoading}
                        className="flex-1 py-4 rounded-2xl font-black bg-red-500 text-white hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {isDeletingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ya, Hapus Unit"}
                    </button>
                </div>
            </div>
            <button 
                onClick={() => setIsDeleting(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
            >
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
