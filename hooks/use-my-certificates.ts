"use client"

import { useCallback, useEffect, useState } from "react"

export interface MyCertificate {
    id: string
    certificateNumber: string
    issuedAt: string
    course: {
        id: string
        title: string
        level: string
    }
    user: {
        firstName: string
        lastName: string
    }
}

export function useMyCertificates() {
    const [certificates, setCertificates] = useState<MyCertificate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch("/api/certificates")
            if (!res.ok) throw new Error("Sertifikatlarni yuklashda xatolik")
            const json = await res.json()
            setCertificates(json)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Xatolik")
            setCertificates([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCertificates()
    }, [fetchCertificates])

    return { certificates, loading, error, refresh: fetchCertificates }
}
