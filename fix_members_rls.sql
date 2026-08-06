    -- ============================================================
    -- FIX RLS POLICY UNTUK TABEL MEMBERS
    -- Jalankan script ini di SQL Editor Supabase Anda
    -- ============================================================

    -- Izinkan anon (publik yang belum login) untuk memasukkan data ke tabel members
    -- Ini diperlukan karena saat mendaftar (sign up), status user di client masih anon
    -- sebelum session benar-benar terbentuk.

    DROP POLICY IF EXISTS "Public can insert members" ON public.members;
    CREATE POLICY "Public can insert members"
    ON public.members FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

    -- (Opsional) Memastikan user hanya bisa mengedit datanya sendiri jika sudah login
    DROP POLICY IF EXISTS "Users can update their own member data" ON public.members;
    CREATE POLICY "Users can update their own member data"
    ON public.members FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());
