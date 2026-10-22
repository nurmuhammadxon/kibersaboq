import Link from "next/link"
import { Shield, CheckCircle2, Award, ArrowRight, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

const points = [
    "Qisqa darslar va har dars uchun test",
    "Kursni tugatganda sertifikat",
    "Direktor uchun xodimlar natijasi hisoboti",
]

export function LandingHero() {
    return (
        <section className="px-4 sm:px-6 py-14 sm:py-20">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
                    <div className="inline-flex items-center gap-2 bg-primary/15 text-primary text-sm px-4 py-1.5 rounded-full">
                        <Shield className="h-4 w-4" />
                        Kiberxavfsizlik ta'lim platformasi
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                        Xodimlaringiz{" "}
                        <span className="text-primary">kiberhujumga</span>{" "}
                        tayyor bo'lsin
                    </h1>

                    <p className="text-muted-foreground text-lg max-w-xl">
                        Ko'pchilik hujumlar xodimning bitta noto'g'ri bosgan havolasidan boshlanadi.
                        KiberSaboq xodimlarni fishing, parol va zararli fayllardan saqlanishga
                        o'rgatadi.
                    </p>

                    <ul className="flex flex-col gap-2 text-sm text-left">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>{p}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                        <Button size="lg" asChild>
                            <Link href="/register">
                                Tashkilotni ro'yxatdan o'tkazish
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Kirish</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
                    <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
                    <div className="relative bg-card border border-border rounded-2xl p-5 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Namuna ko'rinish</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">Faol</span>
                        </div>
                        <div>
                            <p className="font-semibold">Kiberxavfsizlik asoslari</p>
                            <p className="text-xs text-muted-foreground mt-0.5">3 modul · 9 dars</p>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Jarayon</span>
                                <span>6 / 9 dars</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                <div className="h-full w-2/3 bg-primary rounded-full" />
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                            {[
                                ["Fishing va ijtimoiy muhandislik", true],
                                ["Parollar va ikki bosqichli tasdiqlash", true],
                                ["Zararli dasturlar va qurilma xavfsizligi", false],
                            ].map(([t, done]) => (
                                <li key={String(t)} className="flex items-center gap-2">
                                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${done ? "text-emerald-400" : "text-muted-foreground/50"}`} />
                                    <span className={done ? "" : "text-muted-foreground"}>{t}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 p-3">
                            <Award className="h-8 w-8 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Sertifikat</p>
                                <p className="text-xs text-muted-foreground">Kursni tugatganda beriladi</p>
                            </div>
                            <QrCode className="h-8 w-8 text-muted-foreground shrink-0" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
