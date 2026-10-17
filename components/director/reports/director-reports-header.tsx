"use client"

import { Building2, Check, Copy, Download, FileText } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface DirectorReportsHeaderProps {
    companyName?: string
    companyCode?: string
    disableExport: boolean
    onDownloadCsv: () => void
    onDownloadPdf: () => void
    pdfLoading: boolean
}

export function DirectorReportsHeader({
    companyName,
    companyCode,
    disableExport,
    onDownloadCsv,
    onDownloadPdf,
    pdfLoading,
}: DirectorReportsHeaderProps) {
    const [copied, setCopied] = useState(false)

    const copyCode = async () => {
        if (!companyCode) return
        try {
            await navigator.clipboard.writeText(companyCode)
            setCopied(true)
            toast.success("Korxona kodi nusxalandi")
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error("Nusxalab bo'lmadi")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Hisobotlar</h1>
                    <p className="text-sm text-muted-foreground">
                        Xodimlaringizning tanlangan davrdagi faolligi va natijalari
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

            {companyCode && (
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <Building2 className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{companyName}</p>
                            <p className="text-xs text-muted-foreground">
                                Xodimlar ro'yxatdan o'tishda shu kodni kiritadi
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm font-semibold tracking-wider">
                            {companyCode}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={copyCode}
                            aria-label="Kodni nusxalash"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}