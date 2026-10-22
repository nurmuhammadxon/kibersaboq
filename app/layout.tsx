import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import SessionWarning from "@/components/auth/session-warning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiberSaboq: kiberxavfsizlik ta'limi",
  description: "Xodimlarni fishing, parol va zararli fayllardan saqlanishga o'rgatadigan kiberxavfsizlik ta'lim platformasi. Kurslar, testlar va sertifikatlar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <SessionWarning />
          {children}
        </Providers>
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}