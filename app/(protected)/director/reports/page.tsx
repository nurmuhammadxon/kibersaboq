"use client"

import Loading from "@/components/_components/loading"
import { ReportsErrorAlert } from "@/components/admin/reports/reports-error-alert"
import { ReportsFilters } from "@/components/admin/reports/reports-filters"
import { DirectorActivityChart } from "@/components/director/reports/director-activity-chart"
import { DirectorCoursesReportTable } from "@/components/director/reports/director-courses-report-table"
import { DirectorEmployeesReportTable } from "@/components/director/reports/director-employees-report-table"
import { DirectorReportsHeader } from "@/components/director/reports/director-reports-header"
import { DirectorReportsSummary } from "@/components/director/reports/director-reports-summary"
import { useDirectorReportsPage } from "@/hooks/use-director-reports-page"

export default function DirectorReportsPage() {
    const {
        from, setFrom,
        to, setTo,
        courseId, setCourseId,
        data, loading, error,
        refresh,
        applyFilters,
        downloadCsv,
        downloadPdf,
        pdfLoading,
    } = useDirectorReportsPage()

    if (loading && !data && !error) return <Loading fullScreen={true} />

    return (
        <div className="space-y-6">
            <DirectorReportsHeader
                companyName={data?.company.name}
                companyCode={data?.company.code}
                disableExport={!data}
                onDownloadCsv={downloadCsv}
                onDownloadPdf={downloadPdf}
                pdfLoading={pdfLoading}
            />

            {error && <ReportsErrorAlert message={error} onRetry={refresh} />}

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
                        <DirectorReportsSummary stats={data.stats} />
                        <DirectorActivityChart
                            activity={data.activity}
                            bucketSize={data.bucketSize}
                        />
                        <DirectorEmployeesReportTable rows={data.employees} />
                        <DirectorCoursesReportTable rows={data.courses} />
                    </>
                ))}
        </div>
    )
}