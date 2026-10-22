import Link from "next/link"
import { QrCode, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingVerify() {
    return (
        <section className="border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                    <QrCode className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">Sertifikatni tekshirish</h2>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        Har sertifikatda QR kod va noyob raqam bor. Telefon bilan skaner qiling yoki raqamni kiriting,
                        sertifikat haqiqiy yoki yo'qligi darrov ko'rinadi.
                    </p>
                </div>
                <Button size="lg" variant="outline" asChild className="shrink-0">
                    <Link href="/verify">
                        <ShieldCheck className="h-4 w-4" />
                        Tekshirish
                    </Link>
                </Button>
            </div>
        </section>
    )
}
