"use client"
import { useState } from "react"

export const useForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validatsiya
    if (!email) return setError("Email manzilini kiriting")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Email manzil noto'g'ri")

    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Xatolik yuz berdi")
      }
    } catch {
      setError("Server bilan aloqa uzildi")
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    error,
    setError,
    success,
    loading,
    handleSubmit
  }
}