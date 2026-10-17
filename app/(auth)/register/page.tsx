"use client"
import Link from "next/link"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { RoleSwitcher } from "@/components/auth/register/role-switcher"
import { BaseFields } from "@/components/auth/register/base-fields"
import { UserFields } from "@/components/auth/register/user-fields"
import { DirectorFields } from "@/components/auth/register/director-fields"
import { CompanyCodeScreen } from "@/components/auth/register/company-code-screen"
import { useRegister } from "@/hooks/use-register"
import Loading from "@/components/_components/loading"

export default function RegisterPage() {
  const { role, switchRole, form, updateForm, error, loading, companyCode, handleRegister } = useRegister()

  if (companyCode) {
    return <CompanyCodeScreen code={companyCode} />
  }

  return (
    <AuthWrapper title="Ro'yxatdan o'tish" error={error}>
      <RoleSwitcher role={role} onSwitch={switchRole} />

      <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
        <BaseFields
          firstName={form.firstName}
          lastName={form.lastName}
          email={form.email}
          onChange={updateForm}
        />

        {role === "USER" && (
          <UserFields
            companyCode={(form as any).companyCode}
            field={(form as any).field}
            onChange={updateForm}
          />
        )}

        {role === "DIRECTOR" && (
          <DirectorFields
            companyName={(form as any).companyName}
            organizationName={(form as any).organizationName}
            onChange={updateForm}
          />
        )}

        <PasswordInput
          label="Parol"
          value={form.password}
          onChange={(v) => updateForm("password", v)}
          placeholder="••••••••"
        />

        <PasswordInput
          label="Parolni tasdiqlang"
          value={form.confirmPassword}
          onChange={(v) => updateForm("confirmPassword", v)}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="w-full h-11 font-bold shadow-lg shadow-primary/20 mt-2"
          disabled={loading}
        >
          {loading ? <><Loading /> Amalga oshmoqda...</> : "Hisob yaratish"}
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