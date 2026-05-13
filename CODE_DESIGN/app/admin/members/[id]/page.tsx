"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MemberForm } from "@/components/admin/members/member-form";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditMemberPage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data, error } = await supabase
          .from("members")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        setMember(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <div>Loading member data...</div>;
  if (!member) return <div>Member not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
        <p className="text-muted-foreground">Update member profile and membership details.</p>
      </div>
      <div className="max-w-3xl">
        <MemberForm initialData={member} />
      </div>
    </div>
  );
}