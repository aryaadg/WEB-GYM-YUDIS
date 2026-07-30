-- ============================================================
-- DE GYM BALI — COMPLETE SETUP untuk Supabase Project Baru
-- Jalankan SELURUH script ini di Supabase SQL Editor
-- Project: xbkrqlggaqutviskgqek
-- ============================================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Tabel Members
create table if not exists public.members (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text unique,
    phone text,
    gender text check (gender in ('Pria', 'Wanita')) default 'Pria',
    date_of_birth date,
    address text,
    membership_type text check (membership_type in ('Basic', 'Premium', 'Elite')) default 'Basic',
    membership_start date default current_date,
    membership_end date,
    status text check (status in ('Aktif', 'Tidak Aktif', 'Expired')) default 'Aktif',
    photo_url text,
    notes text,
    auth_user_id uuid,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Trainers
create table if not exists public.trainers (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text unique,
    phone text,
    specialty text not null,
    experience_years integer default 1,
    certifications text[],
    bio text,
    photo_url text,
    instagram_url text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Articles
create table if not exists public.articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text unique not null,
    content text,
    excerpt text,
    cover_image_url text,
    author text default 'Admin',
    category text default 'Tips Fitness',
    tags text[],
    is_published boolean default false,
    published_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Bookings (dengan semua kolom DOKU)
create table if not exists public.bookings (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text,
    phone text,
    membership_type text check (membership_type in ('Basic', 'Premium', 'Elite')) default 'Basic',
    message text,
    status text check (status in ('Baru', 'Dikonfirmasi', 'Dibatalkan', 'pending_payment', 'paid')) default 'Baru',
    password_temp text,
    membership_start date,
    membership_end date,
    auth_user_id uuid,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Site Settings
create table if not exists public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value text,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- BOOKINGS: public bisa insert, authenticated bisa semua
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings"
ON public.bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can manage bookings" ON public.bookings;
CREATE POLICY "Authenticated can manage bookings"
ON public.bookings FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read bookings" ON public.bookings;
CREATE POLICY "Public can read bookings"
ON public.bookings FOR SELECT
TO anon, authenticated
USING (true);

-- MEMBERS: authenticated bisa semua, public bisa read
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage members" ON public.members;
CREATE POLICY "Authenticated can manage members"
ON public.members FOR ALL
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read members" ON public.members;
CREATE POLICY "Public can read members"
ON public.members FOR SELECT
TO anon, authenticated
USING (true);

-- TRAINERS: public bisa read
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read trainers" ON public.trainers;
CREATE POLICY "Public can read trainers"
ON public.trainers FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can manage trainers" ON public.trainers;
CREATE POLICY "Authenticated can manage trainers"
ON public.trainers FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- ARTICLES: public bisa read published
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles"
ON public.articles FOR SELECT
TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated can manage articles" ON public.articles;
CREATE POLICY "Authenticated can manage articles"
ON public.articles FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- SITE_SETTINGS: public bisa read
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can manage site settings" ON public.site_settings;
CREATE POLICY "Authenticated can manage site settings"
ON public.site_settings FOR ALL
TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- DEFAULT DATA
-- ============================================================
INSERT INTO public.site_settings (key, value, description) VALUES
  ('gym_name', 'DE GYM BALI', 'Nama Gym'),
  ('gym_address', 'Bali, Indonesia', 'Alamat Gym'),
  ('gym_phone', '6281338332112', 'Nomor WhatsApp'),
  ('gym_email', 'degymbali@gmail.com', 'Email Gym'),
  ('google_sheets_webhook_url', '', 'URL Google Sheets Webhook')
ON CONFLICT (key) DO NOTHING;

SELECT 'DE GYM BALI Database Setup Complete!' as status;
