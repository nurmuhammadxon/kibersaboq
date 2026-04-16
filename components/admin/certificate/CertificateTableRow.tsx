import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CertificateDeleteDialog } from "./CertificateDeleteDialog"
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
}

export function CertificateTableRow({ certificate, isDeleting, onDelete }: Props) {
    const level = levelLabels[certificate.course.level] ?? {
        label: certificate.course.level,
        variant: "secondary" as const,
    }

    return (
        <TableRow>
            <TableCell>
                <div>
                    <p className="font-medium">{certificate.user.name}</p>
                    <p className="text-xs text-muted-foreground">{certificate.user.email}</p>
                </div>
            </TableCell>

            <TableCell className="font-medium">{certificate.course.title}</TableCell>

            <TableCell>
                <Badge variant={level.variant}>{level.label}</Badge>
            </TableCell>

            <TableCell className="font-mono text-xs text-muted-foreground">
                #{certificate.certificateNumber.slice(0, 12).toUpperCase()}
            </TableCell>

            <TableCell className="text-muted-foreground">
                {new Date(certificate.issuedAt).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </TableCell>

            <TableCell className="text-right">
                <CertificateDeleteDialog
                    userName={certificate.user.name}
                    courseTitle={certificate.course.title}
                    isDeleting={isDeleting}
                    onDelete={() => onDelete(certificate.id)}
                />
            </TableCell>
        </TableRow>
    )
}