"use client"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { useDirectorEmployees } from "@/hooks/use-director-employees"
import { EmployeesHeader } from "@/components/director/employees/employees-header"
import { EmployeesSearch } from "@/components/director/employees/employees-search"
import { EmployeesTable } from "@/components/director/employees/employees-table"

export default function DirectorEmployeesPage() {
    const { filtered, loading, error, search, setSearch, refresh } = useDirectorEmployees()

    if (loading) return <Loading fullScreen />
    if (error) return <ErrorComponent message={error} onRetry={refresh} />

    return (
        <div className="space-y-6">
            <EmployeesHeader count={filtered.length} />
            <EmployeesSearch value={search} onChange={setSearch} />
            <EmployeesTable employees={filtered} />
        </div>
    )
}