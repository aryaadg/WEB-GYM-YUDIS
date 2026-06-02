import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran Berhasil — DE GYM BALI',
  description: 'Pembayaran membership DE GYM BALI berhasil. Akun member Anda sudah aktif.',
};

export default function SuccessPaymentPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center space-y-8">

        {/* Animated Check Icon */}
        <div className="relative flex items-center justify-center mx-auto w-28 h-28">
          <span className="absolute inline-flex w-full h-full rounded-full bg-green-500 opacity-20 animate-ping" />
          <span className="absolute inline-flex w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40" />
          <div className="relative z-10 w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Judul */}
        <div className="space-y-3">
          <p className="text-green-400 font-black tracking-widest text-sm uppercase">
            Transaksi Sukses
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
            PEMBAYARAN<br />
            <span className="text-green-400">BERHASIL!</span> 🎉
          </h1>
          <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
            Selamat bergabung dengan <strong className="text-white">DE GYM BALI</strong>!
            Akun member Anda telah aktif selama <strong className="text-primary">30 hari</strong>.
          </p>
        </div>

        {/* Notifikasi Banner */}
        <div className="bg-[#111111] border border-white/10 p-5 space-y-4 text-left">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest text-center">
            Sudah Dikirimkan
          </p>

          {/* WhatsApp */}
          <div className="flex items-center gap-4 bg-green-500/5 border border-green-500/20 p-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#25D366' }}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Invoice WhatsApp</p>
              <p className="text-gray-400 text-xs mt-0.5">Invoice dikirim otomatis ke nomor HP Anda</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 p-4">
            <div className="w-11 h-11 rounded-full bg-[#EA4335] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Konfirmasi Email</p>
              <p className="text-gray-400 text-xs mt-0.5">Detail invoice dikirim ke email Anda</p>
            </div>
          </div>
        </div>

        {/* Info akun */}
        <div className="bg-primary/5 border border-primary/20 p-5 text-left space-y-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Akun Member Anda</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            ✅ Akun sudah terdaftar dengan email dan password yang Anda isi saat pendaftaran.
            Login ke portal member untuk melihat status dan sisa hari membership Anda.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          {/* PRIMARY: Lanjut Login */}
          <Link
            href="/member/login"
            className="w-full bg-primary text-black font-black text-sm py-4 text-center tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            LANJUT LOGIN MEMBER
          </Link>

          {/* SECONDARY: Kembali ke beranda */}
          <Link
            href="/"
            className="w-full bg-white/5 border border-white/10 text-white font-bold text-sm py-4 text-center hover:bg-white/10 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <p className="text-gray-600 text-xs">
          Butuh bantuan?{' '}
          <a
            href="https://wa.me/6281338332112"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Hubungi kami via WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
