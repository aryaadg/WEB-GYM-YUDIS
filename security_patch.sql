-- ============================================================
-- 🛡️ PATCH KEAMANAN TOTAL: ROLE-BASED ACCESS CONTROL (RBAC) 🛡️
-- ============================================================
-- Jalankan seluruh script ini di menu SQL Editor Supabase Anda.

-- 1. Buat Tabel Admins untuk mendaftarkan email admin yang sah
CREATE TABLE IF NOT EXISTS public.admins (
    id uuid default uuid_generate_v4() primary key,
    email text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Buat Fungsi Keamanan (Security Definer) untuk mengecek apakah user yang login adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Cek apakah email user yang sedang login terdaftar di tabel admins
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = (auth.jwt() ->> 'email')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. PERBAIKAN RLS (ROW LEVEL SECURITY) PADA TABEL MEMBERS
-- ============================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Hapus aturan lama yang tidak aman
DROP POLICY IF EXISTS "Authenticated can manage members" ON public.members;
DROP POLICY IF EXISTS "Public can read members" ON public.members;

-- Aturan Baru Members:
-- a. Admin bisa melihat dan mengubah semua data member
CREATE POLICY "Admins can manage all members" ON public.members
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- b. Member HANYA bisa melihat dan mengubah datanya SENDIRI
CREATE POLICY "Members can manage their own data" ON public.members
FOR ALL TO authenticated 
USING (auth_user_id = auth.uid()) 
WITH CHECK (auth_user_id = auth.uid());

-- c. Publik (Anonim) BISA INSERT saat pertama kali mendaftar di halaman /join
CREATE POLICY "Public can insert member during signup" ON public.members
FOR INSERT TO anon, authenticated
WITH CHECK (true); 


-- ============================================================
-- 4. PERBAIKAN RLS PADA TABEL CLASSES (JADWAL KELAS)
-- ============================================================
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Hapus aturan lama
DROP POLICY IF EXISTS "Public can read active classes" ON public.classes;
DROP POLICY IF EXISTS "Authenticated can manage classes" ON public.classes;

-- Aturan Baru Classes:
-- a. Admin bisa menambah, mengedit, dan menghapus kelas
CREATE POLICY "Admins can manage classes" ON public.classes
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- b. Semua orang (termasuk yang belum login) hanya boleh MELIHAT kelas yang aktif
CREATE POLICY "Anyone can read active classes" ON public.classes
FOR SELECT TO anon, authenticated USING (is_active = true);


-- ============================================================
-- 5. PERBAIKAN RLS PADA TABEL CLASS BOOKINGS
-- ============================================================
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

-- Hapus aturan lama yang bocor
DROP POLICY IF EXISTS "Members can view their own bookings" ON public.class_bookings;
DROP POLICY IF EXISTS "Members can book classes" ON public.class_bookings;
DROP POLICY IF EXISTS "Members can cancel classes" ON public.class_bookings;
DROP POLICY IF EXISTS "Admin can manage all class bookings" ON public.class_bookings;

-- Aturan Baru Bookings:
-- a. Admin bisa melihat dan memanipulasi semua booking
CREATE POLICY "Admins can manage all bookings" ON public.class_bookings
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- b. Member HANYA bisa melihat booking miliknya sendiri
CREATE POLICY "Members can view their own bookings" ON public.class_bookings
FOR SELECT TO authenticated
USING (member_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid()));

-- c. Member HANYA bisa membuat booking untuk dirinya sendiri
CREATE POLICY "Members can create their own bookings" ON public.class_bookings
FOR INSERT TO authenticated
WITH CHECK (member_id IN (SELECT id FROM public.members WHERE auth_user_id = auth.uid()));

-- ============================================================
-- 6. PERBAIKAN RLS PADA TABEL TRAINERS
-- ============================================================
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active trainers" ON public.trainers;
DROP POLICY IF EXISTS "Authenticated can manage trainers" ON public.trainers;

CREATE POLICY "Admins can manage trainers" ON public.trainers
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Anyone can read active trainers" ON public.trainers
FOR SELECT TO anon, authenticated USING (is_active = true);

-- ============================================================
-- SELESAI
-- ============================================================
-- UNTUK ANDA: 
-- Jalankan perintah di bawah ini di SQL Editor Supabase!
-- Kode di bawah ini akan menjadikan 'divapattarr@gmail.com' sebagai Admin Utama.

INSERT INTO public.admins (email) VALUES ('divapattarr@gmail.com');
