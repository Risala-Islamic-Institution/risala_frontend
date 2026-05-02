import type { Metadata } from "next";
import { Cairo, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Risala',
    default: 'Risala - Master Your Learning',
  },
  description: "The premium platform for connecting students with expert teachers. Learn efficiently, track progress, and achieve your goals with Risala.",
  keywords: ["education", "learning", "tutors", "risala", "online classes"],
  authors: [{ name: "Risala Team" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://risala.com',
    siteName: 'Risala',
    title: 'Risala - Master Your Learning',
    description: "Connect with expert teachers and master new skills.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Risala Learning Platform',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
