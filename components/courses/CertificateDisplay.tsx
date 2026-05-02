"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
                    `/courses/certificates/?course_slug=${courseSlug}`
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
        <Card className="p-10 text-center bg-muted">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Certificate of Completion</p>
            <p className="text-sm text-muted-foreground mb-3">This certifies that you have completed</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 leading-tight">
                {certificate.course_title}
            </h2>
            <div className="inline-flex flex-col gap-1 text-sm text-muted-foreground border-t border-border pt-4 mt-2">
                <p>Issued on {new Date(certificate.issued_at).toLocaleDateString()}</p>
                <p className="font-mono text-xs">ID: {certificate.code}</p>
            </div>
            <div className="mt-8">
                <Button variant="secondary" onClick={() => window.print()}>
                    Download / Print
                </Button>
            </div>
        </Card>
    );
}
