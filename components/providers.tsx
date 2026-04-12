"use client"

import { useState } from "react"
import { SessionProvider } from "next-auth/react"
import { Sidebar } from "./layout/sidebar"
import { Header } from "./layout/header"
import { Footer } from "./layout/footer"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

interface LayoutWrapperProps {
    role: string
    name: string
    children: React.ReactNode
}

export function LayoutWrapper({ role, name, children }: LayoutWrapperProps) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar role={role} name={name} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col lg:ml-64">
                <Header role={role} name={name} onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 md:p-6">{children}</main>
                <Footer />
            </div>
        </div>
    )
}