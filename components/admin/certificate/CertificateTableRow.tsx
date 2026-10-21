"use client"

import { Download } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CertificateDeleteDialog } from "./CertificateDeleteDialog"
import { useCertificateDownload } from "@/hooks/use-certificate-download"
import type { Certificate } from "@/hooks/use-admin-certificates"

const levelLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
    BEGINNER: { label: "Boshlang'ich", variant: "secondary" },
    INTERMEDIATE: { label: "O'rta", variant: "default" },
    ADVANCED: { label: "Yuqori", variant: "outline" },
}

interface Props {
    certificate: Certificate
    isDeleting: boolean
    onDelete: (id: string) => void
    onSetRevoked: (id: string, revoke: boolean, reason?: string) => void
}

export function CertificateTableRow({ certificate, isDeleting, onDelete, onSetRevoked }: Props) {
    const level = levelLabels[certificate.course.level] ?? {
        label: certificate.course.level,
        variant: "secondary" as const,
    }

    const fullName = `${certificate.user.firstName} ${certificate.user.lastName}`
    const { download, downloading } = useCertificateDownload(
        `sertifikat-${certificate.certificateNumber}`
    )

    return (
        <TableRow>
            <TableCell>
                <div>
                    <p className="font-medium">
                        {certificate.user.firstName} {certificate.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{certificate.user.email}</p>
                </div>
            </TableCell>

            <TableCell className="font-medium">{certificate.course.title}</TableCell>

            <TableCell>
                <Badge variant={level.variant}>{level.label}</Badge>
            </TableCell>

            <TableCell className="font-mono text-xs text-muted-foreground">
                {certificate.certificateNumber}
                {certificate.revokedAt && (
                    <Badge variant="destructive" className="ml-2">Bekor qilingan</Badge>
                )}
            </TableCell>

            <TableCell className="text-muted-foreground">
                {new Date(certificate.issuedAt).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </TableCell>

            <TableCell className="text-right space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={downloading}
                    onClick={() =>
                        download({
                            userName: fullName,
                            courseTitle: certificate.course.title,
                            issuedAt: certificate.issuedAt,
                            certificateNumber: certificate.certificateNumber,
                        })
                    }
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">{downloading ? "Yuklanmoqda…" : "PDF"}</span>
                </Button>
                {certificate.revokedAt ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (window.confirm("Sertifikatni qayta tiklaysizmi?")) {
                                onSetRevoked(certificate.id, false)
                            }
                        }}
                    >
                        Tiklash
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const reason = window.prompt(
                                "Bekor qilish sababi (ixtiyoriy). Bekor qilmaslik uchun Cancel bosing:"
                            )
                            if (reason !== null) onSetRevoked(certificate.id, true, reason)
                        }}
                    >
                        Bekor qilish
                    </Button>
                )}
                <CertificateDeleteDialog
                    userName={`${certificate.user.firstName} ${certificate.user.lastName}`}
                    courseTitle={certificate.course.title}
                    isDeleting={isDeleting}
                    onDelete={() => onDelete(certificate.id)}
                />
            </TableCell>
        </TableRow>
    )
}