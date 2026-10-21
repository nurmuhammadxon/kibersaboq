"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCertificateDownload } from "@/hooks/use-certificate-download"
import { renderCertificateCanvas } from "@/lib/certificate-render"

interface Props {
    certificateNumber: string
    courseTitle: string
    courseLevel: string
    issuedAt: string
    userName: string
}

const levelUz: Record<string, string> = {
    BEGINNER: "Boshlang'ich",
    INTERMEDIATE: "O'rta",
    ADVANCED: "Murakkab",
}

export function CertificateCard({
    certificateNumber,
    courseTitle,
    courseLevel,
    issuedAt,
    userName,
}: Props) {
    const { download, downloading } = useCertificateDownload(
        `sertifikat-${certificateNumber}`
    )

    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        renderCertificateCanvas({ userName, courseTitle, issuedAt, certificateNumber })
            .then((c) => {
                if (!cancelled) setPreview(c.toDataURL("image/jpeg", 0.85))
            })
            .catch(() => {
                if (!cancelled) setPreview(null)
            })
        return () => {
            cancelled = true
        }
    }, [userName, courseTitle, issuedAt, certificateNumber])

    return (
        <div className="space-y-4">
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted/30 aspect-[2245/1587]">
                {preview ? (
                    <img src={preview} alt="Sertifikat" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full animate-pulse" />
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>{levelUz[courseLevel] ?? courseLevel}</span>
                <span className="font-mono text-xs">{certificateNumber}</span>
            </div>

            <Button
                onClick={() => download({
                    userName,
                    courseTitle,
                    issuedAt,
                    certificateNumber,
                })}
                disabled={downloading}
                className="w-full"
            >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? "Yuklanmoqda…" : "PDF yuklab olish"}
            </Button>
        </div>
    )
}