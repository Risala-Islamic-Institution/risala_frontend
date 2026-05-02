import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export function FinalCTA() {
  return (
    <section className="relative pb-20 pt-12 sm:pb-28 sm:pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 border-t border-border pt-12 sm:pt-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Begin your journey
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Read in the name of your Lord — at the pace your life allows.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
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
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
