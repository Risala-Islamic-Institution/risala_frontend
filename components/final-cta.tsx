import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12 lg:p-16"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, #0F3D2E 6%, var(--background)) 0%, var(--background) 60%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #C6A75E, transparent 70%)" }}
          />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Begin your journey
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
                Read in the name of your Lord — at the pace your life allows.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/70">
                Create a free account, browse verified Ustaz, and request your
                first session in minutes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0b2e22]"
              >
                Create your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
