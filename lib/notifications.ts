import nodemailer from 'nodemailer';

// ============================================================
// Tipe data notifikasi
// ============================================================
export interface BookingNotificationData {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  membership_type: 'Basic' | 'Premium' | 'Elite';
  start_date: string | null;
  created_at: string;
}

// Mapping harga paket
const PRICE_MAP: Record<string, number> = {
  Basic: 299000,
  Premium: 499000,
  Elite: 899000,
};

// Format harga Rupiah
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

// Format tanggal Indonesia
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Belum ditentukan';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format nomor HP ke format internasional (62xxx)
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1);
  }
  return cleaned;
}

// ============================================================
// WhatsApp Notification via Fonnte
// ============================================================
export async function sendWhatsAppNotification(data: BookingNotificationData): Promise<void> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn('[Fonnte] FONNTE_TOKEN tidak diset, skip WA notification.');
    return;
  }

  const price = PRICE_MAP[data.membership_type] ?? 0;
  const invoiceNo = `INV-${data.id.substring(0, 8).toUpperCase()}`;
  const tanggalBayar = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const tanggalMulai = formatDate(data.start_date);
  const formattedPhone = formatPhone(data.phone);

  const message =
    `╔══════════════════════════╗\n` +
    `✅  *PEMBAYARAN BERHASIL*\n` +
    `╚══════════════════════════╝\n\n` +
    `🏋️ *DE GYM BALI*\n` +
    `_Gym & Fitness Center Premium_\n\n` +
    `──────────────────────────\n` +
    `📋 *INVOICE RESMI*\n` +
    `──────────────────────────\n` +
    `No. Invoice   : *${invoiceNo}*\n` +
    `Tanggal       : ${tanggalBayar}\n` +
    `Status        : ✅ *LUNAS*\n\n` +
    `──────────────────────────\n` +
    `👤 *DATA MEMBER*\n` +
    `──────────────────────────\n` +
    `Nama          : *${data.full_name}*\n` +
    `Email         : ${data.email || '-'}\n` +
    `No. HP        : ${data.phone}\n\n` +
    `──────────────────────────\n` +
    `🎯 *DETAIL MEMBERSHIP*\n` +
    `──────────────────────────\n` +
    `Paket         : *${data.membership_type} Membership*\n` +
    `Mulai Aktif   : ${tanggalMulai}\n` +
    `Durasi        : *1 Bulan*\n\n` +
    `──────────────────────────\n` +
    `💰 *RINCIAN PEMBAYARAN*\n` +
    `──────────────────────────\n` +
    `Total Tagihan : *Rp ${formatRupiah(price)}*\n` +
    `Metode Bayar  : DOKU Payment Gateway\n` +
    `Status        : ✅ *TERBAYAR*\n\n` +
    `──────────────────────────\n` +
    `Terima kasih, *${data.full_name}*! 🙏\n\n` +
    `Selamat berlatih bersama kami!\n` +
    `Sampai jumpa di DE GYM BALI 💪\n\n` +
    `📞 *Hubungi Kami:*\n` +
    `WhatsApp: +62 813-3833-2112\n\n` +
    `_DE GYM BALI · Gym & Fitness Center Premium_\n` +
    `══════════════════════════`;

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: formattedPhone,
        message,
        typing: 'true',
        delay: '2',
      }),
    });

    const result = await res.json();
    if (!result.status) {
      console.error('[Fonnte] Gagal kirim WA:', result);
    } else {
      console.log('[Fonnte] WA terkirim ke', formattedPhone);
    }
  } catch (err) {
    console.error('[Fonnte] Error kirim WA notification:', err);
    // Jangan throw — jangan blokir webhook response
  }
}

// ============================================================
// Email Notification via Nodemailer
// ============================================================
export async function sendEmailNotification(data: BookingNotificationData): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !data.email) {
    console.warn('[Email] SMTP belum dikonfigurasi atau email kosong, skip.');
    return;
  }

  const price = PRICE_MAP[data.membership_type] ?? 0;
  const invoiceNo = `INV-${data.id.substring(0, 8).toUpperCase()}`;

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port || '587'),
    secure: port === '465',
    auth: { user, pass },
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; }
        .header { background: #c8ff00; padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: #000; font-size: 24px; }
        .body { padding: 30px; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { color: #666; font-size: 14px; }
        .value { font-weight: bold; font-size: 14px; }
        .total { background: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px; }
        .total .amount { font-size: 28px; font-weight: 900; color: #000; }
        .footer { background: #111; color: #888; text-align: center; padding: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pembayaran Berhasil!</h1>
          <p style="margin:5px 0 0;color:#333;">DE GYM BALI — Gym & Fitness Center Premium</p>
        </div>
        <div class="body">
          <h2 style="margin-top:0;">Invoice ${invoiceNo}</h2>
          <div class="row"><span class="label">Nama</span><span class="value">${data.full_name}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${data.email}</span></div>
          <div class="row"><span class="label">No. HP</span><span class="value">${data.phone}</span></div>
          <div class="row"><span class="label">Paket</span><span class="value">${data.membership_type} Membership</span></div>
          <div class="row"><span class="label">Mulai Aktif</span><span class="value">${formatDate(data.start_date)}</span></div>
          <div class="row"><span class="label">Status Pembayaran</span><span class="value" style="color:green;">✅ LUNAS</span></div>
          <div class="total">
            <div class="label">Total Dibayarkan</div>
            <div class="amount">Rp ${formatRupiah(price)}</div>
          </div>
          <p style="color:#666;font-size:13px;margin-top:20px;">
            Terima kasih telah bergabung dengan DE GYM BALI! 💪<br/>
            Tunjukkan email ini saat check-in pertama kali.
          </p>
        </div>
        <div class="footer">DE GYM BALI &bull; Gym & Fitness Center Premium<br/>WhatsApp: +62 813-3833-2112</div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"DE GYM BALI" <${user}>`,
      to: data.email,
      subject: `✅ Pembayaran Berhasil — ${invoiceNo} | DE GYM BALI`,
      html: htmlBody,
    });
    console.log('[Email] Invoice terkirim ke', data.email);
  } catch (err) {
    console.error('[Email] Gagal kirim email:', err);
  }
}
