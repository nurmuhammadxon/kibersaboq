"use client"

import { useState } from "react"
import { toast } from "sonner"

interface CertificateData {
    userName: string
    courseTitle: string
    issuedAt: string
    certificateNumber: string
}

export function useCertificateDownload(fileName: string) {
    const [downloading, setDownloading] = useState(false)

    const download = async (data: CertificateData) => {
        setDownloading(true)
        try {
            const { default: jsPDF } = await import("jspdf")

            const img = new Image()
            img.src = "/certificate-template.png"
            img.crossOrigin = "anonymous"

            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const W = img.naturalWidth
            const H = img.naturalHeight

            const canvas = document.createElement("canvas")
            canvas.width = W
            canvas.height = H
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(img, 0, 0, W, H)

            const months = [
                "yanvar", "fevral", "mart", "aprel", "may", "iyun",
                "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
            ]
            const d = new Date(data.issuedAt)
            const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`

            // ─── ISM FAMILIYA ─────────────────────────────────────────
            ctx.font = `italic ${W * 0.1013}px Georgia, serif`
            ctx.fillStyle = "#C9A84C"
            ctx.textAlign = "center"
            ctx.fillText(data.userName, W * 0.5, H * 0.4532 + W * 0.1013 * 0.35)

            // ─── KURS NOMI ────────────────────────────────────────────
            ctx.font = `${W * 0.0174}px Arial, sans-serif`
            ctx.fillStyle = "#2B2D42"
            ctx.textAlign = "center"
            ctx.fillText(
                `${data.courseTitle} kursini muvaffaqiyatli yakunlaganligi tasdiqlanadi`,
                W * 0.5,
                H * 0.5535 + W * 0.0174 * 0.35
            )

            // ─── SANA ─────────────────────────────────────────────────
            ctx.font = `italic bold ${W * 0.0198}px Georgia, serif`
            ctx.fillStyle = "#2B2D42"
            ctx.textAlign = "center"
            ctx.fillText(date, W * 0.3090, H * 0.7823 + W * 0.0198 * 0.35)

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [W / 2, H / 2],
            })
            pdf.addImage(imgData, "PNG", 0, 0, W / 2, H / 2)
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