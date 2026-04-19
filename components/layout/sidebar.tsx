"use client"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut, X } from "lucide-react"
import { adminNav, userNav } from "@/lib/constants"
import { Logo } from "./logo"

interface SidebarProps {
    role: string
    name: string
    mobileOpen: boolean
    onClose: () => void
}

function isSidebarActive(pathname: string, href: string): boolean {
    const exactRoots = new Set(["/dashboard", "/admin"])
    if (pathname === href) return true
    if (exactRoots.has(href)) return false
    return pathname.startsWith(`${href}/`)
}

export function Sidebar({ role, name, mobileOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const isAdmin = role === "SUPER_ADMIN"
    const navItems = isAdmin ? adminNav : userNav

    useEffect(() => {
        onClose()
    }, [pathname])

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = isSidebarActive(pathname, href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                                ${isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-foreground" : "group-hover:scale-110 transition-transform"}`} />
                            <span className="text-sm font-medium">{label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="p-3 border-t border-border">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full group cursor-pointer"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Chiqish</span>
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* DESKTOP */}
            <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col">
                <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
                    <Logo />
                </div>
                <NavContent />
            </aside>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* MOBILE DRAWER */}
            <aside className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
                    <Logo />
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <NavContent />
            </aside>
        </>
    )
}