import { Pencil, Trash2, ShieldOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { User } from "@/hooks/use-users"

interface Props {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (id: string) => void
    onBlock: (email: string) => void
    onUnblock: (email: string) => void
}

export function UsersTable({ users, onEdit, onDelete, onBlock, onUnblock }: Props) {
    return (
        <div className="border border-border rounded-2xl overflow-hidden">
            <Table className="min-w-180">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-secondary-foreground">Ism</TableHead>
                        <TableHead className="text-secondary-foreground">Email</TableHead>
                        <TableHead className="text-secondary-foreground hidden md:table-cell">Tashkilot</TableHead>
                        <TableHead className="text-secondary-foreground">Holat</TableHead>
                        <TableHead className="text-secondary-foreground hidden sm:table-cell">Sana</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                Foydalanuvchi topilmadi
                            </TableCell>
                        </TableRow>
                    ) : users.map(user => {
                        const fullName = `${user.firstName} ${user.lastName}`
                        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                        return (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                            {initials}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{fullName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-foreground text-sm">{user.email}</TableCell>
                                <TableCell className="text-foreground text-sm hidden md:table-cell">{user.organizationName}</TableCell>
                                <TableCell>
                                    {user.isBlocked ? (
                                        <Badge variant="destructive">Bloklangan</Badge>
                                    ) : (
                                        <Badge variant="secondary">Faol</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-foreground text-sm hidden sm:table-cell">
                                    {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-end">
                                        {user.isBlocked ? (
                                            <Button
                                                size="icon" variant="ghost"
                                                className="text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10"
                                                onClick={() => onUnblock(user.email)}
                                                title="Blokdan chiqarish"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="icon" variant="ghost"
                                                className="text-orange-500 hover:text-orange-500 hover:bg-orange-500/10"
                                                onClick={() => onBlock(user.email)}
                                                title="Bloklash"
                                            >
                                                <ShieldOff className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="hover:bg-secondary" onClick={() => onEdit(user)}>
                                            <Pencil className="w-4 h-4 text-secondary-foreground" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/20" onClick={() => onDelete(user.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}