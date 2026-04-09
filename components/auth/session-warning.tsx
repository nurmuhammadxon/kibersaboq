"use client"

import { useEffect } from "react"
import { useSession, signOut } from "next-auth/react"

export default function SessionWarning() {
    const { data: session } = useSession()

    useEffect(() => {
        if (!session) return

        const logoutTimer = setTimeout(() => {
            signOut({ redirect: true, callbackUrl: "/login" })
        }, 2 * 60 * 60 * 1000)

        return () => clearTimeout(logoutTimer)
    }, [session])

    return null
}