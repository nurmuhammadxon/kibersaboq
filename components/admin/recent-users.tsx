import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface RecentUser {
    id: string
    name: string
    email: string
    createdAt: string
}

export function RecentUsers({ users }: { users: RecentUser[] }) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    So'nggi qo'shilgan Foydalanuvchilar
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {users.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-4">Ma'lumot yo'q</p>
                )}
                {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">{user.name}</p>
                            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                        </div>
                        <p className="text-muted-foreground text-xs flex-shrink-0">
                            {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}