import { AdminCertificatesTable } from "@/components/admin/certificate/AdminCertificatesTable"

export default function page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Sertifikatlar</h1>
                <p className="text-sm text-muted-foreground">
                    Barcha xodimlarning sertifikatlarini boshqaring
                </p>
            </div>
            <AdminCertificatesTable />
        </div>
    )
}