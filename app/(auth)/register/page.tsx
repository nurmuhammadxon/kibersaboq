"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Building2, Mail, Loader2 } from "lucide-react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [form, setForm] = useState(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organizationName: ""
    }
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError("Parollar mos kelmadi")
    setLoading(true)
    try {
      const res = await fetch("/api/register", { method: "POST", body: JSON.stringify(form) })
      if (!res.ok) throw new Error("Ro'yxatdan o'tishda xatolik")
      router.push("/login")
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <AuthWrapper title="Ro'yxatdan o'tish" error={error}>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-zinc-400 text-[10px] uppercase font-bold ml-1">
              Ism Familya
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ALi Valiyev"
                className="pl-10 bg-zinc-950/40 border-zinc-800 text-zinc-200 h-11"
                required />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-zinc-400 text-[10px] uppercase font-bold ml-1">
              Tashkilot
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                placeholder="Kiber Saboq"
                className="pl-10 bg-zinc-950/40 border-zinc-800 text-zinc-200 h-11"
                required />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-zinc-400 text-[10px] uppercase font-bold ml-1">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="kibersaboq@gmail.com"
              className="pl-10 bg-zinc-950/40 border-zinc-800 text-zinc-200 h-11"
              required />
          </div>
        </div>
        <PasswordInput
          label="Parol"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <PasswordInput
          label="Tasdiqlash"
          value={form.confirmPassword}
          onChange={(v) => setForm({ ...form, confirmPassword: v })}
        />
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 h-11 mt-2"
          disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Hisob yaratish"}
        </Button>
        <p className="text-center text-sm text-zinc-500 pt-4 border-t border-zinc-800/40">
          Profilingiz bormi?
          <Link href="/login" className="text-blue-500 font-bold hover:underline ml-1">Kirish</Link>
        </p>
      </form>
    </AuthWrapper>
  )
}