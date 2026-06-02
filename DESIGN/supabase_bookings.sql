-- ============================================================
-- DE GYM BALI — BOOKINGS TABLE
-- Jalankan di Supabase SQL Editor
-- ============================================================

create table if not exists public.bookings (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text,
    phone text not null,
    membership_type text check (membership_type in ('Basic', 'Premium', 'Elite')) not null,
    start_date date,
    message text,
    status text check (status in ('Baru', 'Dikonfirmasi', 'Dibatalkan')) default 'Baru',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger auto-update
drop trigger if exists set_bookings_updated_at on public.bookings;

-- RLS
alter table public.bookings enable row level security;

-- Public bisa insert (booking dari website)
drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
on public.bookings for insert
with check (true);

-- Hanya authenticated yang bisa read & manage
drop policy if exists "Authenticated can manage bookings" on public.bookings;
create policy "Authenticated can manage bookings"
on public.bookings for all
to authenticated
using (true)
with check (true);

-- Index
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at desc);

-- Tambah setting webhook Google Sheets ke site_settings (jika belum ada)
insert into public.site_settings (key, value)
values ('google_sheets_webhook_url', '')
on conflict (key) do nothing;
