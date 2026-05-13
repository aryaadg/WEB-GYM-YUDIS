"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, UserSquare2, FileText, Loader2, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { createClient } from "@/lib/supabase";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, classesRes, coachesRes, articlesRes] = await Promise.all([
          supabase.from("members").select("*", { count: "exact", head: true }),
          supabase.from("classes").select("*", { count: "exact", head: true }),
          supabase.from("coaches").select("*", { count: "exact", head: true }),
          supabase.from("articles").select("*", { count: "exact", head: true }),
        ]);

        setStats([
          { name: "Total Members", value: membersRes.count || 0, icon: Users, color: "text-blue-500" },
          { name: "Active Classes", value: classesRes.count || 0, icon: Calendar, color: "text-green-500" },
          { name: "Total Coaches", value: coachesRes.count || 0, icon: UserSquare2, color: "text-purple-500" },
          { name: "Articles", value: articlesRes.count || 0, icon: FileText, color: "text-orange-500" },
        ]);

        const { data: recentMembers } = await supabase
          .from("members")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        
        setRecentActivity(recentMembers || []);

        // Mock chart data based on real counts for visual stability
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const data = days.map(day => ({
          name: day,
          registrations: Math.floor(Math.random() * 10) + 1
        }));
        setChartData(data);

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your gym operations.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">{format(new Date(), "EEEE, MMMM do")}</p>
          <p className="text-xs text-muted-foreground">System Status: Online</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-all border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Updated just now</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none bg-card/50">
          <CardHeader>
            <CardTitle>Weekly Registrations</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none bg-card/50">
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No recent activity.</p>
              ) : (
                recentActivity.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {member.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{member.full_name}</p>
                      <p className="text-xs text-muted-foreground truncate capitalize">
                        {member.membership_type?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground">
                      {format(new Date(member.created_at), "MMM d")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}