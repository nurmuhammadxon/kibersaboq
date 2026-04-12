import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { User } from "@/hooks/use-users"

interface Props {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UsersTable({ users, onEdit, onDelete }: Props) {
    return (
        <div className="border border-border rounded-2xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-secondary-foreground">Ism</TableHead>
                        <TableHead className="text-secondary-foreground">Email</TableHead>
                        <TableHead className="text-secondary-foreground">Tashkilot</TableHead>
                        <TableHead className="text-secondary-foreground">Sana</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                Foydalanuvchi topilmadi
                            </TableCell>
                        </TableRow>
                    ) : users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-foreground text-sm">{user.email}</TableCell>
                            <TableCell className="text-foreground text-sm">{user.organizationName}</TableCell>
                            <TableCell className="text-foreground text-sm">
                                {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 justify-end">
                                    <Button size="icon" variant="ghost" className="hover:bg-secondary" onClick={() => onEdit(user)}>
                                        <Pencil className="w-4 h-4 text-secondary-foreground" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/20" onClick={() => onDelete(user.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}