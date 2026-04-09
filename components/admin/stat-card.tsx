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
        <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-zinc-500 text-sm">{label}</p>
                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                </div>
                <p className="text-2xl font-semibold text-zinc-100">{value}</p>
            </CardContent>
        </Card>
    )
}