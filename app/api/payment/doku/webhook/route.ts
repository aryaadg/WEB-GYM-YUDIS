import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppNotification } from '@/lib/notifications';

// Anon client untuk query bookings
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client (service role) untuk create auth user
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || serviceKey === 'ISI_DENGAN_SERVICE_ROLE_KEY_DARI_SUPABASE') {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  // SELALU return 200 agar DOKU tidak retry
  try {
    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;

    // Baca body sebagai TEXT untuk verifikasi signature
    const rawBody = await req.text();

    // Ambil header DOKU
    const incomingClientId = req.headers.get('Client-Id') || '';
    const requestId = req.headers.get('Request-Id') || '';
    const requestTimestamp = req.headers.get('Request-Timestamp') || '';
    const incomingSignature = req.headers.get('Signature') || '';

    // Verifikasi HMAC-SHA256 Signature
    if (secretKey && clientId && incomingSignature) {
      const digest = 'SHA-256=' + crypto
        .createHash('sha256')
        .update(rawBody)
        .digest('base64');

      const signatureComponents = [
        `Client-Id:${incomingClientId}`,
        `Request-Id:${requestId}`,
        `Request-Timestamp:${requestTimestamp}`,
        `Request-Target:/api/payment/doku/webhook`,
        `Digest:${digest}`,
      ].join('\n');

      const expectedSignature = 'HMACSHA256=' + crypto
        .createHmac('sha256', secretKey)
        .update(signatureComponents)
        .digest('base64');

      if (incomingSignature !== expectedSignature) {
        console.error('[DOKU Webhook] Signature tidak valid!');
        return NextResponse.json({ message: 'OK' }, { status: 200 });
      }
    }

    // Parse payload
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('[DOKU Webhook] Body bukan JSON valid');
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    console.log('[DOKU Webhook] Payload:', JSON.stringify(payload, null, 2));

    // Cek status transaksi
    const transaction = payload?.transaction as Record<string, unknown> | undefined;
    const order = payload?.order as Record<string, unknown> | undefined;
    const transactionStatus = transaction?.status as string | undefined;

    if (transactionStatus !== 'SUCCESS') {
      console.log('[DOKU Webhook] Status bukan SUCCESS:', transactionStatus);
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    // Cari booking berdasarkan invoice_number
    const invoiceNumber = order?.invoice_number as string | undefined;
    if (!invoiceNumber) {
      console.error('[DOKU Webhook] Tidak ada invoice_number');
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    // Cari semua booking pending_payment, match by invoice number
    const strippedId = invoiceNumber.replace('GYM', '');

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'pending_payment');

    const booking = bookings?.find(b => {
      const strippedBookingId = b.id.replace(/-/g, '');
      return ('GYM' + strippedBookingId).substring(0, 32) === invoiceNumber ||
             strippedBookingId.startsWith(strippedId.substring(0, 20));
    });

    if (!booking) {
      console.error('[DOKU Webhook] Booking tidak ditemukan untuk invoice:', invoiceNumber);
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    // Hitung tanggal membership (30 hari dari sekarang)
    const today = new Date();
    const membershipStart = today.toISOString().split('T')[0];
    const membershipEnd = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];

    // ============================================================
    // 1. Update status booking → paid + set membership dates
    // ============================================================
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'paid',
        membership_start: membershipStart,
        membership_end: membershipEnd,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('[DOKU Webhook] Gagal update booking status:', updateError);
    } else {
      console.log('[DOKU Webhook] Booking', booking.id, '→ paid ✅');
    }

    // ============================================================
    // 2. Buat Supabase Auth User (jika service role tersedia)
    // ============================================================
    const adminClient = getAdminClient();
    let authUserId: string | null = null;

    if (adminClient && booking.email && booking.password_temp) {
      try {
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
          email: booking.email,
          password: booking.password_temp,
          email_confirm: true, // langsung konfirmasi tanpa perlu verifikasi email
          user_metadata: {
            full_name: booking.full_name,
            phone: booking.phone,
            membership_type: booking.membership_type,
          },
        });

        if (authError) {
          // Jika email sudah ada, coba update password
          if (authError.message?.includes('already') || authError.message?.includes('duplicate')) {
            console.log('[Auth] Email sudah ada, skip create user');
            // Cari user existing
            const { data: existingUsers } = await adminClient.auth.admin.listUsers();
            const existing = existingUsers?.users?.find(u => u.email === booking.email);
            if (existing) authUserId = existing.id;
          } else {
            console.error('[Auth] Gagal buat auth user:', authError.message);
          }
        } else {
          authUserId = authData.user?.id || null;
          console.log('[Auth] User dibuat:', booking.email, '— ID:', authUserId);
        }
      } catch (authErr) {
        console.error('[Auth] Error:', authErr);
      }
    } else if (!adminClient) {
      console.warn('[Auth] SUPABASE_SERVICE_ROLE_KEY belum diset — skip create auth user');
    }

    // ============================================================
    // 3. Insert ke tabel members
    // ============================================================
    if (adminClient) {
      try {
        const memberPayload: Record<string, unknown> = {
          full_name: booking.full_name,
          email: booking.email,
          phone: booking.phone,
          membership_type: booking.membership_type,
          membership_start: membershipStart,
          membership_end: membershipEnd,
          status: 'Aktif',
        };
        if (authUserId) memberPayload.auth_user_id = authUserId;

        const { error: memberError } = await adminClient
          .from('members')
          .upsert(memberPayload, { onConflict: 'email' });

        if (memberError) {
          console.error('[Member] Gagal insert member:', memberError.message);
        } else {
          console.log('[Member] Member berhasil dibuat/update ✅');
        }
      } catch (memberErr) {
        console.error('[Member] Error:', memberErr);
      }

      // 4. Hapus password_temp dari bookings (security)
      await adminClient
        .from('bookings')
        .update({ password_temp: null, auth_user_id: authUserId })
        .eq('id', booking.id);
    }

    // ============================================================
    // 5. Kirim notifikasi WhatsApp via Fonnte
    // ============================================================
    await sendWhatsAppNotification({
      id: booking.id,
      full_name: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      membership_type: booking.membership_type,
      start_date: membershipStart,
      created_at: booking.created_at,
    });

    return NextResponse.json({ message: 'OK' }, { status: 200 });

  } catch (err) {
    console.error('[DOKU Webhook] Unexpected error:', err);
    return NextResponse.json({ message: 'OK' }, { status: 200 });
  }
}
