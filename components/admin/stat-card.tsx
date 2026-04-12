import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    color: string
    bg: string
}

export function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
    return (
        <Card className="bg-card border-border rounded-lg sm:rounded-xl hover:border-muted transition-colors">
            <CardContent className="p-3 sm:p-5">

                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                        {label}
                    </p>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                </div>

                {/* Value */}
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                    {value}
                </p>

                {/* Optional subtle indicator */}
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-border to-transparent mt-3 sm:mt-4" />
            </CardContent>
        </Card>
    )
}