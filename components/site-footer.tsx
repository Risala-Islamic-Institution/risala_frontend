import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { label: "Browse Ustaz", href: "/#teachers" },
      { label: "Live availability", href: "/#live" },
      { label: "Learning paths", href: "/#paths" },
      { label: "Certificates", href: "#" },
    ],
  },
  {
    title: "Teach",
    links: [
      { label: "Apply to teach", href: "/register?role=ustaz" },
      { label: "Teacher dashboard", href: "/dashboard/ustaz" },
      { label: "Course studio", href: "/dashboard/ustaz" },
      { label: "Verification", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Risala", href: "#" },
      { label: "Our principles", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Help center", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Refund policy", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-secondary text-secondary-foreground">
      {/* Hairline gold accent across the top */}
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, #C6A75E 65%, transparent) 50%, transparent 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <BrandMark variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-secondary-foreground/75">
              A premium Islamic learning marketplace built for working adults
              and verified Ustaz. Learn the Quran with discipline and dignity.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-secondary-foreground/55">
              Risala Islamic Knowledge & Skills PLC
              <br />
              Established with niyyah · Built with care
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-secondary-foreground/80 transition-colors hover:text-secondary-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-secondary-foreground/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-secondary-foreground/65">
            © {new Date().getFullYear()} Risala. All rights reserved.
          </p>
          <p className="text-xs text-secondary-foreground/55">
            Bismillāh · بِسْمِ اللَّهِ
          </p>
        </div>
      </div>
    </footer>
  );
}
