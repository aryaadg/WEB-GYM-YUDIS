-- ============================================================
-- DE GYM BALI — FEATURE: CLASS BOOKING & QR CODE
-- ============================================================

-- 1. Tabel Classes (Jadwal Kelas)
create table if not exists public.classes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    trainer_id uuid references public.trainers(id) on delete set null,
    schedule_time timestamp with time zone not null,
    duration_minutes integer default 60,
    capacity integer not null default 10,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Class Bookings (Pemesanan Kelas oleh Member)
create table if not exists public.class_bookings (
    id uuid default uuid_generate_v4() primary key,
    class_id uuid references public.classes(id) on delete cascade not null,
    member_id uuid references public.members(id) on delete cascade not null,
    status text check (status in ('Booked', 'Cancelled', 'Attended')) default 'Booked',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(class_id, member_id) -- Mencegah member membooking kelas yang sama dua kali
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- CLASSES: Public bisa read aktif, Authenticated (Admin) bisa manage
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active classes" ON public.classes;
CREATE POLICY "Public can read active classes"
ON public.classes FOR SELECT
TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can manage classes" ON public.classes;
CREATE POLICY "Authenticated can manage classes"
ON public.classes FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- CLASS BOOKINGS: Authenticated member bisa insert dan read punya sendiri, Admin bisa semua
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view their own bookings" ON public.class_bookings;
CREATE POLICY "Members can view their own bookings"
ON public.class_bookings FOR SELECT
TO authenticated
USING (member_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Members can book classes" ON public.class_bookings;
CREATE POLICY "Members can book classes"
ON public.class_bookings FOR INSERT
TO authenticated
WITH CHECK (member_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Members can cancel classes" ON public.class_bookings;
CREATE POLICY "Members can cancel classes"
ON public.class_bookings FOR UPDATE
TO authenticated
USING (member_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid()))
WITH CHECK (status = 'Cancelled');

DROP POLICY IF EXISTS "Admin can manage all class bookings" ON public.class_bookings;
CREATE POLICY "Admin can manage all class bookings"
ON public.class_bookings FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- UPDATES TO EXISTING TABLES
-- ============================================================
-- Kita perlu memastikan members_id terkait dengan tabel users (Auth) untuk QR code dan login
-- Kolom auth_user_id sudah ada di public.members berdasarkan setup sebelumnya.
-- Kita tambahkan kolom qr_code (opsional, jika ingin menyimpan token unik khusus QR)
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS qr_code text unique default uuid_generate_v4()::text;
