import { BarChart3 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { DirectorReportCourse } from "@/hooks/use-director-reports"

interface Props {
    rows: DirectorReportCourse[]
}

export function DirectorCoursesReportTable({ rows }: Props) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Kurslar bo'yicha</h2>
            </div>
            {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    Xodimlaringiz hali birorta kursga yozilmagan.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-border">
                    <Table className="min-w-150">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kurs</TableHead>
                                <TableHead className="text-right">Yozilishlar</TableHead>
                                <TableHead className="text-right">Yakunlangan</TableHead>
                                <TableHead className="text-right">Sertifikatlar</TableHead>
                                <TableHead className="text-right">O'rtacha ball</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.title}</TableCell>
                                    <TableCell className="text-right">{r.enrollments}</TableCell>
                                    <TableCell className="text-right">{r.completed}</TableCell>
                                    <TableCell className="text-right">{r.certificates}</TableCell>
                                    <TableCell className="text-right">
                                        {r.avgScore != null ? `${r.avgScore}%` : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}