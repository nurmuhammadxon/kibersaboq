"use client"

import { Users } from "lucide-react"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { AdminReportsUserRow } from "@/hooks/use-admin-reports"

interface ReportsUsersTableProps {
    rows: AdminReportsUserRow[]
    total: number
}

export function ReportsUsersTable({ rows, total }: ReportsUsersTableProps) {
    const [search, setSearch] = useState("")

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return rows
        return rows.filter(
            (u) =>
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.company.toLowerCase().includes(q)
        )
    }, [rows, search])

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Xodimlar bo'yicha</h2>
                    {total > rows.length && (
                        <span className="text-xs text-muted-foreground">
                            eng faol {rows.length} tasi ({total} dan)
                        </span>
                    )}
                </div>
                <Input
                    placeholder="Ism, email yoki korxona..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:max-w-xs"
                />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border">
                <Table className="min-w-190">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Xodim</TableHead>
                            <TableHead className="hidden md:table-cell">Korxona</TableHead>
                            <TableHead className="text-center">Yozilgan</TableHead>
                            <TableHead className="text-center">Yakunlangan</TableHead>
                            <TableHead className="text-center">Darslar</TableHead>
                            <TableHead className="text-center">Sertifikatlar</TableHead>
                            <TableHead className="text-center">O'rtacha ball</TableHead>
                            <TableHead className="text-center">Holat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    Xodim topilmadi
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <p className="text-sm font-medium">
                                            {u.firstName} {u.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                        {u.company}
                                    </TableCell>
                                    <TableCell className="text-center">{u.enrollments}</TableCell>
                                    <TableCell className="text-center">{u.completed}</TableCell>
                                    <TableCell className="text-center">{u.lessons}</TableCell>
                                    <TableCell className="text-center">{u.certificates}</TableCell>
                                    <TableCell className="text-center">
                                        {u.avgScore != null ? `${u.avgScore}%` : "—"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {u.isBlocked ? (
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