"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Role = "USER" | "DIRECTOR"

type UserForm = {
  role: "USER"
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  companyCode: string
  field: string
}

type DirectorForm = {
  role: "DIRECTOR"
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  organizationName: string
}

type RegisterForm = UserForm | DirectorForm

const userDefault: UserForm = {
  role: "USER",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyCode: "",
  field: "",
}

const directorDefault: DirectorForm = {
  role: "DIRECTOR",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  organizationName: "",
}

export const useRegister = () => {
  const [role, setRole] = useState<Role>("USER")
  const [form, setForm] = useState<RegisterForm>(userDefault)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [companyCode, setCompanyCode] = useState<string | null>(null)
  const router = useRouter()

  const switchRole = (newRole: Role) => {
    setRole(newRole)
    setError("")
    setCompanyCode(null)
    setForm(newRole === "USER" ? userDefault : directorDefault)
  }

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      return setError("Parollar mos kelmadi")
    }
    if (form.password.length < 6) {
      return setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi")
      }

      if (data.companyCode) {
        setCompanyCode(data.companyCode)
        return
      }

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    role,
    switchRole,
    form,
    updateForm,
    error,
    loading,
    companyCode,
    handleRegister,
  }
}