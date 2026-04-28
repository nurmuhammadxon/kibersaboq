"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const useRegister = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          organizationName: form.organizationName,
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi")
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