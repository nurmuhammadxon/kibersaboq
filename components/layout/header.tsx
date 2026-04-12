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
import { User, ChevronDown, Menu } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
    role: string
    name: string
    onMenuClick: () => void
}

export function Header({ role, name, onMenuClick }: HeaderProps) {
    const pathname = usePathname()
    const isAdmin = role === "SUPER_ADMIN"
    const navItems = isAdmin ? adminNav : userNav
    const currentPage = navItems.find(i => i.href === pathname)?.label || "Boshqaruv paneli"

    return (
        <header className="h-16 bg-card/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-foreground font-semibold text-sm leading-none mb-1">{currentPage}</h1>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Kiber Saboq</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 hover:bg-secondary p-1.5 rounded-xl transition-all outline-none group cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 text-[10px]">
                                {name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-foreground text-sm font-medium leading-none mb-1 group-hover:text-foreground transition-colors">{name}</p>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-tighter">
                                    {role === "SUPER_ADMIN" ? "Administrator" : ""}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl">
                        <DropdownMenuLabel className="text-muted-foreground text-[10px] uppercase px-2 py-1.5 font-bold">
                            Hisob boshqaruvi
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                            <DropdownMenuItem className="cursor-pointer rounded-lg gap-2 py-2.5 outline-none">
                                <User className="w-4 h-4 text-primary" />
                                <span className="font-medium">Profilni tahrirlash</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}