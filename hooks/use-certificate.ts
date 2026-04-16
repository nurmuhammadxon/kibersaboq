import { useState } from "react";
import { toast } from "sonner";

export function useCertificate() {
    const [loading, setLoading] = useState(false);

    const createCertificate = async (courseId: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? "Sertifikat yaratishda xatolik");
                return null;
            }

            toast.success("Sertifikat muvaffaqiyatli yaratildi!");
            return data;
        } catch {
            toast.error("Tarmoq xatosi");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createCertificate, loading };
}