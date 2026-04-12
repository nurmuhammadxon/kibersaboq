"use client"
import Link from "next/link"
import { Mail, Loader2 } from "lucide-react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/use-login"

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    error, loading,
    handleLogin
  } = useLogin()

  return (
    <AuthWrapper title="Kirish" error={error}>
      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

        <div className="space-y-2">
          <Label className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase ml-1 tracking-widest block">
            Email manzil
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
            <Input
              type="email"
              placeholder="kibersaboq@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-10 sm:h-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              Parol
            </Label>
            <Link
              href="/forgot-password"
              className="text-[10px] sm:text-xs text-primary/80 hover:text-primary transition-colors font-medium hover:underline underline-offset-2"
            >
              Unutdingizmi?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            label=""
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 sm:h-11 font-bold shadow-lg shadow-primary/20 rounded-lg transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Tizimga kirish"
          )}
        </Button>

        <p className="text-center text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border">
          Hisobingiz yo'qmi?
          <Link href="/register" className="text-primary font-bold hover:text-primary/80 ml-2">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}