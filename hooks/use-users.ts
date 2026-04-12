"use client"
import { useState, useEffect, useCallback } from "react"

export interface User {
    id: string
    name: string
    email: string
    role: string
    organizationName: string
    createdAt: string
}

const emptyForm = { name: "", email: "", password: "", organizationName: "" }

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

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    const openAdd = () => {
        setEditUser(null)
        setForm(emptyForm)
        setFormError("")
        setModalOpen(true)
    }

    const openEdit = (user: User) => {
        setEditUser(user)
        setForm({ name: user.name, email: user.email, password: "", organizationName: user.organizationName })
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

        if (!editUser && (!form.name || !form.email || !form.password || !form.organizationName)) {
            setFormError("Barcha maydonlar to'ldirilishi shart")
            setSaving(false)
            return
        }

        try {
            if (editUser) {
                const body: any = { name: form.name, email: form.email, organizationName: form.organizationName }
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
            await fetch(`/api/users/${id}`, { method: "DELETE" })
            setDeleteId(null)
            await fetchUsers()
        } catch {
            setError("O'chirishda xatolik yuz berdi")
        }
    }

    return {
        users, filtered, search, setSearch,
        loading, error, fetchUsers,
        modalOpen, editUser, form, setForm,
        formError, saving, deleteId, setDeleteId,
        openAdd, openEdit, closeModal,
        handleSave, handleDelete,
    }
}