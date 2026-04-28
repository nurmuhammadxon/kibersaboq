"use client"

import { useCallback, useMemo, useState } from "react"
import { defaultReportDateRange } from "@/lib/format-date-input"
import { useAdminReports, type AdminReportsData } from "@/hooks/use-admin-reports"

function buildCsv(data: AdminReportsData, from: string, to: string) {
    const header = [
        "Kurs",
        "Narx",       
        "Yozilishlar",
        "Yakunlangan",
        "Sertifikatlar",
        "O'rtacha ball",
    ]
    const lines = [
        header.join(","),
        ...data.courses.map((row) =>
            [
                `"${row.title.replace(/"/g, '""')}"`,
                row.price ?? "Bepul", 
                row.enrollments,
                row.completed,
                row.certificates,
                row.avgScore ?? "",
            ].join(",")
        ),
    ]
    const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hisobot-${from}-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

export function useAdminReportsPage() {
    const initial = useMemo(() => defaultReportDateRange(), [])

    const [from, setFrom] = useState(initial.from)
    const [to, setTo] = useState(initial.to)
    const [courseId, setCourseId] = useState("")
    const [applied, setApplied] = useState({
        from: initial.from,
        to: initial.to,
        courseId: "",
    })

    const { data, loading, error, refresh } = useAdminReports(
        applied.from,
        applied.to,
        applied.courseId
    )

    const applyFilters = useCallback(() => {
        setApplied({ from, to, courseId })
    }, [from, to, courseId])

    const downloadCsv = useCallback(() => {
        if (!data || data.courses.length === 0) return
        buildCsv(data, applied.from, applied.to)
    }, [data, applied.from, applied.to])

    return {
        from, setFrom,
        to, setTo,
        courseId, setCourseId,
        applied,
        data, loading, error,
        refresh,
        applyFilters,
        downloadCsv,
    }
}