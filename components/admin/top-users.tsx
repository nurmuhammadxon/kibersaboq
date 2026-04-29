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
    const getMedalColor = (index: number) => {
        switch (index) {
            case 0:
                return "bg-amber-500/20 text-amber-400"
            case 1:
                return "bg-secondary text-secondary-foreground"
            case 2:
                return "bg-orange-700/20 text-orange-500"
            default:
                return "bg-muted text-muted-foreground"
        }
    }

    return (
        <Card className="bg-card border-border rounded-xl sm:rounded-2xl">
            {/* Header */}
            <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                <CardTitle className="text-foreground text-base sm:text-lg flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    Top foydalanuvchilar
                </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center py-6 sm:py-8">
                        <p className="text-muted-foreground text-sm">Ma'lumot yo'q</p>
                    </div>
                )}

                {/* User List */}
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg sm:rounded-xl transition-colors"
                    >
                        {/* Rank Badge */}
                        <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-black shrink-0 transition-transform ${getMedalColor(index)}`}
                        >
                            {index < 3 ? (
                                <span>
                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                </span>
                            ) : (
                                index + 1
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg shadow-blue-900/20">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground text-xs sm:text-sm font-semibold truncate">
                                {user.name}
                            </p>
                            <p className="text-muted-foreground text-[10px] sm:text-xs truncate">
                                {user.email}
                            </p>
                        </div>

                        {/* Score & Courses */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                            <p className="text-amber-400 text-xs sm:text-sm font-bold">
                                {user.avgScore}%
                            </p>
                            <p className="text-muted-foreground text-[10px] sm:text-xs">
                                {user.completedCourses} kurs
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}