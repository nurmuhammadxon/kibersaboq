"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LogOut, Menu, X, Shield } from "lucide-react"
import { adminNav, userNav } from "@/lib/constants"
import { Logo } from "./logo"

interface SidebarProps {
    role: string
    name: string
}

export function Sidebar({ role, name }: SidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(true)
    const [mobileOpen, setMobileOpen] = useState(false)

    const isAdmin = role === "SUPER_ADMIN" || role === "ORG_ADMIN"
    const navItems = isAdmin ? adminNav : userNav

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                            {(open || mobileOpen) && <span className="text-sm font-medium">{label}</span>}

                            {/* Tooltip for collapsed mode */}
                            {!open && !mobileOpen && (
                                <div className="absolute left-14 bg-zinc-800 text-white text-[10px] font-bold uppercase px-2 py-1.5 rounded-md border border-zinc-700 hidden group-hover:block whitespace-nowrap z-50 pointer-events-none tracking-wider">
                                    {label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                    {(open || mobileOpen) && <span className="text-sm font-medium">Chiqish</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop aside - O'zgarishsiz qoldi, faqat NavContent ichidagi mantiq yangilandi */}
            <aside className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-zinc-950 border-r border-zinc-900 flex-col fixed left-0 top-0 bottom-0 z-40 hidden lg:flex`}>
                <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-900">
                    {open ? <Logo /> : <div className="p-1.5 bg-blue-600 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                    </div>}
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-900"
                    >
                        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
                <NavContent />
            </aside>

        </>
    )
}