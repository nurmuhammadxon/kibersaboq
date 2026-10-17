"use client"
import { useState, useEffect, useCallback } from "react"

export interface DirectorEmployee {
    id: string
    firstName: string
    lastName: string
    email: string
    field: string | null
    createdAt: string
    isBlocked: boolean
    totalEnrollments: number
    completedEnrollments: number
    certificates: number
    avgScore: number
    progressPercent: number
}

export function useDirectorEmployees() {
    const [employees, setEmployees] = useState<DirectorEmployee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/director/employees")
            if (!res.ok) throw new Error("Xodimlarni yuklashda xatolik")
            const data = await res.json()
            setEmployees(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchEmployees() }, [fetchEmployees])

    const filtered = employees.filter(emp => {
        const q = search.toLowerCase()
        return (
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
            emp.email.toLowerCase().includes(q) ||
            (emp.field ?? "").toLowerCase().includes(q)
        )
    })

    return { employees, filtered, loading, error, search, setSearch, refresh: fetchEmployees }
}