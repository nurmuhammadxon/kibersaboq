"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero() {
    return (
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full">
                <Shield className="h-4 w-4" />
                Kiberxavfsizlik ta'lim platformasi
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
                Xodimlaringizni{" "}
                <span className="text-primary">kiberxavfsizlik</span>{" "}
                bo'yicha o'qiting
            </h1>

            <p className="text-muted-foreground text-lg max-w-xl">
                Zamonaviy kurslar, test va sertifikatlar orqali tashkilotingiz
                xodimlarining kiberxavfsizlik saviyasini oshiring.
            </p>

            <div className="flex gap-3 flex-wrap justify-center">
                <Button size="lg" asChild>
                    <Link href="/login">Boshlash</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/register">Ro'yxatdan o'tish</Link>
                </Button>
            </div>
        </section>
    )
}