# Prompt untuk AI — Integrasi DOKU Payment Gateway + WhatsApp Notification

Salin seluruh teks di bawah ini dan kirimkan ke AI di project Gym Anda.

---

## PROMPT (COPY MULAI DARI SINI)

---

Saya ingin mengintegrasikan **DOKU Jokul Checkout (Payment Gateway)** dan **Notifikasi WhatsApp otomatis via Fonnte** ke dalam project Next.js ini. Berikut adalah semua detail teknisnya yang sudah saya gunakan dan terbukti berhasil di project lain.

---

### 🔑 KREDENSIAL & ENV VARIABLES

Tambahkan variabel-variabel berikut ke file `.env.local`:

```env
# DOKU API Keys (Production)
DOKU_CLIENT_ID=BRN-0297-1774183671760
DOKU_SECRET_KEY=SK-XbC2LJ7sJvkIdxcpFgn9
DOKU_ENVIRONMENT=production

# Notifikasi WhatsApp (Fonnte.com)
FONNTE_TOKEN=DVhvD2eSiTi1dmoA3ATK

# URL website production (untuk callback DOKU)
NEXT_PUBLIC_SITE_URL=https://www.sebranghills.web.id
```

> Catatan: `DOKU_ENVIRONMENT` diisi `production` untuk live, atau `sandbox` untuk testing.

---

### 🏗️ YANG PERLU DIBUAT

Tolong buatkan implementasi lengkap berikut, sesuaikan dengan konteks project Gym ini:

#### 1. API Route: `/app/api/payment/doku/route.ts`

Buat endpoint POST yang:
- Menerima `bookingId` dari frontend (atau nama ID yang sesuai di project ini).
- Mengambil data booking dari database (nama pelanggan, email, nomor HP, total harga).
- Men-generate **HMAC-SHA256 Signature** DOKU dengan komponen: `Client-Id`, `Request-Id`, `Request-Timestamp`, `Request-Target`, `Digest`.
- Memanggil DOKU Checkout API:
  - **Production URL:** `https://api.doku.com/checkout/v1/payment`
  - **Sandbox URL:** `https://api-sandbox.doku.com/checkout/v1/payment`
- Request body ke DOKU:
  ```json
  {
    "order": {
      "amount": 150000,
      "invoice_number": "ID-BOOKING-MAX-32-CHARS",
      "currency": "IDR",
      "callback_url": "https://domain-anda.com/success-payment"
    },
    "payment": { "payment_due_date": 60 },
    "customer": {
      "id": "email@pelanggan.com",
      "name": "Nama Pelanggan",
      "email": "email@pelanggan.com",
      "phone": "08xxxxxxxxxx"
    }
  }
  ```
- Setelah mendapat `payment_url` dari DOKU, update status booking menjadi `pending_payment` di database.
- Kembalikan `{ payment_url: "..." }` ke frontend.
- Jika kredensial DOKU belum diset, kembalikan dummy URL agar tidak error saat development.

#### 2. API Route: `/app/api/payment/doku/webhook/route.ts`

Buat endpoint POST yang:
- Menerima callback dari DOKU saat pembayaran selesai.
- Membaca body sebagai **text** (bukan JSON langsung) untuk keperluan verifikasi signature.
- Memverifikasi HMAC-SHA256 signature dari header DOKU (`Client-Id`, `Request-Id`, `Request-Timestamp`, `Signature`).
- Jika `payload.transaction.status === 'SUCCESS'`:
  1. Update status booking di database menjadi `paid`.
  2. Ambil data booking (nama, email, HP, total, detail lainnya) dengan `.select()`.
  3. Panggil fungsi `sendWhatsAppNotification()` dari helper notifications.
- Selalu kembalikan `{ message: 'OK' }` dengan status 200 agar DOKU tidak retry.

#### 3. Helper Notifications: `/lib/notifications.ts`

Buat file helper dengan fungsi berikut:

**`sendEmailNotification(data)`** — menggunakan Nodemailer (install: `npm install nodemailer @types/nodemailer --legacy-peer-deps`):
- SMTP config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` dari env.
- Kirim email HTML profesional berisi detail booking/invoice ke email pelanggan.
- Gunakan try/catch dan skip jika SMTP belum dikonfigurasi.

**`sendWhatsAppNotification(data)`** — menggunakan Fonnte API (`https://api.fonnte.com/send`):
- Format nomor HP: jika diawali `0`, ganti menjadi `62` (contoh: `0812` → `62812`).
- Kirim pesan WhatsApp berformat **invoice profesional** menggunakan format berikut:

```
╔══════════════════════════╗
✅  *PEMBAYARAN BERHASIL*
╚══════════════════════════╝

🏋️ *[NAMA GYM ANDA]*
_Gym & Fitness Center_

──────────────────────────
📋 *INVOICE RESMI*
──────────────────────────
No. Invoice   : *INV-XXXXXXXX*
Tanggal       : [tanggal sekarang format Indonesia]
Status        : ✅ *LUNAS*

──────────────────────────
👤 *DATA MEMBER*
──────────────────────────
Nama          : *[nama pelanggan]*
Email         : [email]
No. HP        : [nomor hp]

──────────────────────────
🎯 *DETAIL BOOKING*
──────────────────────────
Paket         : *[nama paket/kelas]*
Tanggal       : [tanggal booking]
Durasi        : *[durasi]*

──────────────────────────
💰 *RINCIAN PEMBAYARAN*
──────────────────────────
Total Tagihan : *Rp xxx.xxx*
Metode Bayar  : DOKU Payment Gateway
Status        : ✅ *TERBAYAR*

──────────────────────────
Terima kasih, *[nama]*! 🙏

Selamat berlatih bersama kami!

📞 *Hubungi Kami:*
WhatsApp: +62xxxxxxxxxx

_[Nama Gym] · Gym & Fitness Center_
══════════════════════════
```

- Gunakan `typing: 'true'` dan `delay: '2'` pada request Fonnte untuk efek lebih natural.
- Gunakan try/catch dan log error jika gagal, namun jangan throw error agar tidak memblokir webhook response.

#### 4. Halaman Sukses: `/app/success-payment/page.tsx`

Buat halaman Server Component dengan desain premium:
- Background gradient hijau (`from-green-50 to-emerald-50`).
- Ikon centang besar dengan animasi `animate-ping` ring.
- Judul: **"Pembayaran Berhasil! 🎉"**
- Banner yang menampilkan 2 ikon: **WhatsApp** (warna #25D366) dan **Gmail** (warna merah) dengan teks "Kami telah mengirimkan detail booking ke nomor HP dan email Anda".
- Tombol "Kembali ke Beranda".

#### 5. Update Frontend (Form Booking)

Di komponen form booking, setelah data berhasil disimpan ke database:
1. Panggil `POST /api/payment/doku` dengan body `{ bookingId: data.id }`.
2. Jika response berhasil dan ada `payment_url`, lakukan redirect: `window.location.href = result.payment_url`.
3. Jika gagal mendapat URL (DOKU belum dikonfigurasi), tampilkan halaman sukses statis sebagai fallback.
4. Jangan lupa set `callback_url` di DOKU API route ke `/success-payment`.

---

### ⚙️ CARA KERJA SISTEM (FLOW LENGKAP)

```
Pelanggan isi form → Data disimpan ke DB (status: pending)
    → Panggil /api/payment/doku
    → Redirect ke halaman DOKU Checkout
    → Pelanggan bayar
    → DOKU kirim webhook ke /api/payment/doku/webhook
    → Status DB diupdate menjadi "paid"
    → WA Invoice dikirim otomatis ke HP pelanggan
    → Pelanggan di-redirect ke /success-payment
```

---

### 📦 PACKAGE YANG DIBUTUHKAN

```bash
npm install nodemailer --legacy-peer-deps
npm install -D @types/nodemailer --legacy-peer-deps
```

---

### ⚠️ CATATAN PENTING

1. **Fonnte** — Pastikan nomor WhatsApp pengirim sudah di-connect/scan QR di dashboard fonnte.com sebelum testing.
2. **DOKU Webhook** — Setelah deploy, daftarkan URL webhook di dashboard DOKU: `https://domain-anda.com/api/payment/doku/webhook` di bagian **Payment Notification URL**.
3. **Invoice Number** — DOKU membatasi `invoice_number` maksimal **32 karakter**. Gunakan `.substring(0, 32)` jika menggunakan UUID.
4. **Signature DOKU** — Komponen signature harus diurutkan persis: `Client-Id → Request-Id → Request-Timestamp → Request-Target → Digest`, dipisahkan dengan `\n`.
5. **Webhook harus return 200** — Selalu kembalikan status 200 ke DOKU meski ada error internal, agar DOKU tidak terus-menerus mengirim ulang request webhook.

---

## SELESAI. TEMPELKAN PROMPT INI KE AI PROJECT GYM ANDA.
