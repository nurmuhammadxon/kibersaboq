import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { DirectorEmployee } from "@/hooks/use-director-employees"

interface Props {
    employees: DirectorEmployee[]
}

export function EmployeesTable({ employees }: Props) {
    return (
        <div className="border border-border rounded-2xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Xodim</TableHead>
                        <TableHead>Yo'nalish</TableHead>
                        <TableHead className="text-center">Kurslar</TableHead>
                        <TableHead className="text-center">Yakunlangan</TableHead>
                        <TableHead className="text-center">Sertifikatlar</TableHead>
                        <TableHead className="text-center">O'rtacha ball</TableHead>
                        <TableHead className="text-center">Progress</TableHead>
                        <TableHead className="text-center">Holat</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                Xodim topilmadi
                            </TableCell>
                        </TableRow>
                    ) : employees.map(emp => {
                        const fullName = `${emp.firstName} ${emp.lastName}`
                        const initials = `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase()
                        return (
                            <TableRow key={emp.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                            {initials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{fullName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {emp.field ?? "—"}
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    {emp.totalEnrollments}
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    {emp.completedEnrollments}
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    {emp.certificates}
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                    {emp.avgScore > 0 ? `${emp.avgScore}%` : "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${emp.progressPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-8">
                                            {emp.progressPercent}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {emp.isBlocked ? (
                                        <Badge variant="destructive">Bloklangan</Badge>
                                    ) : (
                                        <Badge variant="secondary">Faol</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}