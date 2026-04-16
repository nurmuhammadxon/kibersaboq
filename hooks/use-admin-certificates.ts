import { useState, useEffect, useCallback } from "react"

export interface Certificate {
    id: string
    certificateNumber: string
    issuedAt: string
    user: {
        id: string
        name: string
        email: string
        organizationName: string
    }
    course: {
        id: string
        title: string
        level: string
    }
}

export function useAdminCertificates(userSearch: string, courseSearch: string) {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const fetchCertificates = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (userSearch) params.set("user", userSearch)
            if (courseSearch) params.set("course", courseSearch)
            const res = await fetch(`/api/admin/certificates?${params}`)
            const data = await res.json()
            setCertificates(data)
        } finally {
            setLoading(false)
        }
    }, [userSearch, courseSearch])

    useEffect(() => {
        const timer = setTimeout(fetchCertificates, 300)
        return () => clearTimeout(timer)
    }, [fetchCertificates])

    async function deleteCertificate(id: string) {
        setDeletingId(id)
        try {
            await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" })
            setCertificates((prev) => prev.filter((c) => c.id !== id))
        } finally {
            setDeletingId(null)
        }
    }

    return { certificates, loading, deletingId, deleteCertificate }
}