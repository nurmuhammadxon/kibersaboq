"use client"
import { useState, useEffect, useCallback } from "react"

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    organizationName: string
    createdAt: string
    isBlocked: boolean
}

const emptyForm = { firstName: "", lastName: "", email: "", password: "", organizationName: "" }

export function useUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editUser, setEditUser] = useState<User | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [formError, setFormError] = useState("")
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/users")
            if (!res.ok) throw new Error()
            setUsers(await res.json())
        } catch {
            setError("Foydalanuvchilarni yuklashda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const filtered = users.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
        const q = search.toLowerCase()
        return fullName.includes(q) || u.email.toLowerCase().includes(q)
    })

    const openAdd = () => {
        setEditUser(null)
        setForm(emptyForm)
        setFormError("")
        setModalOpen(true)
    }

    const openEdit = (user: User) => {
        setEditUser(user)
        setForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            organizationName: user.organizationName,
        })
        setFormError("")
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditUser(null)
        setForm(emptyForm)
        setFormError("")
    }

    const handleSave = async () => {
        setSaving(true)
        setFormError("")

        if (!editUser && (!form.firstName || !form.lastName || !form.email || !form.password || !form.organizationName)) {
            setFormError("Barcha maydonlar to'ldirilishi shart")
            setSaving(false)
            return
        }

        try {
            if (editUser) {
                const body: any = {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    organizationName: form.organizationName,
                }
                if (form.password) body.password = form.password
                const res = await fetch(`/api/users/${editUser.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                })
                const data = await res.json()
                if (!res.ok) { setFormError(data.error); setSaving(false); return }
            } else {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                })
                const data = await res.json()
                if (!res.ok) { setFormError(data.error); setSaving(false); return }
            }
            await fetchUsers()
            closeModal()
        } catch {
            setFormError("Xatolik yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                setError(data?.error || "O'chirishda xatolik yuz berdi")
                return
            }
            setDeleteId(null)
            await fetchUsers()
        } catch {
            setError("O'chirishda xatolik yuz berdi")
        }
    }

    const handleUnblock = async (email: string) => {
        try {
            await fetch("/api/admin/unblock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            await fetchUsers()
        } catch {
            setError("Blokdan chiqarishda xatolik")
        }
    }

    const handleBlock = async (email: string) => {
        try {
            await fetch("/api/admin/block", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            await fetchUsers()
        } catch {
            setError("Bloklashda xatolik")
        }
    }

    return {
        users, filtered, search, setSearch,
        loading, error, fetchUsers,
        modalOpen, editUser, form, setForm,
        formError, saving, deleteId, setDeleteId,
        openAdd, openEdit, closeModal,
        handleSave, handleDelete,
        handleUnblock, handleBlock,
    }
}