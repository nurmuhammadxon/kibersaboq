"use client"

import { useMemo, useState } from "react"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMyCertificates } from "@/hooks/use-my-certificates"
import { CertificateCard } from "@/components/dashboard/certificate/certificate-card"

const levelUz: Record<string, string> = {
    BEGINNER: "Boshlang'ich",
    INTERMEDIATE: "O'rta",
    ADVANCED: "Murakkab",
}

export default function DashboardCertificatesPage() {
    const { certificates, loading, error, refresh } = useMyCertificates()
    const [query, setQuery] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return certificates
        return certificates.filter((c) =>
            c.course.title.toLowerCase().includes(q)
        )
    }, [certificates, query])

    const selected = certificates.find((c) => c.id === selectedId) ?? null

    if (loading) return <Loading fullScreen={true} />

    if (error) {
        return (
            <ErrorComponent
                title="Yuklanmadi"
                message={error}
                onRetry={refresh}
                fullScreen={true}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Sertifikatlarim</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Tugatgan kurslaringiz bo'yicha berilgan sertifikatlar
                </p>
            </div>

            <Input
                placeholder="Kurs bo'yicha qidirish…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
            />

            {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-xl">
                    {certificates.length === 0
                        ? "Hozircha sertifikat yo'q."
                        : "Hech narsa topilmadi."}
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kurs</TableHead>
                            <TableHead>Daraja</TableHead>
                            <TableHead>Raqam</TableHead>
                            <TableHead>Sana</TableHead>
                            <TableHead className="text-right">Amal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">
                                    {row.course.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {levelUz[row.course.level] ?? row.course.level}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {row.certificateNumber}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(row.issuedAt).toLocaleDateString("uz-UZ")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSelectedId(row.id)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Ko'rish
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog
                open={!!selected}
                onOpenChange={(open) => !open && setSelectedId(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Sertifikat</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <CertificateCard
                            certificateNumber={selected.certificateNumber}
                            courseTitle={selected.course.title}
                            courseLevel={selected.course.level}
                            issuedAt={selected.issuedAt}
                            userName={selected.user.name}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}