import { Users } from "lucide-react"

interface Props {
    count: number
}

export function EmployeesHeader({ count }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Xodimlar</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Korxonangizga biriktirilgan xodimlar ro'yxati
                </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{count} ta xodim</span>
            </div>
        </div>
    )
}