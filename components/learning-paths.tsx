import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  GraduationCap,
  Layers,
  Mic,
  ShieldCheck,
  Sparkles,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

type Path = {
  category: string;
  label: string;
  description: string;
  count: string;
  icon: typeof BookOpen;
  size: "lg" | "md" | "sm";
};

const PATHS: Path[] = [
  {
    category: "QURAN",
    label: "Quran",
    description:
      "From first letters to fluent recitation — pace your journey with adult-friendly teachers.",
    count: "84 courses · 96 Ustaz",
    icon: BookOpen,
    size: "lg",
  },
  {
    category: "TAJWEED",
    label: "Tajweed",
    description: "Articulation, pronunciation, and the rules of beautiful recitation.",
    count: "42 courses",
    icon: Mic,
    size: "md",
  },
  {
    category: "ARABIC",
    label: "Arabic",
    description: "Classical & Modern Standard Arabic, structured for working adults.",
    count: "37 courses",
    icon: Compass,
    size: "md",
  },
  {
    category: "TAFSIR",
    label: "Tafsir",
    description: "Discussion-led understanding of meaning, context, and application.",
    count: "21 courses",
    icon: Layers,
    size: "sm",
  },
  {
    category: "HIFZ",
    label: "Hifz",
    description: "Memorization plans with revision rhythms that respect your week.",
    count: "18 courses",
    icon: Sparkles,
    size: "sm",
  },
  {
    category: "FIQH",
    label: "Fiqh",
    description: "Practical jurisprudence for daily life and worship.",
    count: "24 courses",
    icon: ShieldCheck,
    size: "sm",
  },
  {
    category: "AQEEDAH",
    label: "Aqeedah",
    description: "Foundations of belief, taught with clarity and dignity.",
    count: "15 courses",
    icon: GraduationCap,
    size: "sm",
  },
];

function PathCard({ p }: { p: Path }) {
  const Icon = p.icon;
  const wide = p.size === "lg";
  return (
    <Link
      href="#"
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-card ${
        wide ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
        style={{ background: "color-mix(in oklab, #C6A75E 30%, transparent)" }}
      />
      <div className="flex items-start justify-between">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {p.category}
        </span>
      </div>

      <div className={wide ? "mt-12 lg:mt-24" : "mt-10"}>
        <h3
          className={`font-display font-semibold leading-tight tracking-tight ${
            wide ? "text-3xl sm:text-4xl" : "text-xl"
          }`}
        >
          {p.label}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {p.description}
        </p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{p.count}</span>
          <span className="inline-flex items-center gap-1 text-foreground transition-transform group-hover:translate-x-1">
            Explore
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function LearningPaths() {
  return (
    <section id="paths" className="relative bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Learning paths"
            title="Seven disciplines, one structured journey."
            description="Every path is built as a sequence of modules and lessons — readings, video, live sessions, and quizzes — with clear progress and certificates on completion."
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px]">
          {PATHS.map((p) => (
            <PathCard key={p.label} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
