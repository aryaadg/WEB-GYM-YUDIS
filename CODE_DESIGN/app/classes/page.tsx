"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { createClient } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function PublicClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase
        .from("classes")
        .select("*, coaches(name, photo_url)")
        .eq("is_active", true)
        .order("start_time", { ascending: true });
      setClasses(data || []);
      setLoading(false);
    };
    fetchClasses();
  }, []);

  const getClassesForDay = (day: string) => {
    return classes.filter(c => c.day_of_week === day);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl font-bold">Class Schedule</h1>
            <p className="text-muted-foreground">Find the perfect class for your fitness level and goals.</p>
          </div>

          <Tabs defaultValue="monday" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto p-1 bg-muted/50 mb-8">
              {days.map((day) => (
                <TabsTrigger key={day} value={day} className="flex-1 capitalize py-3">
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
                {loading ? (
                  <div className="text-center py-20">Loading schedule...</div>
                ) : getClassesForDay(day).length === 0 ? (
                  <div className="text-center py-20 border rounded-xl bg-muted/20">
                    <p className="text-muted-foreground">No classes scheduled for this day.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getClassesForDay(day).map((cls) => (
                      <Card key={cls.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant="secondary">{cls.class_type}</Badge>
                            <div className="flex items-center text-sm font-medium text-primary">
                              <Clock className="h-4 w-4 mr-1" />
                              {cls.start_time.slice(0, 5)} ({cls.duration_minutes}m)
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                            {cls.description || "No description available."}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              {cls.coaches?.photo_url ? (
                                <img src={cls.coaches.photo_url} alt={cls.coaches.name} className="h-8 w-8 rounded-full object-cover" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <span className="text-sm font-medium">{cls.coaches?.name || "TBA"}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Max {cls.max_capacity} pax
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}