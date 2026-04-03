"use client"
import { useState } from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!email) return setError("Email manzilini kiriting")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Email manzil noto'g'ri")

        setLoading(true)

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
            } else {
                setError(data.error || "Xatolik yuz berdi")
            }
        } catch {
            setError("Server bilan aloqa uzildi")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <AuthWrapper title="Email yuborildi">
                <div className="text-center space-y-4 py-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center">
                        <div className="bg-blue-500/10 p-4 rounded-full">
                            <Mail className="w-12 h-12 text-blue-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">Emailingizni tekshiring</h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            <span className="text-white font-medium">{email}</span> manziliga
                            parolni tiklash havolasi yuborildi.
                        </p>
                        <p className="text-xs text-zinc-500">
                            Spam papkasini ham tekshiring
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Login sahifasiga qaytish
                        </Link>
                    </div>
                </div>
            </AuthWrapper>
        )
    }

    return (
        <AuthWrapper title="Parolni tiklash">
            <div className="space-y-6">
                <p className="text-sm text-zinc-400 text-center">
                    Email manzilingizni kiriting, tiklash havolasi yuboramiz
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Email manzil
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError("")
                            }}
                            placeholder="example@gmail.com"
                            disabled={loading}
                            className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 
                                       focus:border-blue-500 focus:ring-blue-500/20 h-11"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 transition-all"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" /> Yuborilmoqda...
                            </span>
                        ) : "Havola yuborish"}
                    </Button>
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Login sahifasiga qaytish
                    </Link>
                </div>
            </div>
        </AuthWrapper>
    )
}