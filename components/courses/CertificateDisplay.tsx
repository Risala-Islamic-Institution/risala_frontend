"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api"; // Assuming api wrapper exists

interface Certificate {
    code: string;
    course_title: string;
    issued_at: string;
    // content can be added here
}

export default function CertificateDisplay({ courseSlug }: { courseSlug: string }) {
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                // Assuming we have an endpoint to get certificate by course or generic list
                // For now, let's assume we filter by the current course enrollment
                const res = await api.get<Certificate[]>(`/courses/certificates/?course_slug=${courseSlug}`);
                // The API returns a list, we take the first one if it exists
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

    if (loading) return null;
    if (!certificate) return null;

    return (
        <div className="p-6 border-2 border-gold-500 rounded-lg bg-cream-50 text-center shadow-lg mt-8">
            <h3 className="text-2xl font-serif text-gold-700 mb-2">Certificate of Completion</h3>
            <p className="text-gray-700 mb-4">This certifies that you have successfully completed</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{certificate.course_title}</h2>
            <div className="text-sm text-gray-500">
                <p>Issued on: {new Date(certificate.issued_at).toLocaleDateString()}</p>
                <p>Certificate ID: {certificate.code}</p>
            </div>
            <button
                onClick={() => window.print()}
                className="mt-6 px-4 py-2 bg-gold-600 text-white rounded hover:bg-gold-700 transition"
            >
                Download / Print
            </button>
        </div>
    );
}
