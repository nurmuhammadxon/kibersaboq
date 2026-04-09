import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

interface TopUser {
    id: string
    name: string
    email: string
    avgScore: number
    completedCourses: number
}

export function TopUsers({ users }: { users: TopUser[] }) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Top xodimlar
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {users.length === 0 && (
                    <p className="text-zinc-600 text-sm text-center py-4">Ma'lumot yo'q</p>
                )}
                {users.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
              ${index === 0 ? "bg-amber-500/20 text-amber-400" :
                                index === 1 ? "bg-zinc-400/20 text-zinc-300" :
                                    index === 2 ? "bg-orange-700/20 text-orange-500" :
                                        "bg-zinc-700/50 text-zinc-500"}`}
                        >
                            {index + 1}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-zinc-200 text-sm font-medium truncate">{user.name}</p>
                            <p className="text-zinc-600 text-xs truncate">{user.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-amber-400 text-sm font-semibold">{user.avgScore}%</p>
                            <p className="text-zinc-600 text-xs">{user.completedCourses} kurs</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}