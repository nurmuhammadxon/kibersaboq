import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReportsHeaderProps {
    disableExport: boolean
    onDownloadCsv: () => void
    onDownloadPdf: () => void
    pdfLoading: boolean
}

export function ReportsHeader({
    disableExport,
    onDownloadCsv,
    onDownloadPdf,
    pdfLoading,
}: ReportsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold">Hisobotlar</h1>
                <p className="text-sm text-muted-foreground">
                    Tanlangan davr va kurs bo'yicha faollik va natijalar
                </p>
            </div>
            <div className="flex shrink-0 gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onDownloadCsv}
                    disabled={disableExport}
                >
                    <Download className="h-4 w-4" />
                    Excel (CSV)
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onDownloadPdf}
                    disabled={disableExport || pdfLoading}
                >
                    <FileText className="h-4 w-4" />
                    {pdfLoading ? "Tayyorlanmoqda..." : "PDF"}
                </Button>
            </div>
        </div>
    )
}