"use client"
import { Suspense } from "react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useResetPassword } from "@/hooks/use-reset-password"
import Loading from "@/components/_components/loading"

function ResetPasswordForm() {
    const {
        token,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        error, success, loading, handleReset
    } = useResetPassword()

    if (success) {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center">
                    <div className="bg-green-500/10 p-4 rounded-full">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Parol yangilandi!</h2>
                    <p className="text-sm text-zinc-400">
                        Yangi parolingiz bilan tizimga kirishingiz mumkin. <br />
                        Yo'naltirilmoqda...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleReset} className="space-y-4">
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
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 justify-center">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {!token && (
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Token topilmadi. Havolani emaildan qayta tekshiring.</span>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 h-11 font-bold rounded-lg transition-all"
                    disabled={loading || !token}
                >
                    {loading ? (
                        <><Loading /> Saqlanmoqda...</>
                    ) : (
                        "Parolni yangilash"
                    )}
                </Button>
            </form>

            <div className="text-center pt-4 border-t border-zinc-800/40">
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
                    <Loading />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </AuthWrapper>
    )
}