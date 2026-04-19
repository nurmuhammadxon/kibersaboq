"use client"

import Loading from "@/components/_components/loading"
import { ReportsCourseTable } from "@/components/admin/reports/reports-course-table"
import { ReportsErrorAlert } from "@/components/admin/reports/reports-error-alert"
import { ReportsFilters } from "@/components/admin/reports/reports-filters"
import { ReportsHeader } from "@/components/admin/reports/reports-header"
import { ReportsSummary } from "@/components/admin/reports/reports-summary"
import { useAdminReportsPage } from "@/hooks/use-admin-reports-page"

export default function AdminReportsPage() {
    const {
        from,
        setFrom,
        to,
        setTo,
        courseId,
        setCourseId,
        data,
        loading,
        error,
        refresh,
        applyFilters,
        downloadCsv,
    } = useAdminReportsPage()

    const courseOptions = data?.courseOptions ?? []
    const courseRows = data?.courses ?? []

    if (loading && !data && !error) return <Loading fullScreen={true} />

    return (
        <div className="space-y-6">
            <ReportsHeader
                disableCsv={!data || courseRows.length === 0}
                onDownloadCsv={downloadCsv}
            />

            {error && (
                <ReportsErrorAlert message={error} onRetry={refresh} />
            )}

            <ReportsFilters
                from={from}
                to={to}
                courseId={courseId}
                courseOptions={courseOptions}
                loading={loading}
                onFromChange={setFrom}
                onToChange={setTo}
                onCourseIdChange={setCourseId}
                onApply={applyFilters}
            />

            {data &&
                (loading ? (
                    <div className="py-8">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <ReportsSummary stats={data.stats} />
                        <ReportsCourseTable rows={courseRows} />
                    </>
                ))}
        </div>
    )
}
