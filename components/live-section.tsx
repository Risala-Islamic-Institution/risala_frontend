import { LiveAvailabilityBoard } from "@/components/live-availability-board";
import { SectionHeading } from "@/components/section-heading";

export function LiveSection() {
  return (
    <section
      id="live"
      className="relative py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, #0F3D2E 4%, var(--background)) 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Live availability"
            title="A living timetable, not a static schedule."
            description="Slots reveal themselves as Ustaz come online and other learners book. Held, taken, and expired states change visibly so you always see the real picture."
          />
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Legend swatch="bg-[color:var(--success)]/10 border-[color:var(--success)]/35" label="Open" />
            <Legend swatch="bg-[color:var(--warning)]/12 border-[color:var(--warning)]/45" label="Held" />
            <Legend swatch="bg-muted border-border" label="Taken" />
          </div>
        </div>

        <div className="mt-10">
          <LiveAvailabilityBoard />
        </div>
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3.5 w-6 rounded border ${swatch}`} aria-hidden />
      {label}
    </span>
  );
}
