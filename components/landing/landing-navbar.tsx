"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "../layout/logo"

export function LandingNavbar() {
    return (
        <header className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Logo />
            </div>
            <Button asChild>
                <Link href="/login">Kirish</Link>
            </Button>
        </header>
    )
}