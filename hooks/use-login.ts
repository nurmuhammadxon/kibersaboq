"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export const useLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res?.error) {
        const checkRes = await fetch("/api/auth/check-blocked", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        const check = await checkRes.json()

        if (check.isBlocked) {
          setError("Hisobingiz bloklangan. Admin bilan bog'laning.")
        } else if (check.tooManyAttempts) {
          setError("Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.")
        } else {
          setError("Email yoki parol noto'g'ri")
        }
        setLoading(false)
      } else {
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()
        const role = session?.user?.role

        if (role === "SUPER_ADMIN") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (err) {
      setError("Tizimga kirishda xatolik yuz berdi")
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleLogin
  }
}