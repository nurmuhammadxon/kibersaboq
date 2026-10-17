import { Input } from "@/components/ui/input"

interface Props {
    value: string
    onChange: (v: string) => void
}

export function EmployeesSearch({ value, onChange }: Props) {
    return (
        <Input
            placeholder="Ism, email yoki yo'nalish bo'yicha qidirish..."
            value={value}
            onChange={e => onChange(e.target.value)}
            className="max-w-sm"
        />
    )
}