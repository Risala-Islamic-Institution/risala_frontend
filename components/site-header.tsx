"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ArrowUpRight, Menu } from "@/components/icons";

const NAV = [
  { label: "Teachers", href: "#teachers" },
  { label: "Live availability", href: "#live" },
  { label: "Learning paths", href: "#paths" },
  { label: "How it works", href: "#how" },
  { label: "For Ustaz", href: "#ustaz" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Risala home" className="shrink-0">
          <BrandMark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0b2e22]"
          >
            Start learning
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Open menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav
            aria-label="Mobile"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground/85 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md border border-border px-3 py-2.5 text-center text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Start learning
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
