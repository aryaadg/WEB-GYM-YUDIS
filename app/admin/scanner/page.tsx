"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Loader2, ScanLine, X, CheckCircle2, User, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";

type MemberData = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  membership_type: "Basic" | "Premium" | "Elite";
  membership_end: string | null;
  status: "Aktif" | "Tidak Aktif" | "Expired";
};

export default function AdminScannerPage() {
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [manualId, setManualId] = useState("");
  const [isScanningActive, setIsScanningActive] = useState(true);

  const supabase = createClient();

  const processMemberId = async (id: string) => {
    if (loading) return; // Prevent double scanning
    
    setLoading(true);
    setScannedId(id);
    setIsScanningActive(false); // Pause scanning while processing

    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Supabase Error:", error);
        toast.error(`Gagal: ${error?.message || "Member tidak ditemukan"}`);
        setIsScanningActive(true);
        setScannedId(null);
      } else {
        setMember(data);
        setShowModal(true);
        // Play success beep sound if possible
        try {
          const audio = new Audio('/success-beep.mp3'); // Optional if file exists
          audio.play().catch(() => {});
        } catch(e) {}
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
      setIsScanningActive(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (result: any) => {
    if (result && result.length > 0 && result[0].rawValue) {
       const scannedValue = result[0].rawValue;
       if (scannedValue !== scannedId) {
         processMemberId(scannedValue);
       }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      processMemberId(manualId.trim());
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMember(null);
    setScannedId(null);
    setIsScanningActive(true); // Resume scanning
  };

  const handleActivate = async () => {
    if (!member) return;
    setActivating(true);

    try {
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30);
      
      const { error } = await supabase
        .from("members")
        .update({
          status: "Aktif",
          membership_start: start.toISOString().split('T')[0],
          membership_end: end.toISOString().split('T')[0]
        })
        .eq("id", member.id);
      
      if (error) throw error;
      
      toast.success("Membership berhasil diaktifkan!");
      
      // Update local state to reflect changes immediately
      setMember({
        ...member,
        status: "Aktif",
        membership_end: end.toISOString().split('T')[0]
      });
      
    } catch (err) {
      toast.error("Gagal mengaktifkan member.");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 border border-primary/20">
          <ScanLine className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Scanner QR Code</h1>
          <p className="text-gray-500 text-sm">Scan QR Code member untuk check-in atau aktivasi pembayaran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scanner Viewport */}
        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col items-center">
          <div className="w-full max-w-sm aspect-square bg-black border-2 border-dashed border-white/20 relative overflow-hidden rounded-lg mb-6 flex items-center justify-center">
            {isScanningActive ? (
               <Scanner
                  onScan={handleScan}
                  onError={(error) => console.log(error?.message)}
                  components={{
                    audio: false, // Disable default audio, we handle our own if needed
                    onOff: true,
                    torch: true,
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' }
                  }}
               />
            ) : (
               <div className="flex flex-col items-center text-gray-500">
                  <ScanLine className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">Scanner Jeda (Paused)</p>
               </div>
            )}
            
            {/* Scanner Overlay Animation */}
            {isScanningActive && (
              <div className="absolute inset-0 border-[3px] border-primary/50 m-8 rounded animate-pulse pointer-events-none"></div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-primary font-bold text-sm tracking-widest animate-pulse">MEMPROSES...</p>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm text-center">
            Arahkan QR Code yang ada di layar HP member ke kamera ini.
          </p>
        </div>

        {/* Manual Input / Info */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-white/10 p-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Input Manual ID</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder="Masukkan ID Member (UUID)"
                className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 placeholder-gray-600"
              />
              <button 
                type="submit"
                disabled={loading || !manualId.trim()}
                className="bg-primary text-black font-black px-4 flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Gunakan jika kamera bermasalah atau member tidak membawa QR Code.
            </p>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white mb-1">Panduan Penggunaan</h4>
              <ul className="text-sm text-gray-400 space-y-2 list-disc ml-4">
                <li>Pastikan browser memiliki izin akses kamera.</li>
                <li>Jika status member <strong>Tidak Aktif</strong>, Anda bisa langsung menerima pembayaran cash dan mengaktifkannya di sini.</li>
                <li>Jika status member <strong>Aktif</strong>, maka anggap sebagai Check-in sukses.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Member Result Modal */}
      {showModal && member && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Data Profil Member
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors p-1 bg-white/5 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 text-center border ${
                member.status === "Aktif" ? "bg-green-500/10 border-green-500/20" : 
                member.status === "Expired" ? "bg-red-500/10 border-red-500/20" : 
                "bg-yellow-500/10 border-yellow-500/20"
              }`}>
                {member.status === "Aktif" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                ) : (
                  <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${member.status === 'Expired' ? 'text-red-400' : 'text-yellow-400'}`} />
                )}
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Status Membership</p>
                <p className={`text-3xl font-black ${
                  member.status === "Aktif" ? "text-green-400" : 
                  member.status === "Expired" ? "text-red-400" : 
                  "text-yellow-400"
                }`}>
                  {member.status.toUpperCase()}
                </p>
              </div>

              {/* Data Detail */}
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Nama</span>
                  <span className="text-white font-bold text-sm">{member.full_name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="text-white text-sm">{member.email || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Paket</span>
                  <span className="text-primary font-bold text-sm">{member.membership_type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500 text-sm">Masa Aktif s/d</span>
                  <span className="text-white text-sm">
                    {member.membership_end ? new Date(member.membership_end).toLocaleDateString('id-ID') : "-"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                {member.status !== "Aktif" ? (
                  <button
                    onClick={handleActivate}
                    disabled={activating}
                    className="w-full bg-primary text-black font-black text-sm py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {activating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {activating ? "MEMPROSES..." : "TERIMA PEMBAYARAN & AKTIFKAN (30 HARI)"}
                  </button>
                ) : (
                  <button
                    onClick={closeModal}
                    className="w-full bg-green-500/20 text-green-400 border border-green-500/30 font-black text-sm py-4 flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    CHECK-IN BERHASIL (TUTUP)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
