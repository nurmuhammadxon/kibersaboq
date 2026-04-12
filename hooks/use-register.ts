"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const useRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Foydalanuvchi yoza boshlasa xatoni o'chirish
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Front-end validatsiya
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
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Ro'yxatdan o'tishda xatolik yuz berdi")
      }

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    updateForm,
    error,
    loading,
    handleRegister
  }
}