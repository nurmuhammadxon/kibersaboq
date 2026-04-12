"use client"
import { useState, useEffect, useCallback } from "react"

interface Course {
    id: string
    title: string
    description?: string
    level: string
    price?: number
    duration?: number
    thumbnail?: string
    isPublished: boolean
    modules: { lessons: any[] }[]
    enrollments: any[]
}

const emptyForm = {
    title: "",
    description: "",
    level: "BEGINNER",
    price: "",
    duration: "",
    thumbnail: "",
}

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editCourse, setEditCourse] = useState<Course | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [formError, setFormError] = useState("")
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const fetchCourses = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/courses")
            if (!res.ok) throw new Error()
            setCourses(await res.json())
        } catch {
            setError("Kurslarni yuklashda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchCourses() }, [fetchCourses])

    const openAdd = () => {
        setEditCourse(null)
        setForm(emptyForm)
        setFormError("")
        setModalOpen(true)
    }

    const openEdit = (course: Course) => {
        setEditCourse(course)
        setForm({
            title: course.title,
            description: course.description || "",
            level: course.level,
            price: course.price?.toString() || "",
            duration: course.duration?.toString() || "",
            thumbnail: course.thumbnail || "",
        })
        setFormError("")
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditCourse(null)
        setForm(emptyForm)
        setFormError("")
    }

    const handleSave = async () => {
        setSaving(true)
        setFormError("")
        if (!form.title) {
            setFormError("Kurs nomi kiritilishi shart")
            setSaving(false)
            return
        }
        try {
            const url = editCourse ? `/api/courses/${editCourse.id}` : "/api/courses"
            const method = editCourse ? "PATCH" : "POST"
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description || null,
                    level: form.level,
                    price: form.price ? parseFloat(form.price) : null,
                    duration: form.duration ? parseInt(form.duration) : null,
                    thumbnail: form.thumbnail || null,
                })
            })
            const data = await res.json()
            if (!res.ok) { setFormError(data.error); return }
            await fetchCourses()
            closeModal()
        } catch {
            setFormError("Xatolik yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/courses/${id}`, { method: "DELETE" })
            setDeleteId(null)
            await fetchCourses()
        } catch {
            setError("O'chirishda xatolik yuz berdi")
        }
    }

    const togglePublish = async (course: Course) => {
        await fetch(`/api/courses/${course.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublished: !course.isPublished })
        })
        await fetchCourses()
    }

    return {
        courses, loading, error, modalOpen, form, formError,
        saving, deleteId, editCourse, setForm, setDeleteId,
        openAdd, openEdit, closeModal, handleSave, handleDelete,
        togglePublish, fetchCourses
    }
}