import { Building2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { AdminReportsCompanyRow } from "@/hooks/use-admin-reports"

interface ReportsCompaniesTableProps {
    rows: AdminReportsCompanyRow[]
}

export function ReportsCompaniesTable({ rows }: ReportsCompaniesTableProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Korxonalar bo'yicha</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border">
                <Table className="min-w-190">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Korxona</TableHead>
                            <TableHead className="hidden sm:table-cell">Kod</TableHead>
                            <TableHead className="text-right">Xodimlar</TableHead>
                            <TableHead className="text-right">Faol</TableHead>
                            <TableHead className="text-right">Yozilishlar</TableHead>
                            <TableHead className="text-right">Yakunlangan</TableHead>
                            <TableHead className="text-right">Sertifikatlar</TableHead>
                            <TableHead className="hidden text-right md:table-cell">O'rtacha ball</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    Korxonalar topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.name}</TableCell>
                                    <TableCell className="hidden font-mono text-xs sm:table-cell">
                                        {r.code}
                                    </TableCell>
                                    <TableCell className="text-right">{r.employees}</TableCell>
                                    <TableCell className="text-right">{r.activeEmployees}</TableCell>
                                    <TableCell className="text-right">{r.enrollments}</TableCell>
                                    <TableCell className="text-right">{r.completed}</TableCell>
                                    <TableCell className="text-right">{r.certificates}</TableCell>
                                    <TableCell className="hidden text-right md:table-cell">
                                        {r.avgScore != null ? `${r.avgScore}%` : "—"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}