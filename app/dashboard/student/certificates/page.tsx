"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

interface CertificateItem {
  id: string;
  enrollment: string;
  issued_at: string;
  code: string;
  course_title?: string;
  course_slug?: string;
}

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState<CertificateItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get<CertificateItem[]>(`/certificates/`);
        setCerts(res);
      } catch (e) {
        setError("Failed to load certificates.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Loading certificates…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-white/80">Your completed courses</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {certs.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral p-6 shadow-sm text-secondary/60">No certificates yet.</div>
        ) : (
          <ul className="divide-y divide-neutral/60 bg-white rounded-xl border border-neutral shadow-sm">
            {certs.map((c) => (
              <li key={c.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-primary">{c.course_title || "Course"}</div>
                  <div className="text-secondary/70 text-sm">Issued {new Date(c.issued_at).toLocaleString()}</div>
                  <div className="mt-1 font-mono text-xs bg-neutral/20 px-2 py-1 rounded">{c.code}</div>
                </div>
                {c.course_slug ? (
                  <Button variant="secondary" onClick={()=>{window.location.href=`/dashboard/student/courses/${c.course_slug}`;}}>Open</Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {error && <div className="p-3 bg-error/10 text-error rounded-lg">{error}</div>}
      </main>
    </div>
  );
}
