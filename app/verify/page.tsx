import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sertifikatni tekshirish",
    robots: { index: false, follow: false },
}

export default async function VerifyIndexPage({
    searchParams,
}: {
    searchParams: Promise<{ number?: string }>
}) {
    const { number } = await searchParams
    const clean = number?.trim()
    if (clean) redirect(`/verify/${encodeURIComponent(clean)}`)

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-md rounded-xl border bg-background p-6 space-y-4">
                <h1 className="text-xl font-bold">Sertifikatni tekshirish</h1>
                <p className="text-sm text-muted-foreground">
                    Sertifikatdagi raqamni kiriting yoki QR kodni telefon kamerasi bilan skaner qiling.
                </p>
                <form action="/verify" method="GET" className="space-y-3">
                    <input
                        name="number"
                        placeholder="CERT-2026-XXXXXXXXXX"
                        maxLength={40}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm font-mono"
                    />
                    <button
                        type="submit"
                        className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium"
                    >
                        Tekshirish
                    </button>
                </form>
            </div>
        </main>
    )
}
