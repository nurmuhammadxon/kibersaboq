"use client"

import { useCallback, useEffect, useState } from "react"

export interface DirectorCertificate {
    id: string
    certificateNumber: string
    issuedAt: string
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
        field: string | null
    }
    course: {
        id: string
        title: string
        level: string
    }
}

export function useDirectorCertificates() {
    const [certificates, setCertificates] = useState<DirectorCertificate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userSearch, setUserSearch] = useState("")
    const [courseSearch, setCourseSearch] = useState("")

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const params = new URLSearchParams()
            if (userSearch) params.set("user", userSearch)
            if (courseSearch) params.set("course", courseSearch)

            const res = await fetch(`/api/director/certificates?${params}`)
            if (!res.ok) throw new Error("Sertifikatlarni yuklashda xatolik")
            setCertificates(await res.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
        } finally {
            setLoading(false)
        }
    }, [userSearch, courseSearch])

    useEffect(() => {
        const t = setTimeout(fetchCertificates, 300)
        return () => clearTimeout(t)
    }, [fetchCertificates])

    return {
        certificates,
        loading,
        error,
        userSearch,
        setUserSearch,
        courseSearch,
        setCourseSearch,
        refresh: fetchCertificates,
    }
}