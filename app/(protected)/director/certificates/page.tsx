"use client"

import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { DirectorCertificatesTable } from "@/components/director/certificates/director-certificates-table"
import { Input } from "@/components/ui/input"
import { useDirectorCertificates } from "@/hooks/use-director-certificates"

export default function DirectorCertificatesPage() {
    const {
        certificates,
        loading,
        error,
        userSearch,
        setUserSearch,
        courseSearch,
        setCourseSearch,
        refresh,
    } = useDirectorCertificates()

    if (loading && certificates.length === 0 && !userSearch && !courseSearch && !error) {
        return <Loading fullScreen />
    }
    if (error) return <ErrorComponent message={error} onRetry={refresh} />

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Sertifikatlar</h1>
                <p className="text-sm text-muted-foreground">
                    Xodimlaringiz olgan sertifikatlar ({certificates.length})
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                    placeholder="Xodim ismi yoki email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="sm:max-w-xs"
                />
                <Input
                    placeholder="Kurs nomi..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="sm:max-w-xs"
                />
            </div>

            <DirectorCertificatesTable certificates={certificates} />
        </div>
    )
}