"use client"

import { useEffect, useState } from "react"

interface LandingStats {
    users: number
    courses: number
    certificates: number
    organizations: number
}

export function useLandingStats() {
    const [stats, setStats] = useState<LandingStats | null>(null)

    useEffect(() => {
        fetch("/api/stats")
            .then((r) => r.json())
            .then(setStats)
            .catch(() => { })
    }, [])

    return stats
}