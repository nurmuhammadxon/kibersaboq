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
        setError("Email yoki parol noto'g'ri")
        setLoading(false)
      } else {
        // Sessiyani tekshirib, rolega qarab yo'naltirish
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