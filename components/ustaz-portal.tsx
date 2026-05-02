import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Calendar,
  GraduationCap,
  Verified,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const PANELS = [
  {
    label: "Booking inbox",
    icon: Bell,
    badge: "3 new",
    items: [
      { name: "Hafsa M.", text: "Tue 14:00 · Tajweed · 8 weeks", state: "new" },
      { name: "Omar T.", text: "Wed 17:00 · Quran · single", state: "new" },
      { name: "Ibrahim K.", text: "Thu 19:00 · Hifz · 12 weeks", state: "new" },
    ],
  },
  {
    label: "This week",
    icon: Calendar,
    badge: "12 sessions",
    items: [
      { name: "Mon", text: "3 confirmed · 1 pending", state: "ok" },
      { name: "Tue", text: "4 confirmed", state: "ok" },
      { name: "Wed", text: "2 confirmed", state: "ok" },
    ],
  },
  {
    label: "Course studio",
    icon: GraduationCap,
    badge: "2 drafts",
    items: [
      { name: "Tajweed essentials", text: "Module 4 · 6 lessons", state: "ok" },
      { name: "Reading Surah Al-Baqarah", text: "Published · 24 enrolled", state: "ok" },
      { name: "Adult Quran starter", text: "Draft · 2 modules", state: "warn" },
    ],
  },
];

export function UstazPortal() {
  return (
    <section
      id="ustaz"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      {/* Soft primary-tinted backdrop — no longer full-bleed dark */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, #0F3D2E 6%, var(--background)) 60%, var(--background) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="For Ustaz"
              title="A command center for serious teachers."
              description="Risala respects your time. Approve requests with intent, manage availability per timezone, publish structured courses, and answer student questions — all from a single calm workspace."
            />

            <ul className="mt-8 space-y-3">
              {[
                "Verified profile with documented qualifications",
                "Weekly recurring availability with timezone awareness",
                "Approve or decline requests with one decisive action",
                "Publish modules, lessons, quizzes, announcements",
                "Stripe-powered payouts on every confirmed package",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80"
                >
                  <Verified className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register?role=ustaz"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0b2e22]"
              >
                Apply to teach
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                See teacher flow
              </Link>
            </div>
          </div>

          {/* Workspace preview — dark green panel as a focal moment, not a section */}
          <div className="lg:col-span-7">
            <div
              className="overflow-hidden rounded-2xl border border-border shadow-elevated"
              style={{
                background:
                  "linear-gradient(180deg, #0F3D2E 0%, #0a2920 100%)",
              }}
            >
              {/* Top chrome */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
                  Teacher workspace · Asia/Riyadh
                </div>
                <span className="text-xs text-white/65">
                  Today · 12 sessions
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-3 md:p-4">
                {PANELS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.label}
                      className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                          <Icon className="h-3.5 w-3.5 text-accent" />
                          {p.label}
                        </div>
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          {p.badge}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {p.items.map((it) => (
                          <li
                            key={it.name}
                            className="flex items-start justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {it.name}
                              </p>
                              <p className="mt-0.5 truncate text-white/65">
                                {it.text}
                              </p>
                            </div>
                            <span
                              className={`mt-1 inline-flex h-2 w-2 shrink-0 rounded-full ${
                                it.state === "new"
                                  ? "bg-accent animate-pulse-dot"
                                  : it.state === "warn"
                                    ? "bg-[color:var(--warning)]"
                                    : "bg-[color:var(--success)]"
                              }`}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
