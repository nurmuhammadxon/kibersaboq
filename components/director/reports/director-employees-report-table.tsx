import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { DirectorReportEmployee } from "@/hooks/use-director-reports"

interface Props {
    rows: DirectorReportEmployee[]
}

export function DirectorEmployeesReportTable({ rows }: Props) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Xodimlar bo'yicha</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border">
                <Table className="min-w-190">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Xodim</TableHead>
                            <TableHead className="hidden md:table-cell">Yo'nalish</TableHead>
                            <TableHead className="text-center">Yozilgan</TableHead>
                            <TableHead className="text-center">Yakunlangan</TableHead>
                            <TableHead className="text-center">Darslar</TableHead>
                            <TableHead className="text-center">Sertifikatlar</TableHead>
                            <TableHead className="text-center">O'rtacha ball</TableHead>
                            <TableHead className="text-center">Holat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    Hozircha xodimlar yo'q
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>
                                        <p className="text-sm font-medium">
                                            {e.firstName} {e.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{e.email}</p>
                                    </TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                        {e.field ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-center">{e.enrollments}</TableCell>
                                    <TableCell className="text-center">{e.completed}</TableCell>
                                    <TableCell className="text-center">{e.lessons}</TableCell>
                                    <TableCell className="text-center">{e.certificates}</TableCell>
                                    <TableCell className="text-center">
                                        {e.avgScore != null ? `${e.avgScore}%` : "—"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {e.isBlocked ? (
                                            <Badge variant="destructive">Bloklangan</Badge>
                                        ) : (
                                            <Badge variant="secondary">Faol</Badge>
                                        )}
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