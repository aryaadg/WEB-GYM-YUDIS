-- ============================================================
-- DE GYM BALI — MASTER DATABASE SETUP SCRIPT
-- Jalankan script INI SAJA di Supabase SQL Editor (New Project)
-- Menggabungkan: supabase_setup.sql + supabase_bookings.sql + supabase_settings.sql
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- 2. TABLES
-- ============================================================

-- Tabel Members (Data Member Gym)
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Trainers (Data Trainer)
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

-- Tabel Articles / Blog
create table if not exists public.articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text unique not null,
    category text check (category in ('Tips Latihan', 'Nutrisi', 'Recovery', 'Yoga', 'Tips Gym', 'Motivasi', 'Lainnya')) default 'Lainnya',
    excerpt text,
    content text,
    cover_image_url text,
    author_name text default 'Admin DE GYM BALI',
    read_time_minutes integer default 5,
    is_published boolean default false,
    published_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Bookings (Pendaftaran dari Website)
create table if not exists public.bookings (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text,
    phone text not null,
    membership_type text check (membership_type in ('Basic', 'Premium', 'Elite')) not null,
    start_date date,
    message text,
    status text check (status in ('Baru', 'Dikonfirmasi', 'Dibatalkan', 'pending_payment', 'paid')) default 'Baru',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabel Site Settings (Pengaturan Website)
create table if not exists public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ============================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at untuk semua tabel
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger untuk members
drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at
before update on public.members
for each row
execute function public.handle_updated_at();

-- Trigger untuk trainers
drop trigger if exists set_trainers_updated_at on public.trainers;
create trigger set_trainers_updated_at
before update on public.trainers
for each row
execute function public.handle_updated_at();

-- Trigger untuk articles
drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.handle_updated_at();

-- Trigger untuk site_settings
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.handle_updated_at();


-- ============================================================
-- 4. RLS POLICIES (Row Level Security)
-- ============================================================

-- Enable RLS pada semua tabel
alter table public.members enable row level security;
alter table public.trainers enable row level security;
alter table public.articles enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;

-- MEMBERS: Hanya admin (authenticated) yang bisa CRUD
drop policy if exists "Authenticated users can manage members" on public.members;
create policy "Authenticated users can manage members"
on public.members for all
to authenticated
using (true)
with check (true);

-- TRAINERS: Public bisa READ (untuk tampil di homepage/coaches), admin bisa CRUD
drop policy if exists "Public can view active trainers" on public.trainers;
create policy "Public can view active trainers"
on public.trainers for select
using (is_active = true);

drop policy if exists "Authenticated users can manage trainers" on public.trainers;
create policy "Authenticated users can manage trainers"
on public.trainers for all
to authenticated
using (true)
with check (true);

-- ARTICLES: Public bisa READ artikel yang sudah dipublish, admin bisa CRUD
drop policy if exists "Public can view published articles" on public.articles;
create policy "Public can view published articles"
on public.articles for select
using (is_published = true);

drop policy if exists "Authenticated users can manage articles" on public.articles;
create policy "Authenticated users can manage articles"
on public.articles for all
to authenticated
using (true)
with check (true);

-- BOOKINGS: Public bisa INSERT (booking dari website), admin bisa CRUD
drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
on public.bookings for insert
with check (true);

drop policy if exists "Authenticated can manage bookings" on public.bookings;
create policy "Authenticated can manage bookings"
on public.bookings for all
to authenticated
using (true)
with check (true);

-- SITE SETTINGS: Public bisa READ, admin bisa CRUD
drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
on public.site_settings for select
using (true);

drop policy if exists "Authenticated can manage settings" on public.site_settings;
create policy "Authenticated can manage settings"
on public.site_settings for all
to authenticated
using (true)
with check (true);


-- ============================================================
-- 5. INDEXES (untuk performa query)
-- ============================================================
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_membership_type on public.members(membership_type);
create index if not exists idx_members_membership_end on public.members(membership_end);
create index if not exists idx_trainers_active on public.trainers(is_active);
create index if not exists idx_articles_published on public.articles(is_published);
create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at desc);


-- ============================================================
-- 6. DEFAULT DATA — SITE SETTINGS
-- ============================================================
insert into public.site_settings (key, value) values
  ('gym_name',                 'DE GYM BALI'),
  ('gym_tagline',              'Unleash Your Potential'),
  ('gym_description',          'Pusat kebugaran premium dengan peralatan world-class, pelatih ahli, dan komunitas yang mendorong hasil nyata.'),
  ('gym_address',              'Jl. Fitness No. 1, Jakarta Selatan'),
  ('gym_whatsapp',             '6281338332112'),
  ('gym_email',                'info@degymbali.com'),
  ('gym_instagram',            'https://instagram.com/degymbali'),
  ('gym_facebook',             ''),
  ('gym_tiktok',               ''),
  ('gym_youtube',              ''),
  ('jam_senin_jumat',          '05:00 - 23:00'),
  ('jam_sabtu',                '06:00 - 22:00'),
  ('jam_minggu',               '07:00 - 21:00'),
  ('maps_embed_url',           ''),
  ('hero_image_url',           'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'),
  ('stat_luas',                '2000+'),
  ('stat_trainer',             '25+'),
  ('stat_kelas',               '50+'),
  ('stat_mesin',               '150+'),
  ('membership_basic_price',   '299000'),
  ('membership_premium_price', '499000'),
  ('membership_elite_price',   '899000'),
  ('google_sheets_webhook_url','')
on conflict (key) do nothing;


-- ============================================================
-- 7. SAMPLE DATA — TRAINERS (Opsional untuk testing)
-- ============================================================
insert into public.trainers (full_name, email, phone, specialty, experience_years, certifications, bio, is_active)
values
  ('Andi Prasetyo', 'andi@degymbali.com', '081234567890', 'Strength & Conditioning', 8,
   ARRAY['NSCA-CSCS', 'CPT ACE', 'Nutrition Coach'],
   'Spesialis strength training dengan pengalaman 8 tahun melatih lebih dari 300 atlet.', true),

  ('Sari Dewi', 'sari@degymbali.com', '081234567891', 'Yoga & Pilates', 6,
   ARRAY['RYT-500 Yoga Alliance', 'PMA-CPT Pilates'],
   'Instruktur yoga dan pilates bersertifikat internasional, fokus pada keseimbangan fisik dan mental.', true),

  ('Budi Santoso', 'budi@degymbali.com', '081234567892', 'HIIT & Cardio', 5,
   ARRAY['ACE Group Fitness', 'TRX Certified'],
   'Spesialis HIIT dan kelas cardio yang energetik dan memotivasi.', true)
on conflict (email) do nothing;


-- ============================================================
-- 8. SAMPLE DATA — ARTICLES (Opsional untuk testing)
-- ============================================================
insert into public.articles (title, slug, category, excerpt, author_name, read_time_minutes, is_published, published_at)
values
  ('5 Latihan HIIT Terbaik untuk Pemula', '5-latihan-hiit-terbaik', 'Tips Latihan',
   'High-Intensity Interval Training yang efektif membakar lemak dan meningkatkan stamina dalam waktu singkat.',
   'Admin DE GYM BALI', 5, true, now()),

  ('Protein: Berapa Kebutuhan Harian Anda?', 'kebutuhan-protein-harian', 'Nutrisi',
   'Protein adalah nutrisi paling penting untuk pembentukan otot. Pelajari cara menghitung kebutuhan protein harian Anda.',
   'Admin DE GYM BALI', 4, true, now()),

  ('Kenapa Tidur Cukup Sama Pentingnya dengan Latihan', 'pentingnya-tidur-untuk-fitness', 'Recovery',
   'Banyak orang mengabaikan pentingnya tidur dalam perjalanan fitness mereka. Pelajari hubungannya.',
   'Admin DE GYM BALI', 6, true, now())
on conflict (slug) do nothing;


-- ============================================================
-- SELESAI!
-- ============================================================
-- LANGKAH SELANJUTNYA:
-- 1. Buat Supabase project baru di https://supabase.com
-- 2. Copy URL dan Anon Key dari Settings > API
-- 3. Update file .env.local dengan URL dan Key baru
-- 4. Jalankan script ini di Supabase SQL Editor
-- 5. Buat user admin: Authentication > Users > Add User
-- ============================================================
