"use client"

import { useLandingStats } from "@/hooks/use-landing-stats"

export function LandingStats() {
    const stats = useLandingStats()

    const items = [
        { value: stats?.users ?? "—", label: "Faol foydalanuvchi" },
        { value: stats?.courses ?? "—", label: "Kurs" },
        { value: stats?.certificates ?? "—", label: "Berilgan sertifikat" },
    ]

    return (
        <section className="border-t border-border px-6 py-16">
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8">
                {items.map((s) => (
                    <div key={s.label} className="flex flex-col items-center text-center gap-1">
                        <span className="text-4xl font-bold text-primary">{s.value}</span>
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}