"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Loader2, ArrowRight } from "lucide-react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (res?.error) {
      setError("Email yoki parol noto'g'ri")
      setLoading(false)
    } else {
      const session = await fetch("/api/auth/session").then(r => r.json())
      const role = session?.user?.role
      if (role === "SUPER_ADMIN" || role === "ORG_ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    }
  }

  return (
    <AuthWrapper title="Kirish" error={error}>
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label
            className="text-zinc-400 text-[10px] font-bold uppercase ml-1 tracking-widest"
          >
            Email manzil
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="email"
              placeholder="kibersaboq@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-zinc-950/40 border-zinc-800 text-zinc-200 h-11 focus-visible:ring-blue-600"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              Parol
            </Label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-blue-500/80 hover:text-blue-400 transition-colors font-medium hover:underline underline-offset-4"
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
          className="w-full bg-blue-600 hover:bg-blue-500 h-11 font-bold shadow-lg shadow-blue-900/20 group"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <span className="flex items-center">
              Tizimga kirish
            </span>
          )}
        </Button>

        <p className="text-center text-sm text-zinc-500 pt-4 border-t border-zinc-800/40">
          Hisobingiz yo'qmi?
          <Link href="/register" className="text-blue-500 font-bold hover:underline ml-1">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}