"use client";

import { useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Dumbbell, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function JoinPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      membership_type: formData.get("membership_type") as any,
      payment_status: "pending" as const,
    };

    try {
      const { error } = await supabase.from("members").insert([data]);
      if (error) throw error;
      setSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit registration");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">Registration Received!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for joining DE GYM Platinum. Our team will contact you shortly to finalize your membership and payment.
            </CardDescription>
            <Button className="mt-8 w-full" asChild>
              <a href="/">Return Home</a>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">Start Your Fitness Journey</h1>
                <p className="text-xl text-muted-foreground">
                  Join the most premium fitness community in Bali. Fill out the form and we'll get you started.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Access to world-class equipment",
                  "Unlimited group fitness classes",
                  "Professional coaching and support",
                  "Premium amenities and locker rooms",
                  "Vibrant and motivating community"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-6 flex items-center gap-4">
                  <Dumbbell className="h-10 w-10 opacity-50" />
                  <div>
                    <p className="font-bold text-lg">Need help choosing?</p>
                    <p className="opacity-90">Call us at +62 812 3456 7890 for a free consultation.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Membership Registration</CardTitle>
                <CardDescription>Enter your details to secure your spot.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" placeholder="+62..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="membership_type">Select Plan</Label>
                    <Select name="membership_type" defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day_pass">Day Pass (150k)</SelectItem>
                        <SelectItem value="monthly">Monthly Membership (850k)</SelectItem>
                        <SelectItem value="yearly">Yearly Membership (7.5m)</SelectItem>
                        <SelectItem value="personal_training">Personal Training Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Registration"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}