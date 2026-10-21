"use client"

import { useState } from "react"
import { toast } from "sonner"
import { renderCertificateCanvas, type CertificateData } from "@/lib/certificate-render"

export function useCertificateDownload(fileName: string) {
    const [downloading, setDownloading] = useState(false)

    const download = async (data: CertificateData) => {
        setDownloading(true)
        try {
            const { default: jsPDF } = await import("jspdf")
            const canvas = await renderCertificateCanvas(data)
            const W = canvas.width
            const H = canvas.height

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [W / 2, H / 2],
            })
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, W / 2, H / 2)
            pdf.save(`${fileName}.pdf`)
            toast.success("Sertifikat yuklab olindi!")
        } catch (err) {
            console.error(err)
            toast.error("Sertifikat yaratishda xatolik")
        } finally {
            setDownloading(false)
        }
    }

    return { download, downloading }
}
