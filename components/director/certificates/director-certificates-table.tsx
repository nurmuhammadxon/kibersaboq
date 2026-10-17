"use client"

import { Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useCertificateDownload } from "@/hooks/use-certificate-download"
import type { DirectorCertificate } from "@/hooks/use-director-certificates"

const LEVELS: Record<string, string> = {
    BEGINNER: "Boshlang'ich",
    INTERMEDIATE: "O'rta",
    ADVANCED: "Murakkab",
}

function formatDate(iso: string) {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    return `${dd}.${mm}.${d.getFullYear()}`
}

function Row({ cert }: { cert: DirectorCertificate }) {
    const fullName = `${cert.user.firstName} ${cert.user.lastName}`
    const { download, downloading } = useCertificateDownload(
        `sertifikat-${cert.certificateNumber}`
    )

    return (
        <TableRow>
            <TableCell>
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">{cert.user.email}</p>
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                {cert.user.field ?? "—"}
            </TableCell>
            <TableCell className="text-sm font-medium">{cert.course.title}</TableCell>
            <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary">
                    {LEVELS[cert.course.level] ?? cert.course.level}
                </Badge>
            </TableCell>
            <TableCell className="hidden font-mono text-xs lg:table-cell">
                {cert.certificateNumber}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
                {formatDate(cert.issuedAt)}
            </TableCell>
            <TableCell className="text-right">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={downloading}
                    onClick={() =>
                        download({
                            userName: fullName,
                            courseTitle: cert.course.title,
                            issuedAt: cert.issuedAt,
                            certificateNumber: cert.certificateNumber,
                        })
                    }
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {downloading ? "Yuklanmoqda..." : "PDF"}
                    </span>
                </Button>
            </TableCell>
        </TableRow>
    )
}

export function DirectorCertificatesTable({
    certificates,
}: {
    certificates: DirectorCertificate[]
}) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-border">
            <Table className="min-w-170">
                <TableHeader>
                    <TableRow>
                        <TableHead>Xodim</TableHead>
                        <TableHead className="hidden md:table-cell">Yo'nalish</TableHead>
                        <TableHead>Kurs</TableHead>
                        <TableHead className="hidden sm:table-cell">Daraja</TableHead>
                        <TableHead className="hidden lg:table-cell">Raqam</TableHead>
                        <TableHead>Sana</TableHead>
                        <TableHead className="text-right">Yuklab olish</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {certificates.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="py-12 text-center text-muted-foreground"
                            >
                                Sertifikat topilmadi
                            </TableCell>
                        </TableRow>
                    ) : (
                        certificates.map((c) => <Row key={c.id} cert={c} />)
                    )}
                </TableBody>
            </Table>
        </div>
    )
}