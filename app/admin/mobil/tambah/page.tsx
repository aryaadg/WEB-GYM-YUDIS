export const dynamic = 'force-dynamic';
import CarForm from "@/components/admin/CarForm";

export default function AddCarPage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Tambah Mobil Baru</h1>
        <p className="text-gray-500 font-medium">Lengkapi formulir di bawah untuk menambahkan unit ke katalog.</p>
      </header>

      <CarForm />
    </div>
  );
}
