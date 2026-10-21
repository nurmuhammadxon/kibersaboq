"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useCertificateDownload } from "@/hooks/use-certificate-download"

export function VerifyDownloadButton({ number }: { number: string }) {
    const { download, downloading } = useCertificateDownload(`sertifikat-${number}`)
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        try {
            const res = await fetch(`/api/verify/${encodeURIComponent(number)}/certificate`)
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                toast.error(typeof data?.error === "string" ? data.error : "Yuklab bo'lmadi")
                return
            }
            await download(data)
        } finally {
            setLoading(false)
        }
    }

    const busy = loading || downloading
    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={busy}
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-60"
        >
            {busy ? "Yuklanmoqda…" : "Sertifikatni PDF yuklab olish"}
        </button>
    )
}
