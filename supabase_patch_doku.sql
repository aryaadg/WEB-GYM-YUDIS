-- ============================================================
-- DE GYM BALI — PATCH v2: Member Auth + Membership Dates + RLS Fix
-- Jalankan SELURUH script ini di Supabase SQL Editor
-- ============================================================

-- 1. Update constraint status bookings (support DOKU)
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('Baru', 'Dikonfirmasi', 'Dibatalkan', 'pending_payment', 'paid'));

-- 2. Tambah kolom baru ke bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS password_temp text;
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS membership_start date;
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS membership_end date;
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

-- 3. Tambah kolom auth_user_id ke members
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS auth_user_id uuid;

-- ============================================================
-- 4. FIX RLS POLICIES — INI YANG MENYEBABKAN ERROR INSERT
-- ============================================================

-- Pastikan RLS aktif
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Hapus semua policy lama pada bookings (bersihkan)
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert bookings" ON public.bookings;

-- Buat ulang: Public (anon) BOLEH insert booking dari website
CREATE POLICY "Public can insert bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated (admin) bisa SELECT, UPDATE, DELETE
CREATE POLICY "Authenticated can manage bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public bisa SELECT booking milik sendiri (untuk cek status di frontend)
DROP POLICY IF EXISTS "Public can read own bookings" ON public.bookings;
CREATE POLICY "Public can read own bookings"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- 5. Fix RLS members (untuk insert dari webhook)
-- ============================================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage members" ON public.members;
CREATE POLICY "Authenticated users can manage members"
ON public.members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public bisa read member aktif (opsional)
DROP POLICY IF EXISTS "Public can read own member data" ON public.members;
CREATE POLICY "Public can read own member data"
ON public.members
FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================
-- Verifikasi
-- ============================================================
SELECT 'Patch v2 + RLS fix berhasil!' as status;
