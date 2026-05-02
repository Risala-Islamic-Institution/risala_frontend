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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} bg-background`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
