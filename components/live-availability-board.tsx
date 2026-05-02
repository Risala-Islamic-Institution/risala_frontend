"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Globe,
  Star,
  Users,
  Verified,
} from "@/components/icons";

type SlotState = "available" | "reserved" | "taken" | "expired";

type Slot = {
  id: string;
  label: string; // e.g. "14:00"
  state: SlotState;
};

type Teacher = {
  id: string;
  name: string;
  honorific: "Ustaz" | "Ustaza";
  specialization: string;
  language: string;
  rate: number;
  rating: number;
  students: number;
  online: boolean;
  avatar: string;
  timezone: string;
  slots: Slot[];
};

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Yusuf al-Hassan",
    honorific: "Ustaz",
    specialization: "Tajweed · Qira’ah",
    language: "English · Arabic",
    rate: 24,
    rating: 4.9,
    students: 247,
    online: true,
    avatar: "/images/teacher-1.jpg",
    timezone: "GMT+3 · Riyadh",
    slots: [
      { id: "s1-1", label: "13:00", state: "taken" },
      { id: "s1-2", label: "14:00", state: "available" },
      { id: "s1-3", label: "15:00", state: "available" },
      { id: "s1-4", label: "16:00", state: "reserved" },
      { id: "s1-5", label: "17:00", state: "available" },
      { id: "s1-6", label: "18:00", state: "available" },
    ],
  },
  {
    id: "t2",
    name: "Aisha Bint Saeed",
    honorific: "Ustaza",
    specialization: "Quran · Adult Beginners",
    language: "English · Somali",
    rate: 22,
    rating: 4.8,
    students: 312,
    online: true,
    avatar: "/images/teacher-2.jpg",
    timezone: "GMT+0 · London",
    slots: [
      { id: "s2-1", label: "09:00", state: "taken" },
      { id: "s2-2", label: "10:00", state: "available" },
      { id: "s2-3", label: "11:00", state: "available" },
      { id: "s2-4", label: "12:00", state: "available" },
      { id: "s2-5", label: "13:00", state: "reserved" },
      { id: "s2-6", label: "14:00", state: "available" },
    ],
  },
  {
    id: "t3",
    name: "Khalid ar-Rashid",
    honorific: "Ustaz",
    specialization: "Arabic · Tafsir",
    language: "English · Arabic",
    rate: 28,
    rating: 5.0,
    students: 89,
    online: false,
    avatar: "/images/teacher-3.jpg",
    timezone: "GMT-5 · Toronto",
    slots: [
      { id: "s3-1", label: "16:00", state: "expired" },
      { id: "s3-2", label: "17:00", state: "available" },
      { id: "s3-3", label: "18:00", state: "available" },
      { id: "s3-4", label: "19:00", state: "reserved" },
      { id: "s3-5", label: "20:00", state: "available" },
      { id: "s3-6", label: "21:00", state: "available" },
    ],
  },
];

function formatRelative(seconds: number) {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  return `${m}m ago`;
}

function StatePill({ state }: { state: SlotState }) {
  const cfg: Record<SlotState, { label: string; cls: string }> = {
    available: {
      label: "Open",
      cls: "border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]",
    },
    reserved: {
      label: "Held",
      cls: "border-[color:var(--warning)]/40 bg-[color:var(--warning)]/15 text-[color:#8a6326]",
    },
    taken: {
      label: "Taken",
      cls: "border-border bg-muted text-muted-foreground",
    },
    expired: {
      label: "Expired",
      cls: "border-border bg-muted text-muted-foreground/70",
    },
  };
  const c = cfg[state];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

function SlotChip({ slot, justChanged }: { slot: Slot; justChanged: boolean }) {
  const base =
    "relative flex h-12 items-center justify-center rounded-md border px-2 text-sm font-medium tabular-nums transition-all";
  const styles: Record<SlotState, string> = {
    available:
      "border-[color:var(--success)]/35 bg-[color:var(--success)]/8 text-[color:var(--success)] hover:bg-[color:var(--success)]/14 cursor-pointer",
    reserved:
      "border-[color:var(--warning)]/45 bg-[color:var(--warning)]/12 text-[#8a6326]",
    taken:
      "border-border bg-muted text-muted-foreground line-through decoration-foreground/30",
    expired:
      "border-dashed border-border bg-transparent text-muted-foreground/60",
  };

  return (
    <button
      type="button"
      disabled={slot.state !== "available"}
      aria-label={`${slot.label} ${slot.state}`}
      className={`${base} ${styles[slot.state]} ${
        justChanged ? "ring-2 ring-accent/50" : ""
      }`}
    >
      <span>{slot.label}</span>
      {slot.state === "available" && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[color:var(--success)] animate-pulse-dot"
        />
      )}
      {justChanged && slot.state === "taken" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-md bg-accent/15"
        />
      )}
    </button>
  );
}

function TeacherRow({
  teacher,
  changedSlot,
}: {
  teacher: Teacher;
  changedSlot: string | null;
}) {
  const openCount = teacher.slots.filter((s) => s.state === "available").length;

  return (
    <article className="group relative grid grid-cols-1 gap-5 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card md:grid-cols-[260px_1fr]">
      {/* Identity */}
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
        <div className="relative h-16 w-16 shrink-0 md:h-20 md:w-20">
          <Image
            src={teacher.avatar}
            alt={`${teacher.honorific} ${teacher.name}`}
            fill
            sizes="80px"
            className="rounded-full object-cover"
          />
          {teacher.online && (
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-card"
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-[color:var(--success)] animate-pulse-ring" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-semibold leading-tight">
              {teacher.honorific} {teacher.name}
            </h3>
            <Verified className="h-4 w-4 text-accent" aria-label="Verified" />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {teacher.specialization}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-accent" />
              <span className="tabular-nums text-foreground/85">
                {teacher.rating.toFixed(1)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="tabular-nums">{teacher.students}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              {teacher.timezone}
            </span>
          </div>
        </div>
      </div>

      {/* Slots */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Today · next windows
            </span>
            <span className="rounded-full bg-[color:var(--success)]/10 px-2 py-0.5 font-medium text-[color:var(--success)]">
              {openCount} open
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <StatePill state="available" />
            <StatePill state="reserved" />
            <StatePill state="taken" />
          </div>
          <span className="text-xs font-medium tabular-nums text-foreground/70 sm:hidden">
            ${teacher.rate}/hr
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {teacher.slots.map((slot) => (
            <SlotChip
              key={slot.id}
              slot={slot}
              justChanged={changedSlot === slot.id}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="hidden text-sm tabular-nums text-foreground/80 sm:inline">
            <span className="font-semibold">${teacher.rate}</span>
            <span className="text-muted-foreground"> /hour · {teacher.language}</span>
          </span>
          <button
            type="button"
            className="group inline-flex items-center gap-1.5 rounded-md bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            View profile
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function LiveAvailabilityBoard() {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [lastSync, setLastSync] = useState<number>(Date.now());
  const [tick, setTick] = useState(0);
  const [changedSlot, setChangedSlot] = useState<string | null>(null);

  // Heartbeat for the "X seconds ago" label, simulating polling cadence.
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Read latest teachers from a ref so the polling effect stays pure.
  const teachersRef = useRef(teachers);
  useEffect(() => {
    teachersRef.current = teachers;
  }, [teachers]);

  // Simulated polling: every ~6s, transition one open slot to taken.
  useEffect(() => {
    const timeouts: number[] = [];
    const interval = window.setInterval(() => {
      const current = teachersRef.current;
      const available = current.flatMap((t, ti) =>
        t.slots
          .map((s, si) => ({ slot: s, ti, si }))
          .filter((x) => x.slot.state === "available"),
      );
      if (available.length === 0) return;
      const pick = available[Math.floor(Math.random() * available.length)];
      const targetId = pick.slot.id;

      // available -> reserved (immediately)
      setTeachers((prev) =>
        prev.map((t, ti) =>
          ti !== pick.ti
            ? t
            : {
                ...t,
                slots: t.slots.map((s, si) =>
                  si !== pick.si ? s : { ...s, state: "reserved" as SlotState },
                ),
              },
        ),
      );
      setChangedSlot(targetId);
      setLastSync(Date.now());

      // reserved -> taken (after a beat)
      timeouts.push(
        window.setTimeout(() => {
          setTeachers((prev) =>
            prev.map((t) => ({
              ...t,
              slots: t.slots.map((s) =>
                s.id === targetId ? { ...s, state: "taken" as SlotState } : s,
              ),
            })),
          );
        }, 1400),
      );
      timeouts.push(
        window.setTimeout(() => setChangedSlot(null), 2600),
      );
    }, 6000);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const ageSeconds = useMemo(() => {
    void tick; // keep dep usage explicit
    return Math.floor((Date.now() - lastSync) / 1000);
  }, [tick, lastSync]);

  const totalOpen = teachers.reduce(
    (acc, t) => acc + t.slots.filter((s) => s.state === "available").length,
    0,
  );

  return (
    <div className="rounded-2xl border border-border bg-card shadow-elevated">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="relative inline-flex h-2.5 w-2.5"
          >
            <span className="absolute inset-0 rounded-full bg-[color:var(--success)] animate-pulse-ring" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--success)]" />
          </span>
          <span className="text-sm font-medium">Live timetable</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · refreshes every 6s
          </span>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            updated {formatRelative(ageSeconds)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            All times shown in your timezone
          </span>
          <span className="rounded-full bg-[color:var(--success)]/10 px-2 py-0.5 font-medium text-[color:var(--success)]">
            {totalOpen} slots open
          </span>
        </div>
      </div>

      {/* Refresh ribbon */}
      <div className="refresh-bar h-0.5 bg-border" />

      {/* Teachers */}
      <div className="grid gap-3 p-3 sm:p-5">
        {teachers.map((t) => (
          <TeacherRow key={t.id} teacher={t} changedSlot={changedSlot} />
        ))}
      </div>
    </div>
  );
}
