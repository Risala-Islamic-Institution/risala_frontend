import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Star,
  Verified,
} from "@/components/icons";
import { GeometricPattern } from "@/components/geometric-pattern";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 85% -10%, color-mix(in oklab, #C6A75E 12%, transparent), transparent 60%), radial-gradient(900px 500px at -10% 10%, color-mix(in oklab, #0F3D2E 8%, transparent), transparent 60%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.35]">
        <GeometricPattern />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20">
        {/* Left: editorial copy */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
            <span
              aria-hidden
              className="relative inline-flex h-2 w-2"
            >
              <span className="absolute inset-0 rounded-full bg-[color:var(--success)] animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--success)]" />
            </span>
            Live availability · {`27`} Ustaz online now
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Islamic knowledge,
            <span className="block text-primary">on your schedule.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg">
            Risala connects working adult learners with verified Ustaz for
            Quran, Tajweed, Arabic, Tafsir and more — with live availability,
            structured progress, and dignified booking that fits your week.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#live"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0b2e22]"
            >
              See who&apos;s available now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#ustaz"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Teach on Risala
            </Link>
          </div>

          {/* Inline trust strip */}
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Verified Ustaz
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                240+
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Languages
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                12
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                Sessions / week
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                4.1k
              </dd>
            </div>
          </dl>
        </div>

        {/* Right: layered preview */}
        <div className="relative lg:col-span-5">
          <div className="relative">
            {/* Decorative photo plate */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-elevated">
              <Image
                src="/images/hero-stillife.jpg"
                alt="An open Quran with elegant Arabic calligraphy on a warm pearl-white surface"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 40%, rgba(28,31,38,0.55) 100%)",
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                <p className="font-display text-sm tracking-wide opacity-85">
                  &ldquo;Read! In the name of your Lord who created.&rdquo;
                </p>
                <p className="text-xs opacity-70">— Surah Al-&apos;Alaq 96:1</p>
              </div>
            </div>

            {/* Floating live mini-card */}
            <div className="pointer-events-none absolute -left-4 -bottom-6 w-[88%] sm:-left-8 sm:w-[78%] lg:-left-16">
              <div className="pointer-events-auto rounded-xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src="/images/teacher-1.jpg"
                      alt="Ustaz Yusuf al-Hassan"
                      fill
                      sizes="48px"
                      className="rounded-full object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 -right-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card"
                    >
                      <span className="block h-2 w-2 rounded-full bg-[color:var(--success)] animate-pulse-ring" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold leading-tight">
                        Ustaz Yusuf al-Hassan
                      </p>
                      <Verified className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      Tajweed · Qira&apos;ah
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 text-accent" />
                      <span className="tabular-nums font-medium">4.9</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">247 students</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Today
                  </span>
                  <span className="rounded-full bg-[color:var(--success)]/10 px-1.5 py-0.5 font-medium text-[color:var(--success)]">
                    4 slots open
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1.5">
                  {[
                    { l: "13:00", s: "taken" },
                    { l: "14:00", s: "open" },
                    { l: "15:00", s: "open" },
                    { l: "16:00", s: "held" },
                    { l: "17:00", s: "open" },
                  ].map((c) => (
                    <span
                      key={c.l}
                      className={`flex h-8 items-center justify-center rounded-md text-[11px] font-medium tabular-nums border ${
                        c.s === "open"
                          ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/8 text-[color:var(--success)]"
                          : c.s === "held"
                            ? "border-[color:var(--warning)]/45 bg-[color:var(--warning)]/12 text-[#8a6326]"
                            : "border-border bg-muted text-muted-foreground line-through decoration-foreground/30"
                      }`}
                    >
                      {c.l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
