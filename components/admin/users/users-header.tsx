import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
    count: number
    onAdd: () => void
}

export function UsersHeader({ count, onAdd }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-foreground font-bold text-xl">Foydalanuvchilar</h2>
                <p className="text-muted-foreground text-sm mt-0.5">{count} ta foydalanuvchi</p>
            </div>
            <Button onClick={onAdd} className="gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Qo'shish
            </Button>
        </div>
    )
}