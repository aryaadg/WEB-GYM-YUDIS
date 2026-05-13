import { ClassForm } from "@/components/admin/classes/class-form";

export default function NewClassPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule New Class</h1>
        <p className="text-muted-foreground">Create a new fitness class in the weekly schedule.</p>
      </div>
      <div className="max-w-3xl">
        <ClassForm />
      </div>
    </div>
  );
}