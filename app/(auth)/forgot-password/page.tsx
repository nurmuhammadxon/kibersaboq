"use client"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useForgotPassword } from "@/hooks/use-forgot-password"

export default function ForgotPasswordPage() {
    const { email, setEmail, error, setError, success, loading, handleSubmit } = useForgotPassword()

    if (success) {
        return (
            <AuthWrapper title="Email yuborildi">
                <div className="text-center space-y-4 py-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Mail className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-foreground">Emailingizni tekshiring</h2>
                        <p className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">{email}</span> manziliga tiklash havolasi yuborildi.
                        </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                <p className="text-sm text-muted-foreground text-center">
                    Email manzilingizni kiriting, tiklash havolasi yuboramiz
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Email manzil</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError("")
                                }}
                                placeholder="example@gmail.com"
                                disabled={loading}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2 justify-center">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full font-bold" disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Yuborilmoqda...</> : "Havola yuborish"}
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-border">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Login sahifasiga qaytish
                    </Link>
                </div>
            </div>
        </AuthWrapper>
    )
}