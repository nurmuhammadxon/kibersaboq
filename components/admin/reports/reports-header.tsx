import { Button } from "@/components/ui/button"

interface ReportsHeaderProps {
    disableCsv: boolean
    onDownloadCsv: () => void
}

export function ReportsHeader({ disableCsv, onDownloadCsv }: ReportsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold">Hisobotlar</h1>
                <p className="text-sm text-muted-foreground">
                    Tanlangan davr va kurs bo'yicha faollik va natijalar
                </p>
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownloadCsv}
                disabled={disableCsv}
                className="shrink-0"
            >
                CSV yuklab olish
            </Button>
        </div>
    )
}
