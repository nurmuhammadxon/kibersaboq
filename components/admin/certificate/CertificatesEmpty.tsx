import { Award } from "lucide-react"

export function CertificatesEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Sertifikat topilmadi</p>
        </div>
    )
}