"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export const useProfile = () => {
    const { data: session, update } = useSession()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [changeEmail, setChangeEmail] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const role = (session?.user as any)?.role
    const isAdmin = role === "SUPER_ADMIN"

    useEffect(() => {
        if (session?.user?.name) setName(session.user.name)
        if (session?.user?.email) setEmail(session.user.email)
    }, [session])

    useEffect(() => {
        if (!changeEmail && session?.user?.email) {
            setEmail(session.user.email)
        }
    }, [changeEmail, session])

    const handleUpdate = async () => {
        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email: isAdmin && changeEmail ? email : undefined,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error)
                return
            }

            await update({ name, email: isAdmin && changeEmail ? email : undefined })
            setMessage("Profil muvaffaqiyatli yangilandi!")
            setCurrentPassword("")
            setNewPassword("")
            setChangeEmail(false)
        } catch {
            setError("Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return {
        state: { name, email, changeEmail, currentPassword, newPassword, loading, message, error, session, isAdmin },
        actions: { setName, setEmail, setChangeEmail, setCurrentPassword, setNewPassword, handleUpdate }
    }
}