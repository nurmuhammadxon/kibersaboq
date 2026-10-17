"use client"

import Loading from "@/components/_components/loading"
import { ReportsCompaniesTable } from "@/components/admin/reports/reports-companies-table"
import { ReportsCourseTable } from "@/components/admin/reports/reports-course-table"
import { ReportsErrorAlert } from "@/components/admin/reports/reports-error-alert"
import { ReportsFilters } from "@/components/admin/reports/reports-filters"
import { ReportsHeader } from "@/components/admin/reports/reports-header"
import { ReportsSummary } from "@/components/admin/reports/reports-summary"
import { ReportsTotals } from "@/components/admin/reports/reports-totals"
import { ReportsUsersTable } from "@/components/admin/reports/reports-users-table"
import { DirectorActivityChart } from "@/components/director/reports/director-activity-chart"
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
        downloadPdf,
        pdfLoading,
    } = useAdminReportsPage()

    if (loading && !data && !error) return <Loading fullScreen={true} />

    return (
        <div className="space-y-6">
            <ReportsHeader
                disableExport={!data}
                onDownloadCsv={downloadCsv}
                onDownloadPdf={downloadPdf}
                pdfLoading={pdfLoading}
            />

            {error && (
                <ReportsErrorAlert message={error} onRetry={refresh} />
            )}

            <ReportsFilters
                from={from}
                to={to}
                courseId={courseId}
                courseOptions={data?.courseOptions ?? []}
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
                        <ReportsTotals totals={data.totals} />
                        <ReportsSummary stats={data.stats} />
                        <DirectorActivityChart
                            activity={data.activity}
                            bucketSize={data.bucketSize}
                        />
                        <ReportsCompaniesTable rows={data.companies} />
                        <ReportsUsersTable rows={data.users} total={data.usersTotal} />
                        <ReportsCourseTable rows={data.courses} />
                    </>
                ))}
        </div>
    )
}