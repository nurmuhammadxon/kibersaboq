"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export const useResetPassword = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!token) return setError("Token yaroqsiz yoki muddati o'tgan")
        if (password.length < 8) return setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak")
        if (password !== confirmPassword) return setError("Parollar mos kelmadi")

        setLoading(true)
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                // 60 soniyadan so'ng login sahifasiga o'tkazish
                setTimeout(() => router.push("/login"), 10000)
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
        token,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        loading,
        handleReset
    }
}