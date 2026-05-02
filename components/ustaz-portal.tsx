import Link from "next/link";
import { ArrowRight, Bell, Calendar, GraduationCap, Verified } from "@/components/icons";
import { GeometricPattern } from "@/components/geometric-pattern";
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
      className="relative overflow-hidden py-20 text-primary-foreground sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, #0F3D2E 0%, #0a2920 100%)",
      }}
    >
      <div aria-hidden className="absolute inset-0 opacity-60">
        <GeometricPattern variant="dark" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="For Ustaz"
              title="A command center for serious teachers."
              description="Risala respects your time. Approve requests with intent, manage availability per timezone, publish structured courses, and answer student questions — all from a single calm workspace."
              invert
            />

            <ul className="mt-8 space-y-3 text-primary-foreground/85">
              {[
                "Verified profile with documented qualifications",
                "Weekly recurring availability with timezone awareness",
                "Approve or decline requests with one decisive action",
                "Publish modules, lessons, quizzes, announcements",
                "Stripe-powered payouts on every confirmed package",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm">
                  <Verified className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register?role=ustaz"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-secondary transition-colors hover:bg-[#b89651]"
              >
                Apply to teach
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10"
              >
                See teacher flow
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-accent/20 bg-secondary/50 p-3 shadow-elevated backdrop-blur sm:p-4">
              {/* Top bar */}
              <div className="flex items-center justify-between rounded-lg bg-secondary/80 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--success)]" />
                  Teacher workspace · Asia/Riyadh
                </div>
                <span className="text-xs text-primary-foreground/60">
                  Today · {`12 sessions`}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                {PANELS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.label}
                      className="rounded-xl border border-primary-foreground/10 bg-secondary/70 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                          <Icon className="h-3.5 w-3.5 text-accent" />
                          {p.label}
                        </div>
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          {p.badge}
                        </span>
                      </div>
                      <ul className="space-y-2.5">
                        {p.items.map((it) => (
                          <li
                            key={it.name}
                            className="flex items-start justify-between gap-3 rounded-md border border-primary-foreground/5 bg-primary-foreground/[0.03] px-3 py-2.5 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-medium text-primary-foreground">
                                {it.name}
                              </p>
                              <p className="truncate text-primary-foreground/60">
                                {it.text}
                              </p>
                            </div>
                            <span
                              className={`mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full ${
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
