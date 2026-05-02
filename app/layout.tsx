import type { Metadata } from "next";
import { Cairo, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
/* new design
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
*/
});

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
/* new design
  display: "swap",
  */
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
/* new design
    default: "Risala — Islamic Knowledge & Skills, on your schedule",
    template: "%s · Risala",
  },
  description:
    "A premium Islamic learning marketplace connecting working adult learners with verified Ustaz for Quran, Tajweed, Arabic and more — with live availability and disciplined scheduling.",
  keywords: [
    "Islamic learning",
    "Quran teacher",
    "Tajweed",
    "Arabic",
    "Tafsir",
    "Ustaz",
    "Online Madrasa",
  ],
  authors: [{ name: "Risala Islamic Knowledge & Skills PLC" }],
  openGraph: {
    title: "Risala — Islamic Knowledge & Skills, on your schedule",
    description:
      "Verified Ustaz, live availability, flexible booking. Learn the Quran with discipline and dignity.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F3D2E",
  width: "device-width",
  initialScale: 1,
*/
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${cairo.variable} antialiased`}>

    {/* <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} bg-background`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased"> */}


        {children}
      </body>
    </html>
  );
}
