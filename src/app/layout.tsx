import type { Metadata, Viewport } from 'next';
import { Sarabun } from 'next/font/google';
import './globals.css';

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sarabun',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Japan Trip Hub — ปลายทางเที่ยวญี่ปุ่นจากโตเกียว',
  description:
    'research hub ปลายทางเที่ยวญี่ปุ่นสวยๆ ที่ไปจากโตเกียวไม่ยาก — แผนที่ ค่าใช้จ่าย ช่วงเวลา จุดห้ามพลาด',
};

export const viewport: Viewport = {
  themeColor: '#1d4d6b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
