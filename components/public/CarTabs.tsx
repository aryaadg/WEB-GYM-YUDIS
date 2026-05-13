"use client"

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Car as CarType } from "@/lib/types";

interface CarTabsProps {
  car: CarType;
}

// Tenor options (dalam bulan)
const TENOR_OPTIONS = [12, 24, 36, 48, 60];

// Estimasi bunga per tahun berdasarkan tenor (flat rate umum leasing Indonesia)
const INTEREST_RATE_PER_YEAR = 0.08; // 8% flat per tahun

function calculateInstallment(pokok: number, tenorBulan: number): number {
  const bungaTotal = pokok * INTEREST_RATE_PER_YEAR * (tenorBulan / 12);
  return Math.ceil((pokok + bungaTotal) / tenorBulan / 1000) * 1000;
}

export default function CarTabs({ car }: CarTabsProps) {
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [selectedTenor, setSelectedTenor] = useState(36);

  const tabs = [
    { id: "deskripsi", label: "Deskripsi Unit" },
    { id: "spesifikasi", label: "Spesifikasi" },
    { id: "simulasi", label: "Simulasi Kredit" }
  ];

  const hargaKredit = car.price_credit || car.price;
  const dp = car.dp || Math.ceil(hargaKredit * 0.2 / 1000000) * 1000000; // Default DP 20%
  const pokok = hargaKredit - dp;
  const angsuranPerBulan = calculateInstallment(pokok, selectedTenor);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl mt-12 mb-20 animate-fade-in-up">
      <div className="flex border-b border-white/10 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-6 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-2xl",
              activeTab === tab.id ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 min-h-[300px]">
         {/* Deskripsi Content */}
         {activeTab === "deskripsi" && (
          <div className="prose prose-invert max-w-none animate-fade-in">
            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
              {car.description || "Tidak ada deskripsi tersedia untuk unit ini."}
            </p>
          </div>
        )}

        {/* Spesifikasi Content */}
        {activeTab === "spesifikasi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-fade-in">
            <SpecRow label="Merek" value={car.brand} />
            <SpecRow label="Model" value={car.model} />
            <SpecRow label="Tahun" value={car.year.toString()} />
            <SpecRow label="Warna" value={car.color || "-"} />
            <SpecRow label="Kilometer" value={car.condition === 'baru' ? '0' : (car.mileage?.toLocaleString() || "-") + " km"} />
            <SpecRow label="Transmisi" value={car.transmission} className="capitalize" />
            <SpecRow label="Bahan Bakar" value={car.fuel_type} className="capitalize" />
            <SpecRow label="Plat Nomor" value={car.license_plate || "-"} />
          </div>
        )}

        {/* Simulasi Kredit Content */}
        {activeTab === "simulasi" && (
          <div className="animate-fade-in space-y-8">

            {/* Ringkasan Harga */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Harga Cash</p>
                <p className="text-xl font-black text-white">{formatCurrency(car.price)}</p>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Harga Kredit</p>
                <p className="text-xl font-black text-accent">{formatCurrency(hargaKredit)}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Uang Muka (DP)</p>
                <p className="text-xl font-black text-white">{formatCurrency(dp)}</p>
              </div>
            </div>

            {/* Pilih Tenor */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Pilih Tenor</p>
              <div className="grid grid-cols-5 gap-3">
                {TENOR_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTenor(t)}
                    className={cn(
                      "py-3 px-2 rounded-xl text-sm font-black transition-all duration-200 border",
                      selectedTenor === t
                        ? "bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-accent/40 hover:text-white"
                    )}
                  >
                    {t} bln
                  </button>
                ))}
              </div>
            </div>

            {/* Hasil Estimasi */}
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-3xl p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Estimasi Angsuran / Bulan</p>
              <p className="text-5xl font-black text-white mb-1">{formatCurrency(angsuranPerBulan)}</p>
              <p className="text-sm text-gray-400">selama <span className="text-white font-bold">{selectedTenor} bulan</span> · pokok {formatCurrency(pokok)}</p>

              {/* Breakdown semua tenor */}
              <div className="mt-6 grid grid-cols-5 gap-2 text-xs">
                {TENOR_OPTIONS.map((t) => (
                  <div key={t} className={cn(
                    "rounded-xl py-2 px-1 transition-all",
                    t === selectedTenor ? "bg-accent/20 text-white" : "text-gray-500"
                  )}>
                    <div className="font-bold mb-0.5">{t} bln</div>
                    <div className="font-black text-[11px]">{formatCurrency(calculateInstallment(pokok, t))}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Leasing */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-center text-gray-400">Partner Leasing Resmi</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                {/* Kredivo */}
                <a href="https://kredivo.com" target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl h-16 flex flex-col items-center justify-center px-3 border border-white/5 hover:scale-105 transition-transform gap-1 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-[#6C2BD9] flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">K</span>
                  </div>
                  <span className="text-[#6C2BD9] font-black text-xs tracking-tight">kredivo</span>
                </a>

                {/* Akulaku */}
                <a href="https://akulaku.com" target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl h-16 flex flex-col items-center justify-center px-3 border border-white/5 hover:scale-105 transition-transform gap-1 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">A</span>
                  </div>
                  <span className="text-[#0066FF] font-black text-xs tracking-tight">akulaku</span>
                </a>

                {/* Adira Finance */}
                <a href="https://adira.co.id" target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl h-16 flex flex-col items-center justify-center px-3 border border-white/5 hover:scale-105 transition-transform gap-1 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-[#E8172B] flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">A</span>
                  </div>
                  <span className="text-[#E8172B] font-black text-xs tracking-tight">ADIRA</span>
                </a>

                {/* BCA Finance */}
                <a href="https://bcafinance.co.id" target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl h-16 flex flex-col items-center justify-center px-3 border border-white/5 hover:scale-105 transition-transform gap-1 cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-[#0066AE] flex items-center justify-center">
                    <span className="text-white font-black text-[9px]">BCA</span>
                  </div>
                  <span className="text-[#0066AE] font-black text-xs tracking-tight">BCA Finance</span>
                </a>

              </div>
              <p className="text-[10px] text-gray-500 text-center italic">*Simulasi ini hanya perkiraan dengan bunga flat 8%/tahun. Hubungi kami untuk perhitungan resmi dari leasing.</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 h-12">
      <span className="text-gray-500 font-medium text-sm">{label}</span>
      <span className={cn("text-white font-bold tracking-tight", className)}>{value}</span>
    </div>
  );
}
