"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCertificateDownload } from "@/hooks/use-certificate-download"

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

    const date = new Date(issuedAt).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="space-y-4">
            {/* Preview */}
            <div className="relative w-full rounded-xl overflow-hidden border border-border">
                <img
                    src="/certificate-template.png"
                    alt="Sertifikat shablon"
                    className="w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none"
                    style={{ paddingTop: "12%" }}
                >
                    <p className="text-xs text-gray-500">Ushbu sertifikat topshiriladi:</p>
                    <p className="font-bold text-lg" style={{
                        fontFamily: "Georgia, serif",
                        color: "#C9A84C",
                        fontSize: "clamp(14px, 3vw, 28px)",
                    }}>
                        {userName}
                    </p>
                    <p className="text-center text-gray-600 px-8"
                        style={{ fontSize: "clamp(10px, 1.5vw, 14px)" }}
                    >
                        {courseTitle} kursini muvaffaqiyatli yakunlaganligi tasdiqlanadi
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "clamp(9px, 1.2vw, 12px)" }}>
                        {date}
                    </p>
                </div>
            </div>

            {/* Info */}
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