"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function MemberDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get profile & membership
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    const { data: memberData } = await supabase
      .from("members")
      .select("*")
      .eq("email", user.email)
      .single();

    setProfile({ ...profileData, memberInfo: memberData });

    // Get classes
    const { data: classes } = await supabase
      .from("classes")
      .select("*, coaches(name), bookings(id)")
      .eq("is_active", true);

    // Get my bookings
    if (memberData) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, classes(*, coaches(name))")
        .eq("member_id", memberData.id);
      setMyBookings(bookings || []);
    }

    setAvailableClasses(classes || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (classId: string) => {
    if (!profile?.memberInfo) {
      toast.error("Membership record not found. Please contact admin.");
      return;
    }

    if (profile.memberInfo.payment_status !== 'paid') {
      toast.error("Your membership is not active or expired.");
      return;
    }

    setBookingId(classId);
    try {
      // Check if already booked
      const isAlreadyBooked = myBookings.some(b => b.class_id === classId);
      if (isAlreadyBooked) {
        toast.error("You have already booked this class.");
        return;
      }

      // Check capacity
      const targetClass = availableClasses.find(c => c.id === classId);
      if (targetClass.bookings.length >= targetClass.max_capacity) {
        toast.error("This class is full.");
        return;
      }

      const { error } = await supabase.from("bookings").insert([{
        member_id: profile.memberInfo.id,
        class_id: classId,
        status: 'booked'
      }]);

      if (error) throw error;

      toast.success("Class booked successfully!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Hello, {profile?.full_name || 'Member'}!</h2>
          <p className="text-muted-foreground">Manage your fitness schedule and bookings.</p>
        </div>
        <Badge variant={profile?.memberInfo?.payment_status === 'paid' ? 'default' : 'destructive'} className="text-sm py-1 px-4">
          Status: {profile?.memberInfo?.payment_status?.toUpperCase() || 'PENDING'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.memberInfo?.membership_type?.replace('_', ' ') || 'None'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myBookings.length > 0 ? myBookings[0].classes.name : 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Available Classes
          </h3>
          <div className="grid gap-4">
            {availableClasses.map((cls) => {
              const isBooked = myBookings.some(b => b.class_id === cls.id);
              const isFull = cls.bookings.length >= cls.max_capacity;
              
              return (
                <Card key={cls.id} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <h4 className="font-bold text-lg">{cls.name}</h4>
                        <Badge variant="outline" className="text-[10px]">{cls.class_type}</Badge>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 capitalize"><Calendar className="h-3 w-3" /> {cls.day_of_week}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {cls.start_time.slice(0, 5)}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {cls.coaches?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="text-sm font-medium">{cls.bookings.length} / {cls.max_capacity}</p>
                      </div>
                      <Button 
                        disabled={isBooked || isFull || bookingId === cls.id}
                        onClick={() => handleBook(cls.id)}
                        className="min-w-[120px]"
                      >
                        {bookingId === cls.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                         isBooked ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Booked</> : 
                         isFull ? "Full" : "Book Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">My Schedule</h3>
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted/30 p-8 rounded-xl text-center">You haven't booked any classes yet.</p>
            ) : (
              myBookings.map((booking) => (
                <div key={booking.id} className="p-4 border rounded-xl bg-card space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold">{booking.classes.name}</p>
                    <Badge variant="secondary" className="text-[10px] capitalize">{booking.classes.day_of_week}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {booking.classes.start_time.slice(0, 5)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}