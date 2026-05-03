"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand-mark";
import { ArrowRight, GraduationCap, Quote, Verified } from "@/components/icons";
import { api } from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    clearToken();

    if (password1 !== password2) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<{ key: string }>("/auth/registration/", {
        username,
        full_name: fullName,
        email,
        password1,
        password2,
        role,
      });
      if (response.key) {
        setToken(response.key);
      }
      window.location.href = "/login?registered=true";
    } catch (err: unknown) {
      // Surface backend validation messages instead of a generic message.
      let message = "Registration failed. Please check your details.";
      if (err instanceof Error && err.message) {
        // api.request includes the backend detail after a hyphen, e.g. "400 Bad Request - field: message"
        const m = err.message.match(/-\s*(.*)$/);
        message = m ? m[1] : String(err.message);
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "mt-1.5 block h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ── Left brand panel ─────────────────────────────────────────── */}
      <aside
        className="relative hidden flex-col overflow-hidden p-10 text-secondary-foreground lg:flex xl:p-14"
        style={{
          background: "linear-gradient(180deg, #0F3D2E 0%, #0a2920 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(198,167,94,0.7) 0 1px, transparent 1px), linear-gradient(45deg, transparent 46%, rgba(247,248,245,0.08) 46% 54%, transparent 54%), linear-gradient(-45deg, transparent 46%, rgba(247,248,245,0.08) 46% 54%, transparent 54%)",
            backgroundSize: "32px 32px, 64px 64px, 64px 64px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, #C6A75E, transparent 70%)",
          }}
        />

        <Link href="/" aria-label="Risala home" className="relative">
          <BrandMark variant="light" />
        </Link>

        <div className="relative mt-auto max-w-lg">
          <Quote className="h-8 w-8 text-accent" aria-hidden />
          <p className="mt-6 font-display text-2xl leading-snug tracking-tight text-secondary-foreground/95 xl:text-[28px]">
            &ldquo;Whoever travels a path in search of knowledge, Allah eases
            for him a path to Paradise.&rdquo;
          </p>
          <p className="mt-3 text-sm text-secondary-foreground/65">
            Hadith · Sahih Muslim
          </p>

          <ul className="mt-12 space-y-3 text-sm text-secondary-foreground/80">
            {[
              "Free account · no card required to browse",
              "Verified Ustaz across 12 languages",
              "Pay only after your Ustaz approves a booking",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Verified className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-12 text-xs text-secondary-foreground/55">
          Risala Islamic Knowledge & Skills PLC
        </p>
      </aside>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <main className="relative flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-5 lg:hidden">
          <Link href="/" aria-label="Risala home">
            <BrandMark />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            Sign in
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:pb-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Join Risala
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Begin your journey
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Public signup is for learners and Ustaz. Platform staff roles are
              provisioned internally.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-md border border-(--error)/25 bg-(--error)/8 px-3.5 py-2.5 text-sm text-error"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  I want to join as
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {[
                    {
                      v: "STUDENT",
                      label: "Learner",
                      sub: "Find Ustaz and book sessions",
                    },
                    { v: "USTAZ", label: "Ustaz", sub: "Teach on Risala" },
                  ].map((opt) => {
                    const active = role === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setRole(opt.v)}
                        aria-pressed={active}
                        className={`relative flex flex-col gap-1 rounded-md border px-3.5 py-3 text-left transition-colors ${
                          active
                            ? "border-primary bg-(--primary)/6"
                            : "border-border bg-card hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {opt.v === "STUDENT" ? (
                            <GraduationCap
                              className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                            />
                          ) : (
                            <Verified
                              className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                            />
                          )}
                          <p
                            className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}
                          >
                            {opt.label}
                          </p>
                        </div>
                        <p className="text-[11px] leading-snug text-muted-foreground">
                          {opt.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground"
                >
                  Full name{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputCls}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-foreground"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputCls}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password1"
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <input
                    id="password1"
                    type="password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    className={inputCls}
                    placeholder="Create"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password2"
                    className="block text-sm font-medium text-foreground"
                  >
                    Confirm
                  </label>
                  <input
                    id="password2"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className={inputCls}
                    placeholder="Confirm"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Create account
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already on Risala?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="px-6 pb-6 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:px-10 lg:px-16">
          By creating an account, you agree to our Terms · Privacy
        </p>
      </main>
    </div>
  );
}
