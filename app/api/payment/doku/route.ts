import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Mapping harga paket membership
const PRICE_MAP: Record<string, number> = {
  Basic: 299000,
  Premium: 499000,
  Elite: 899000,
};

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId diperlukan' }, { status: 400 });
    }

    // 1. Ambil data booking dari Supabase
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, full_name, email, phone, membership_type')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('[DOKU] Booking tidak ditemukan:', fetchError);
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    if (!booking.email) {
      return NextResponse.json({ error: 'Email wajib diisi untuk pembayaran' }, { status: 400 });
    }

    const amount = PRICE_MAP[booking.membership_type] ?? 299000;

    // Auto-detect URL dari request host (berfungsi di localhost maupun production)
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = `${protocol}://${host}`;
    const callbackUrl = `${siteUrl}/success-payment`;

    // 2. Cek apakah DOKU dikonfigurasi
    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;
    const environment = process.env.DOKU_ENVIRONMENT || 'sandbox';

    if (!clientId || !secretKey) {
      console.warn('[DOKU] Kredensial belum diset');
      return NextResponse.json({ error: 'Kredensial DOKU belum dikonfigurasi' }, { status: 500 });
    }

    // 3. Siapkan request DOKU
    const requestId = crypto.randomUUID();
    // Format timestamp UTC standar yang diterima DOKU
    const requestTimestamp = new Date().toISOString().split('.')[0] + 'Z';
    const requestTarget = '/checkout/v1/payment';

    // Invoice number max 32 karakter
    const invoiceNumber = ('GYM' + bookingId.replace(/-/g, '')).substring(0, 32);

    const requestBody = {
      order: {
        amount,
        invoice_number: invoiceNumber,
        currency: 'IDR',
        callback_url: callbackUrl,
      },
      payment: {
        payment_due_date: 60,
      },
      customer: {
        id: booking.email,
        name: booking.full_name,
        email: booking.email,
        phone: booking.phone,
      },
    };

    // 4. Generate HMAC-SHA256 Signature
    const bodyString = JSON.stringify(requestBody);
    const digest = 'SHA-256=' + crypto
      .createHash('sha256')
      .update(bodyString)
      .digest('base64');

    const signatureComponents = [
      `Client-Id:${clientId}`,
      `Request-Id:${requestId}`,
      `Request-Timestamp:${requestTimestamp}`,
      `Request-Target:${requestTarget}`,
      `Digest:${digest}`,
    ].join('\n');

    const signature = 'HMACSHA256=' + crypto
      .createHmac('sha256', secretKey)
      .update(signatureComponents)
      .digest('base64');

    // 5. Hit DOKU API
    const dokuBaseUrl = environment === 'production'
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com';

    const dokuRes = await fetch(`${dokuBaseUrl}${requestTarget}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
      },
      body: bodyString,
    });

    if (!dokuRes.ok) {
      const errText = await dokuRes.text();
      console.error('[DOKU] ❌ API error:', dokuRes.status, errText);
      console.error('[DOKU] Headers sent:', { clientId, requestId, requestTimestamp, signature });
      return NextResponse.json({ error: `DOKU API Error: ${errText}` }, { status: dokuRes.status });
    }

    const dokuData = await dokuRes.json();
    const paymentUrl = dokuData?.response?.payment?.url;

    if (!paymentUrl) {
      console.error('[DOKU] Tidak ada payment_url:', JSON.stringify(dokuData));
      return NextResponse.json({ error: 'Tidak ada URL pembayaran dari DOKU' }, { status: 500 });
    }

    // 6. Update status booking ke pending_payment
    await supabase
      .from('bookings')
      .update({ status: 'pending_payment' })
      .eq('id', bookingId);

    return NextResponse.json({ payment_url: paymentUrl });

  } catch (err) {
    console.error('[DOKU] Unexpected error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
