import { MemberForm } from "@/components/admin/members/member-form";

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
        <p className="text-muted-foreground">Register a new gym member.</p>
      </div>
      <div className="max-w-3xl">
        <MemberForm />
      </div>
    </div>
  );
}