import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Props {
    value: string
    onChange: (v: string) => void
}

export function UsersSearch({ value, onChange }: Props) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Ism yoki email bo'yicha qidirish..."
                className="pl-10 text-foreground"
            />
        </div>
    )
}