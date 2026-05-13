import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CarForm from "@/components/admin/CarForm";

export const dynamic = 'force-dynamic';

async function getCarData(id: string) {
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const car = await getCarData(params.id);
  
  if (!car) {
    notFound();
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Edit Unit Kendaraan</h1>
        <p className="text-gray-500 font-medium">Lakukan perubahan pada data atau foto unit di bawah ini.</p>
      </header>

      <CarForm initialData={car} isEdit={true} />
    </div>
  );
}
