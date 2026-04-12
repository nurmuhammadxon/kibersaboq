"use client"
import { useState, useEffect, useCallback } from "react"

export interface Lesson {
    id: string
    title: string
    type: string
    order: number
}

export interface Module {
    id: string
    title: string
    order: number
    lessons: Lesson[]
}

export interface Course {
    id: string
    title: string
    description?: string
    isPublished: boolean
    modules: Module[]
    enrollments: any[]
}

export function useCourseDetail(courseId: string) {
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [expandedModules, setExpandedModules] = useState<string[]>([])

    // Module modal
    const [moduleModal, setModuleModal] = useState(false)
    const [moduleTitle, setModuleTitle] = useState("")
    const [moduleSaving, setModuleSaving] = useState(false)
    const [moduleError, setModuleError] = useState("")
    const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null)

    // Lesson modal
    const [lessonModal, setLessonModal] = useState(false)
    const [lessonModuleId, setLessonModuleId] = useState<string | null>(null)
    const [lessonTitle, setLessonTitle] = useState("")
    const [lessonType, setLessonType] = useState("TEXT")
    const [lessonSaving, setLessonSaving] = useState(false)
    const [lessonError, setLessonError] = useState("")
    const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null)

    const fetchCourse = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`/api/courses/${courseId}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            setCourse(data)
            setExpandedModules(data.modules.map((m: Module) => m.id))
        } catch {
            setError("Kurs yuklanmadi")
        } finally {
            setLoading(false)
        }
    }, [courseId])

    useEffect(() => { fetchCourse() }, [fetchCourse])

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(i => i !== moduleId)
                : [...prev, moduleId]
        )
    }

    // Module
    const openModuleModal = () => {
        setModuleTitle("")
        setModuleError("")
        setModuleModal(true)
    }

    const handleAddModule = async () => {
        if (!moduleTitle) { setModuleError("Modul nomi kiritilishi shart"); return }
        setModuleSaving(true)
        setModuleError("")
        try {
            const res = await fetch(`/api/courses/${courseId}/modules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: moduleTitle,
                    order: (course?.modules.length || 0) + 1
                })
            })
            if (!res.ok) throw new Error()
            setModuleModal(false)
            setModuleTitle("")
            await fetchCourse()
        } catch {
            setModuleError("Xatolik yuz berdi")
        } finally {
            setModuleSaving(false)
        }
    }

    const handleDeleteModule = async (moduleId: string) => {
        await fetch(`/api/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" })
        setDeleteModuleId(null)
        await fetchCourse()
    }

    // Lesson
    const openLessonModal = (moduleId: string) => {
        setLessonModuleId(moduleId)
        setLessonTitle("")
        setLessonType("TEXT")
        setLessonError("")
        setLessonModal(true)
    }

    const handleAddLesson = async () => {
        if (!lessonTitle) { setLessonError("Dars nomi kiritilishi shart"); return }
        setLessonSaving(true)
        setLessonError("")
        try {
            const module = course?.modules.find(m => m.id === lessonModuleId)
            const res = await fetch(`/api/courses/${courseId}/modules/${lessonModuleId}/lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: lessonTitle,
                    type: lessonType,
                    order: (module?.lessons.length || 0) + 1,
                    content: ""
                })
            })
            if (!res.ok) throw new Error()
            setLessonModal(false)
            setLessonTitle("")
            await fetchCourse()
        } catch {
            setLessonError("Xatolik yuz berdi")
        } finally {
            setLessonSaving(false)
        }
    }

    const handleDeleteLesson = async (lessonId: string, moduleId: string) => {
        await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, { method: "DELETE" })
        setDeleteLessonId(null)
        await fetchCourse()
    }

    return {
        course, loading, error, fetchCourse,
        expandedModules, toggleModule,
        moduleModal, setModuleModal, moduleTitle, setModuleTitle,
        moduleSaving, moduleError, deleteModuleId, setDeleteModuleId,
        openModuleModal, handleAddModule, handleDeleteModule,
        lessonModal, setLessonModal, lessonModuleId,
        lessonTitle, setLessonTitle, lessonType, setLessonType,
        lessonSaving, lessonError, deleteLessonId, setDeleteLessonId,
        openLessonModal, handleAddLesson, handleDeleteLesson,
    }
}