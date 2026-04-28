"use client"
import { useState } from "react"

interface AddUserForm {
    firstName: string
    lastName: string
    email: string
    password: string
    organizationName: string
}

interface UseAddUserProps {
    onSuccess: () => void
    onClose: () => void
}

export function useAddUser({ onSuccess, onClose }: UseAddUserProps) {
    const [form, setForm] = useState<AddUserForm>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        organizationName: "",
    })
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setError("")
        if (!form.firstName || !form.lastName || !form.email || !form.password || !form.organizationName) {
            setError("Barcha maydonlar to'ldirilishi shart")
            return
        }
        setSaving(true)
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error)
                return
            }
            setForm({ firstName: "", lastName: "", email: "", password: "", organizationName: "" })
            onSuccess()
            onClose()
        } catch {
            setError("Xatolik yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    return {
        form, setForm,
        error,
        saving,
        handleSave,
    }
}