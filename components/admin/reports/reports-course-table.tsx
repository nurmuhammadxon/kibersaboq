import { BarChart3 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { AdminReportsCourseRow } from "@/hooks/use-admin-reports"

interface ReportsCourseTableProps {
    rows: AdminReportsCourseRow[]
}

export function ReportsCourseTable({ rows }: ReportsCourseTableProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Kurslar bo'yicha</h2>
            </div>
            {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Bu tashkilot uchun kurslar topilmadi yoki tanlangan filtr
                    bo'yicha ma'lumot yo'q.
                </p>
            ) : (
                <Table className="min-w-190">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kurs</TableHead>
                            <TableHead className="text-right hidden sm:table-cell">Narx</TableHead>
                            <TableHead className="text-right">Yozilishlar</TableHead>
                            <TableHead className="text-right">Yakunlangan</TableHead>
                            <TableHead className="text-right">Sertifikatlar</TableHead>
                            <TableHead className="text-right hidden md:table-cell">O'rtacha ball</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.title}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell">
                                    {row.price ? `$${row.price}` : "Bepul"}
                                </TableCell>
                                <TableCell className="text-right">{row.enrollments}</TableCell>
                                <TableCell className="text-right">{row.completed}</TableCell>
                                <TableCell className="text-right">{row.certificates}</TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                    {row.avgScore != null ? `${row.avgScore}%` : "—"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}