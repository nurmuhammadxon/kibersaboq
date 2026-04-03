"use client"
import { usePathname } from "next/navigation"
import { adminNav, userNav } from "@/lib/constants"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { User, ChevronDown, Bell } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
    role: string
    name: string
}

export function Header({ role, name }: HeaderProps) {
    const pathname = usePathname()

    const isAdmin = role === "SUPER_ADMIN"
    const navItems = isAdmin ? adminNav : userNav

    const profilePath = "/dashboard/profile"

    const currentPage = navItems.find(i => i.href === pathname)?.label || "Boshqaruv paneli"

    return (
        <header className="h-16 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">
            <div>
                <h1 className="text-zinc-100 font-semibold text-sm leading-none mb-1">{currentPage}</h1>
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Kiber Saboq</p>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors relative cursor-pointer outline-none">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-zinc-900"></span>
                </button>

                <div className="h-8 w-0.5 bg-zinc-800 mx-1 hidden sm:block"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 hover:bg-zinc-800/50 p-1.5 rounded-xl transition-all outline-none group cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-900/20 text-[10px]">
                                {name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-zinc-200 text-sm font-medium leading-none mb-1 group-hover:text-white transition-colors">{name}</p>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
                                    {role === "SUPER_ADMIN" ? "Administrator" : "Xodim"}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300 p-2 shadow-2xl">
                        <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase px-2 py-1.5 font-bold">Hisob boshqaruvi</DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-zinc-800/50" />

                        <Link href={profilePath}>
                            <DropdownMenuItem className="focus:bg-amber-50 focus:text-white cursor-pointer rounded-lg gap-2 py-2.5 outline-none group">
                                <User className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                <span className="font-medium">Profilni tahrirlash</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}