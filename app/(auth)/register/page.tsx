"use client"
import Link from "next/link"
import { User, Building2, Mail } from "lucide-react"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegister } from "@/hooks/use-register"
import Loading from "@/components/_components/loading"

export default function RegisterPage() {
  const { form, updateForm, error, loading, handleRegister } = useRegister()

  return (
    <AuthWrapper title="Ro'yxatdan o'tish" error={error}>
      <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold ml-1">Ism</Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={form.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
                placeholder="Ali"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold ml-1">Familya</Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={form.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
                placeholder="Valiyev"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold ml-1">Tashkilot</Label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={form.organizationName}
              onChange={(e) => updateForm("organizationName", e.target.value)}
              placeholder="Kiber Saboq"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-[10px] sm:text-xs uppercase font-bold ml-1">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              placeholder="kibersaboq@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <PasswordInput
          label="Parol"
          value={form.password}
          onChange={(v) => updateForm("password", v)}
          placeholder="••••••••"
        />

        <PasswordInput
          label="Parolni tasdiqlash"
          value={form.confirmPassword}
          onChange={(v) => updateForm("confirmPassword", v)}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="w-full h-11 font-bold shadow-lg shadow-primary/20 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <><Loading /> Amalga oshmoqda...</>
          ) : (
            "Hisob yaratish"
          )}
        </Button>

        <p className="text-center text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border">
          Profilingiz bormi?
          <Link href="/login" className="text-primary font-bold hover:text-primary/80 ml-2">
            Kirish
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}