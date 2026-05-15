-- ============================================================
-- YUDIS GYM — SITE SETTINGS TABLE
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

create table if not exists public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    key text unique not null,
    value text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger auto-update
drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.handle_updated_at();

-- RLS
alter table public.site_settings enable row level security;

-- Public bisa read settings
drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
on public.site_settings for select
using (true);

-- Hanya authenticated yang bisa update
drop policy if exists "Authenticated can manage settings" on public.site_settings;
create policy "Authenticated can manage settings"
on public.site_settings for all
to authenticated
using (true)
with check (true);

-- ============================================================
-- Default Settings (Insert)
-- ============================================================
insert into public.site_settings (key, value) values
  ('gym_name',          'YUDIS GYM'),
  ('gym_tagline',       'Unleash Your Potential'),
  ('gym_description',   'Pusat kebugaran premium dengan peralatan world-class, pelatih ahli, dan komunitas yang mendorong hasil nyata.'),
  ('gym_address',       'Jl. Fitness No. 1, Jakarta Selatan'),
  ('gym_whatsapp',      '6281234567890'),
  ('gym_email',         'info@yudisgym.com'),
  ('gym_instagram',     'https://instagram.com/yudisgym'),
  ('gym_facebook',      ''),
  ('gym_tiktok',        ''),
  ('gym_youtube',       ''),
  ('jam_senin_jumat',   '05:00 - 23:00'),
  ('jam_sabtu',         '06:00 - 22:00'),
  ('jam_minggu',        '07:00 - 21:00'),
  ('maps_embed_url',    ''),
  ('hero_image_url',    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'),
  ('stat_luas',         '2000+'),
  ('stat_trainer',      '25+'),
  ('stat_kelas',        '50+'),
  ('stat_mesin',        '150+'),
  ('membership_basic_price',   '299000'),
  ('membership_premium_price', '499000'),
  ('membership_elite_price',   '899000')
on conflict (key) do nothing;
