import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingCta() {
    return (
        <section className="border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
                <h2 className="text-2xl sm:text-3xl font-bold">Jamoangizni bugundan o'qitishni boshlang</h2>
                <p className="text-muted-foreground">Tashkilotni ro'yxatdan o'tkazing, korxona kodini xodimlarga yuboring.</p>
                <div className="flex gap-3 flex-wrap justify-center">
                    <Button size="lg" asChild><Link href="/register">Ro'yxatdan o'tish</Link></Button>
                    <Button size="lg" variant="outline" asChild><Link href="/login">Kirish</Link></Button>
                </div>
            </div>
        </section>
    )
}
