"use client"

import { useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminCertificates } from "@/hooks/use-admin-certificates"
import { CertificatesFilters } from "./CertificatesFilters"
import { CertificatesEmpty } from "./CertificatesEmpty"
import { CertificateTableRow } from "./CertificateTableRow"
import Loading from "@/components/_components/loading"

export function AdminCertificatesTable() {
    const [userSearch, setUserSearch] = useState("")
    const [courseSearch, setCourseSearch] = useState("")

    const { certificates, loading, deletingId, deleteCertificate } =
        useAdminCertificates(userSearch, courseSearch)

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-base font-medium">
                        Jami: <span className="text-primary">{certificates.length} ta</span>
                    </CardTitle>
                    <CertificatesFilters
                        userSearch={userSearch}
                        courseSearch={courseSearch}
                        onUserSearch={setUserSearch}
                        onCourseSearch={setCourseSearch}
                    />
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? <Loading /> : certificates.length === 0 ? (
                    <CertificatesEmpty />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Xodim</TableHead>
                                <TableHead>Kurs</TableHead>
                                <TableHead>Daraja</TableHead>
                                <TableHead>Sertifikat raqami</TableHead>
                                <TableHead>Berilgan sana</TableHead>
                                <TableHead className="text-right">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.map((cert) => (
                                <CertificateTableRow
                                    key={cert.id}
                                    certificate={cert}
                                    isDeleting={deletingId === cert.id}
                                    onDelete={deleteCertificate}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}