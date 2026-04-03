"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!token) return setError("Token yaroqsiz")
        if (password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak")
        if (password !== confirmPassword) return setError("Parollar mos kelmadi")

        setLoading(true)
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess(true)
                setTimeout(() => router.push("/login"), 3000)
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
            <div className="text-center space-y-4 py-6 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center">
                    <div className="bg-green-500/10 p-3 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-white">Parol yangilandi!</h2>
                <p className="text-sm text-zinc-400">
                    Endi yangi parolingiz bilan tizimga kirishingiz mumkin. <br />
                    Yo'naltirilmoqda...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <PasswordInput
                    label="Yangi parol"
                    value={password}
                    onChange={setPassword}
                    placeholder="Kamida 8 ta belgi"
                />
                <PasswordInput
                    label="Parolni tasdiqlash"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Parolni qayta yozing"
                />

                {error && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {!token && (
                    <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs text-center leading-relaxed">
                        ⚠️ Token topilmadi. Emaildagi havolani to'liq ochib kiring.
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 h-11"
                    disabled={loading || !token}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" /> Saqlanmoqda...
                        </span>
                    ) : "Parolni yangilash"}
                </Button>
            </form>

            <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Login sahifasiga qaytish
                </Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <AuthWrapper title="Parolni tiklash">
            <Suspense fallback={
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </AuthWrapper>
    )
}