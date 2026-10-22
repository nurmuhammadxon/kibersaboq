"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "../layout/logo"

const links = [
    { href: "#imkoniyatlar", label: "Imkoniyatlar" },
    { href: "#qanday-ishlaydi", label: "Qanday ishlaydi" },
    { href: "#dastur", label: "Kurs dasturi" },
    { href: "#faq", label: "Savollar" },
]

export function LandingNavbar() {
    return (
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                <Link href="/" aria-label="KiberSaboq">
                    <Logo />
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                            {l.label}
                        </a>
                    ))}
                    <Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors">
                        Sertifikatni tekshirish
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild className="hidden sm:inline-flex">
                        <Link href="/register">Ro'yxatdan o'tish</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login">Kirish</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
