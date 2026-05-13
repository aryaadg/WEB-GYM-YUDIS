import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${extension}`;

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // --- Mode 1: Supabase Storage (Production / jika service key tersedia) ---
    if (serviceKey && serviceKey !== 'GANTI_DENGAN_SERVICE_ROLE_KEY_ANDA' && supabaseUrl) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseAdmin = createClient(supabaseUrl, serviceKey);

      const storagePath = `cars/${fileName}`;
      const { error } = await supabaseAdmin.storage
        .from('car-images')
        .upload(storagePath, buffer, { contentType: file.type, upsert: false });

      if (error) {
        console.error('Supabase Storage error:', error.message);
        return NextResponse.json({ error: 'Gagal upload ke Supabase Storage: ' + error.message }, { status: 500 });
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('car-images')
        .getPublicUrl(storagePath);

      return NextResponse.json({ url: publicUrl });
    }

    // --- Mode 2: Local Filesystem (Development) ---
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cars');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/cars/${fileName}`;
    console.log('[Upload] Saved locally:', publicUrl);

    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error('[Upload] Unexpected error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Gagal mengupload file: ' + message }, { status: 500 });
  }
}
