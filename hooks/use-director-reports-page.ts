"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { defaultReportDateRange } from "@/lib/format-date-input"
import { useDirectorReports } from "@/hooks/use-director-reports"
import {
    downloadDirectorReportCsv,
    downloadDirectorReportPdf,
} from "@/lib/director-report-export"

export function useDirectorReportsPage() {
    const initial = useMemo(() => defaultReportDateRange(), [])

    const [from, setFrom] = useState(initial.from)
    const [to, setTo] = useState(initial.to)
    const [courseId, setCourseId] = useState("")
    const [applied, setApplied] = useState({
        from: initial.from,
        to: initial.to,
        courseId: "",
    })
    const [pdfLoading, setPdfLoading] = useState(false)

    const { data, loading, error, refresh } = useDirectorReports(
        applied.from,
        applied.to,
        applied.courseId
    )

    const applyFilters = useCallback(() => {
        setApplied({ from, to, courseId })
    }, [from, to, courseId])

    const downloadCsv = useCallback(() => {
        if (!data) return
        downloadDirectorReportCsv(data)
    }, [data])

    const downloadPdf = useCallback(async () => {
        if (!data) return
        try {
            setPdfLoading(true)
            await downloadDirectorReportPdf(data)
        } catch (err) {
            console.error(err)
            toast.error("PDF yaratishda xatolik")
        } finally {
            setPdfLoading(false)
        }
    }, [data])

    return {
        from, setFrom,
        to, setTo,
        courseId, setCourseId,
        data, loading, error,
        refresh,
        applyFilters,
        downloadCsv,
        downloadPdf,
        pdfLoading,
    }
}