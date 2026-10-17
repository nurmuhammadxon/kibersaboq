"use client"
import Link from "next/link"
import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { Button } from "@/components/ui/button"

interface Props {
    code: string
}

export function CompanyCodeScreen({ code }: Props) {
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <AuthWrapper title="Ro'yxatdan o'tdingiz!" error="">
            <div className="space-y-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Xodimlaringiz platformaga qo'shilishi uchun quyidagi korxona kodini ulashing.
                </p>

                <div className="rounded-xl border border-border bg-muted/50 p-6 space-y-3">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                        Korxona kodi
                    </p>
                    <p className="text-4xl font-mono font-bold tracking-widest text-primary">
                        {code}
                    </p>
                    <Button variant="outline" size="sm" onClick={copy} className="gap-2">
                        {copied ? (
                            <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Nusxalandi</>
                        ) : (
                            <><Copy className="h-4 w-4" /> Nusxalash</>
                        )}
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Bu kodni xavfsiz joyda saqlang. Xodimlaringiz ro'yxatdan o'tishda shu kodni kiritadi.
                </p>

                <Button asChild className="w-full">
                    <Link href="/login">Tizimga kirish</Link>
                </Button>
            </div>
        </AuthWrapper>
    )
}