"use client"
import { useState, useEffect } from "react"

interface Organization {
    id: string
    name: string
}

interface AddUserForm {
    name: string
    email: string
    password: string
}

interface UseAddUserProps {
    onSuccess: () => void
    onClose: () => void
}

export function useAddUser({ onSuccess, onClose }: UseAddUserProps) {
    const [form, setForm] = useState<AddUserForm>({ name: "", email: "", password: "" })
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch("/api/auth/session")
            .then(res => res.json())
            .then(data => {
                if (data?.user?.organizationId) {
                    fetch(`/api/organizations/${data.user.organizationId}`)
                        .then(res => res.json())
                        .then(org => setOrganization(org))
                }
            })
    }, [])

    const handleSave = async () => {
        setError("")
        if (!form.name || !form.email || !form.password) {
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
            setForm({ name: "", email: "", password: "" })
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
        organization,
        error,
        saving,
        handleSave,
    }
}