import { useEffect, useState } from "react";

interface Certificate {
    id: string;
    certificateNumber: string;
    issuedAt: string;
    courseId: string;
    userId: string;
}

interface Result {
    hasCertificate: boolean;
    certificate: Certificate | null;
    loading: boolean;
}

export function useCertificateCheck(courseId: string): Result {
    const [hasCertificate, setHasCertificate] = useState(false);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;

        const check = async () => {
            try {
                const res = await fetch(`/api/certificates/${courseId}/check`);
                const data = await res.json();
                setHasCertificate(data.hasCertificate);
                setCertificate(data.certificate ?? null);
            } catch {
                setHasCertificate(false);
                setCertificate(null);
            } finally {
                setLoading(false);
            }
        };

        check();
    }, [courseId]);

    return { hasCertificate, certificate, loading };
}