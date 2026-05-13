"use client"

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import CarCard from "./CarCard";
import { Car as CarType } from "@/lib/types";

interface FilterBarProps {
  initialCars: (CarType & { car_images: { image_url: string }[] })[];
  brands: string[];
}

export default function FilterBar({ initialCars, brands }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [selectedCondition, setSelectedCondition] = useState("Semua");
  const [selectedTransmission, setSelectedTransmission] = useState("Semua");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("Terbaru");

  // Filter Logic
  const filteredCars = useMemo(() => {
    let result = [...initialCars];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) => c.brand.toLowerCase().includes(s) || c.model.toLowerCase().includes(s)
      );
    }

    // Brand
    if (selectedBrand !== "Semua") {
      result = result.filter((c) => c.brand === selectedBrand);
    }

    // Condition
    if (selectedCondition !== "Semua") {
      result = result.filter((c) => c.condition === selectedCondition.toLowerCase());
    }

    // Transmission
    if (selectedTransmission !== "Semua") {
      result = result.filter((c) => c.transmission === selectedTransmission.toLowerCase());
    }

    // Price
    if (minPrice) {
      result = result.filter((c) => c.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter((c) => c.price <= parseInt(maxPrice));
    }

    // Sort
    if (sortBy === "Harga Terendah") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Harga Tertinggi") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: Terbaru
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialCars, search, selectedBrand, selectedCondition, selectedTransmission, minPrice, maxPrice, sortBy]);

  return (
    <div className="space-y-8">
      {/* Filters Area */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pencarian</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari merek atau model..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Merek Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Merek</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="Semua">Semua Merek</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Kondisi Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kondisi</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="Semua">Semua Kondisi</option>
              <option value="baru">Baru</option>
              <option value="bekas">Bekas</option>
            </select>
          </div>

           {/* Transmisi */}
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Transmisi</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
            >
              <option value="Semua">Semua Transmisi</option>
              <option value="manual">Manual</option>
              <option value="otomatis">Otomatis</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Range Harga (IDR)</label>
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    placeholder="Min"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="text-gray-500">-</span>
                <input
                    type="number"
                    placeholder="Max"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Urutkan</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Terbaru">Terbaru</option>
              <option value="Harga Terendah">Harga Terendah</option>
              <option value="Harga Tertinggi">Harga Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-4">
        <p className="text-gray-400 font-medium">
          Menampilkan <span className="text-white font-bold">{filteredCars.length}</span> unit
        </p>
      </div>

      {/* Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <Search className="w-12 h-12" />
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Tidak ada hasil ditemukan</h3>
                <p>Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            </div>
            <button 
                onClick={() => {
                    setSearch("");
                    setSelectedBrand("Semua");
                    setSelectedCondition("Semua");
                    setSelectedTransmission("Semua");
                    setMinPrice("");
                    setMaxPrice("");
                }}
                className="text-accent font-bold hover:underline"
            >
                Reset Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
