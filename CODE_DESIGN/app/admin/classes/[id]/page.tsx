"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClassForm } from "@/components/admin/classes/class-form";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditClassPage() {
  const { id } = useParams();
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        setCls(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  if (loading) return <div>Loading class data...</div>;
  if (!cls) return <div>Class not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
        <p className="text-muted-foreground">Update class details and schedule.</p>
      </div>
      <div className="max-w-3xl">
        <ClassForm initialData={cls} />
      </div>
    </div>
  );
}