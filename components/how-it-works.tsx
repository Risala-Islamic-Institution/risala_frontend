import {
  Bell,
  Calendar,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Verified,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const STUDENT_STEPS = [
  {
    icon: Calendar,
    title: "Find an Ustaz with live windows",
    body: "Filter by specialization, language, and availability. Slots update live as other students book.",
  },
  {
    icon: ShieldCheck,
    title: "Request your sessions",
    body: "Pick a one-off slot or a recurring weekly package. Your request is sent to the teacher for review.",
  },
  {
    icon: CreditCard,
    title: "Pay only after approval",
    body: "Once your Ustaz approves, complete a secure Stripe checkout. Bookings confirm automatically.",
  },
  {
    icon: GraduationCap,
    title: "Learn, progress, certify",
    body: "Track lesson progress, attempt quizzes, and earn certificates as you complete each course.",
  },
];

const TEACHER_STEPS = [
  {
    icon: Verified,
    title: "Get verified",
    body: "Submit qualifications and identity. Verification badges appear on your public profile.",
  },
  {
    icon: Calendar,
    title: "Set weekly availability",
    body: "Define recurring blocks per timezone. Risala generates the bookable slot grid for you.",
  },
  {
    icon: Bell,
    title: "Approve or decline cleanly",
    body: "Booking requests arrive in your inbox. One tap to approve, one tap to decline — with context.",
  },
  {
    icon: GraduationCap,
    title: "Build courses & answer questions",
    body: "Publish modules, lessons, and quizzes. Respond to student questions from one workspace.",
  },
];

function StepList({
  steps,
  invert = false,
}: {
  steps: typeof STUDENT_STEPS;
  invert?: boolean;
}) {
  return (
    <ol className="relative space-y-1">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        return (
          <li
            key={s.title}
            className={`relative grid grid-cols-[auto_1fr] gap-4 rounded-lg p-4 transition-colors ${
              invert ? "hover:bg-primary-foreground/5" : "hover:bg-muted/60"
            }`}
          >
            <div
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
                invert
                  ? "border-accent/30 bg-primary-foreground/5 text-accent"
                  : "border-primary/15 bg-primary/8 text-primary"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span
                className={`absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                  invert
                    ? "bg-accent text-secondary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {idx + 1}
              </span>
            </div>
            <div>
              <h4
                className={`font-display text-base font-semibold leading-tight ${
                  invert ? "text-primary-foreground" : ""
                }`}
              >
                {s.title}
              </h4>
              <p
                className={`mt-1 text-sm leading-relaxed ${
                  invert ? "text-primary-foreground/70" : "text-foreground/70"
                }`}
              >
                {s.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How Risala works"
          title="A disciplined flow for both sides of the lesson."
          description="Risala is built for adult learners and serious teachers. Every step is deliberate — request, approve, pay, learn — with no surprises."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                For students
              </span>
              <h3 className="font-display text-xl font-semibold">
                Learn on your terms
              </h3>
            </div>
            <StepList steps={STUDENT_STEPS} />
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(180deg, #0F3D2E 0%, #0b2e22 100%)",
              borderColor: "rgba(198,167,94,0.18)",
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                For Ustaz
              </span>
              <h3 className="font-display text-xl font-semibold text-primary-foreground">
                Teach with authority
              </h3>
            </div>
            <StepList steps={TEACHER_STEPS} invert />
          </div>
        </div>
      </div>
    </section>
  );
}
