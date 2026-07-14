import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/src/components/providers";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Track System",
  description: "Sistema de rastreamento de entregas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-slate-100 text-slate-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
