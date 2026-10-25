import Link from "next/link"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { lookupCertificate } from "@/lib/certificate-verify"
import { isLimited, recordHit } from "@/lib/rate-limit"
import { VerifyDownloadButton } from "./download-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Sertifikatni tekshirish",
    robots: { index: false, follow: false },
}

const MAX_PER_WINDOW = 40
const WINDOW_MS = 10 * 60 * 1000

function formatDate(d: Date) {
    return d.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Tashkent",
    })
}

export default async function VerifyPage({
    params,
}: {
    params: Promise<{ number: string }>
}) {
    const { number: raw } = await params
    const number = decodeURIComponent(raw).trim()

    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
    const key = `verify:${ip}`
    const limited = await isLimited(key, MAX_PER_WINDOW, WINDOW_MS)
    if (!limited) await recordHit(key, ip)

    const result = limited ? null : await lookupCertificate(number)

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-md rounded-xl border bg-background p-6 space-y-5">
                <h1 className="text-sm font-medium text-muted-foreground">
                    KiberSaboq: sertifikatni tekshirish
                </h1>

                {limited && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
                        <p className="font-semibold">Juda ko&apos;p so&apos;rov</p>
                        <p className="text-sm mt-1">Bir necha daqiqadan keyin qayta urinib ko&apos;ring.</p>
                    </div>
                )}

                {result?.status === "valid" && (
                    <>
                        <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-900">
                            <p className="font-semibold text-lg">✓ Sertifikat haqiqiy</p>
                            <p className="text-sm mt-1">Bu sertifikat tizimda ro&apos;yxatdan o&apos;tgan.</p>
                        </div>
                        <Details result={result} />
                        <VerifyDownloadButton number={result.number} />
                    </>
                )}

                {result?.status === "revoked" && (
                    <>
                        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
                            <p className="font-semibold text-lg">✗ Sertifikat bekor qilingan</p>
                            <p className="text-sm mt-1">
                                Bu sertifikat {result.revokedAt ? formatDate(result.revokedAt) : ""} sanasida
                                bekor qilingan va hozir amal qilmaydi.
                                {result.revokedReason ? ` Sabab: ${result.revokedReason}` : ""}
                            </p>
                        </div>
                        <Details result={result} />
                    </>
                )}

                {result?.status === "notfound" && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-900">
                        <p className="font-semibold text-lg">✗ Sertifikat topilmadi</p>
                        <p className="text-sm mt-1">
                            Bunday raqamli sertifikat tizimda yo&apos;q. Hujjat soxta bo&apos;lishi mumkin.
                        </p>
                    </div>
                )}

                <Link href="/verify" className="block text-center text-sm text-primary underline">
                    Boshqa raqamni tekshirish
                </Link>
            </div>
        </main>
    )
}

function Details({
    result,
}: {
    result: Extract<Awaited<ReturnType<typeof lookupCertificate>>, { holder: string }>
}) {
    const rows: [string, string][] = [
        ["Egasi", result.holder],
        ["Kurs", result.courseTitle],
        ...(result.organization ? ([["Korxona", result.organization]] as [string, string][]) : []),
        ["Berilgan sana", formatDate(result.issuedAt)],
        ["Sertifikat raqami", result.number],
    ]
    return (
        <dl className="divide-y text-sm">
            {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-right break-all">{v}</dd>
                </div>
            ))}
        </dl>
    )
}
