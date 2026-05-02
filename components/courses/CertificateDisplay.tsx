"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Verified } from "@/components/icons";

interface Certificate {
    code: string;
    course_title: string;
    issued_at: string;
}

export default function CertificateDisplay({ courseSlug }: { courseSlug: string }) {
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const res = await api.get<Certificate[]>(
                    `/courses/certificates/?course_slug=${courseSlug}`,
                );
                if (res && res.length > 0) {
                    setCertificate(res[0]);
                }
            } catch (error) {
                console.error("Failed to fetch certificate", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificate();
    }, [courseSlug]);

    if (loading || !certificate) return null;

    return (
        <article className="relative overflow-hidden rounded-2xl border border-accent/30 bg-card text-center">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 50% 50%, var(--accent) 0 1px, transparent 1px), linear-gradient(45deg, transparent 46%, var(--primary) 46% 54%, transparent 54%), linear-gradient(-45deg, transparent 46%, var(--primary) 46% 54%, transparent 54%)",
                    backgroundSize: "32px 32px, 64px 64px, 64px 64px",
                }}
            />
            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                    <Verified className="h-3.5 w-3.5 text-accent" />
                    Certificate of completion
                </span>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    This certifies that you have completed
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl text-balance">
                    {certificate.course_title}
                </h2>
                <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-border pt-6 text-left">
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            Issued
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-foreground">
                            {new Date(certificate.issued_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            Credential ID
                        </dt>
                        <dd className="mt-1 font-mono text-xs text-foreground">
                            {certificate.code}
                        </dd>
                    </div>
                </dl>
                <div className="mt-8">
                    <Button variant="outline" onClick={() => window.print()}>
                        Download / print
                    </Button>
                </div>
            </div>
        </article>
    );
}
