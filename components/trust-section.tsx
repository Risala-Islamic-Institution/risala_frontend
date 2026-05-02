import Image from "next/image";
import { Quote, Star } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const STORIES = [
  {
    quote:
      "I tried two other Quran apps before Risala. The difference is the Ustaz: structured, patient, and respectful of my schedule as a working parent.",
    name: "Hafsa M.",
    role: "Software engineer · London",
    rating: 5,
    avatar: "/images/teacher-2.jpg",
  },
  {
    quote:
      "Live availability is the killer feature. I can see who is online right now and book a Tajweed session before bed without any back-and-forth on WhatsApp.",
    name: "Omar T.",
    role: "Adult Quran beginner · Toronto",
    rating: 5,
    avatar: "/images/teacher-3.jpg",
  },
  {
    quote:
      "As an Ustaz, the approval flow keeps me in control. I no longer chase missed payments or coordinate calendars manually. The dashboard is calm.",
    name: "Ustaz Y. al-Hassan",
    role: "Tajweed specialist · 247 students",
    rating: 5,
    avatar: "/images/teacher-1.jpg",
  },
];

export function TrustSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What learners & teachers say"
          title="Built for trust. Used with discipline."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STORIES.map((s) => (
            <figure
              key={s.name}
              className="relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-card"
            >
              <Quote className="h-6 w-6 text-accent" aria-hidden />
              <blockquote className="font-display text-lg leading-snug text-foreground/90">
                {`\u201C${s.quote}\u201D`}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={s.avatar}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.role}
                  </p>
                </div>
                <div
                  className="ml-auto inline-flex items-center gap-0.5"
                  aria-label={`${s.rating} out of 5 stars`}
                >
                  {Array.from({ length: s.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-accent" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
