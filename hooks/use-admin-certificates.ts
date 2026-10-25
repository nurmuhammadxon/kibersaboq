import { useState, useEffect, useCallback } from "react"

export interface Certificate {
    id: string
    certificateNumber: string
    issuedAt: string
    revokedAt: string | null
    revokedReason: string | null
    flags: string[]
    user: {
        id: string
        firstName: string
        lastName: string
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

    async function setRevoked(id: string, revoke: boolean, reason?: string) {
        const res = await fetch(`/api/admin/certificates/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ revoke, reason }),
        })
        if (!res.ok) return
        const data = await res.json()
        setCertificates((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, revokedAt: data.revokedAt, revokedReason: data.revokedReason }
                    : c
            )
        )
    }

    return { certificates, loading, deletingId, deleteCertificate, setRevoked }
}