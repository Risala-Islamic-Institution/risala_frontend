import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Globe,
  Star,
  Users,
  Verified,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

type Card = {
  name: string;
  honorific: "Ustaz" | "Ustaza";
  specialization: string;
  level: string;
  languages: string;
  rate: number;
  rating: number;
  students: number;
  verified: boolean;
  online: boolean;
  available: string;
  avatar: string;
  tags: string[];
};

const TEACHERS: Card[] = [
  {
    name: "Yusuf al-Hassan",
    honorific: "Ustaz",
    specialization: "Tajweed & Qira'ah",
    level: "All levels · 8 yrs",
    languages: "English · Arabic",
    rate: 24,
    rating: 4.9,
    students: 247,
    verified: true,
    online: true,
    available: "5 slots today",
    avatar: "/images/teacher-1.jpg",
    tags: ["Tajweed", "Hifz coaching", "Beginner-friendly"],
  },
  {
    name: "Aisha Bint Saeed",
    honorific: "Ustaza",
    specialization: "Quran for Adult Beginners",
    level: "Beginner · 6 yrs",
    languages: "English · Somali",
    rate: 22,
    rating: 4.8,
    students: 312,
    verified: true,
    online: true,
    available: "3 slots today",
    avatar: "/images/teacher-2.jpg",
    tags: ["Adult learners", "Patient pacing", "Women-only"],
  },
  {
    name: "Khalid ar-Rashid",
    honorific: "Ustaz",
    specialization: "Arabic & Tafsir",
    level: "Intermediate · 12 yrs",
    languages: "English · Arabic",
    rate: 28,
    rating: 5.0,
    students: 89,
    verified: true,
    online: false,
    available: "Tomorrow · 6 slots",
    avatar: "/images/teacher-3.jpg",
    tags: ["Classical Arabic", "Tafsir", "Discussion-led"],
  },
];

function TeacherCard({ t }: { t: Card }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-elevated">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={t.avatar}
          alt={`${t.honorific} ${t.name}`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, rgba(28,31,38,0.55) 100%)",
          }}
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {t.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-card/90 px-2 py-1 text-[11px] font-medium text-foreground backdrop-blur">
              <Verified className="h-3.5 w-3.5 text-accent" /> Verified
            </span>
          )}
          {t.online && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-2 py-1 text-[11px] font-medium text-foreground backdrop-blur">
              <span
                aria-hidden
                className="relative inline-flex h-2 w-2"
              >
                <span className="absolute inset-0 rounded-full bg-[color:var(--success)] animate-pulse-ring" />
                <span className="relative h-2 w-2 rounded-full bg-[color:var(--success)]" />
              </span>
              Online
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-semibold leading-tight">
              {t.honorific} {t.name}
            </h3>
            <p className="truncate text-sm opacity-90">{t.specialization}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-medium tabular-nums">{t.rating.toFixed(1)}</span>
            </div>
            <p className="text-[11px] opacity-80">{t.students} students</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <dl className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Level</dt>
            <dd className="mt-0.5 font-medium">{t.level}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Languages</dt>
            <dd className="mt-0.5 truncate font-medium">{t.languages}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Rate</dt>
            <dd className="mt-0.5 font-medium tabular-nums">${t.rate}/hr</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5">
          {t.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground/80"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            {t.available}
          </span>
          <Link
            href="#live"
            className="group/btn inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            View profile
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TeacherMarketplace() {
  return (
    <section id="teachers" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Curated marketplace"
            title="Verified Ustaz, chosen with care."
            description="Browse credentialed teachers by specialization, language, and live availability. Every Ustaz on Risala is identity-verified with documented qualifications."
          />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {["All", "Quran", "Tajweed", "Arabic", "Tafsir", "Hifz"].map(
              (label, idx) => (
                <button
                  key={label}
                  type="button"
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    idx === 0
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TEACHERS.map((t) => (
            <TeacherCard key={t.name} t={t} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/40 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <Users className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="font-medium">240+ verified Ustaz across 12 languages</p>
              <p className="text-sm text-muted-foreground">
                Filter by specialization, schedule, and verification status.
              </p>
            </div>
          </div>
          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Browse the directory
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
