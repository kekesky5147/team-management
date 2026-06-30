import type { Viewport } from "next";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LV Tigers",
  description: "출석 관리 및 A/B/C 팀 배정 도구",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {children}
      </body>
    </html>
  );
}
