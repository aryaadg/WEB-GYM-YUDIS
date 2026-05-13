"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CoachForm } from "@/components/admin/coaches/coach-form";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditCoachPage() {
  const { id } = useParams();
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const { data, error } = await supabase
          .from("coaches")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        setCoach(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [id]);

  if (loading) return <div>Loading coach data...</div>;
  if (!coach) return <div>Coach not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Coach</h1>
        <p className="text-muted-foreground">Update instructor profile information.</p>
      </div>
      <div className="max-w-3xl">
        <CoachForm initialData={coach} />
      </div>
    </div>
  );
}