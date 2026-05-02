import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { label: "Browse Ustaz", href: "#teachers" },
      { label: "Live availability", href: "#live" },
      { label: "Learning paths", href: "#paths" },
      { label: "Certificates", href: "#" },
    ],
  },
  {
    title: "Teach",
    links: [
      { label: "Apply to teach", href: "#ustaz" },
      { label: "Teacher dashboard", href: "#" },
      { label: "Course studio", href: "#" },
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
    <footer
      className="relative pt-16 text-primary-foreground"
      style={{
        background:
          "linear-gradient(180deg, #1c1f26 0%, #15171c 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <BrandMark variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              A premium Islamic learning marketplace built for working adults
              and verified Ustaz. Learn the Quran with discipline and dignity.
            </p>
            <p className="mt-6 text-xs text-primary-foreground/50">
              Risala Islamic Knowledge & Skills PLC
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Risala. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/50">
            Built with care · Bismillāh.
          </p>
        </div>
      </div>
    </footer>
  );
}
