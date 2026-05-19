import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yudis-gym.vercel.app"),

  title: {
    default: "DE GYM BALI — Premium Fitness & Training Center",
    template: "%s | DE GYM BALI",
  },
  description:
    "DE GYM BALI adalah pusat kebugaran premium dengan peralatan modern, pelatih berpengalaman, dan program latihan yang disesuaikan dengan kebutuhan Anda. Bergabunglah sekarang dan raih tubuh impian Anda.",
  keywords: [
    "gym indonesia",
    "fitness center",
    "personal trainer",
    "program latihan",
    "pusat kebugaran",
    "DE GYM BALI",
    "membership gym",
    "kelas fitness",
  ],
  authors: [{ name: "DE GYM BALI" }],
  creator: "DE GYM BALI",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://yudis-gym.vercel.app",
    siteName: "DE GYM BALI",
    title: "DE GYM BALI — Premium Fitness & Training Center",
    description:
      "Pusat kebugaran premium dengan peralatan modern, pelatih profesional, dan komunitas yang mendukung perjalanan fitness Anda.",
    images: [{ url: "/icon.png", width: 1200, height: 630, alt: "DE GYM BALI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DE GYM BALI — Premium Fitness & Training Center",
    description: "Pusat kebugaran premium untuk semua level.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a]`}>
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
