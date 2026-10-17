import { Hash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FIELDS = [
    "IT va dasturlash",
    "Moliya va buxgalteriya",
    "HR va kadrlar",
    "Savdo va marketing",
    "Huquq va yuridik",
    "Logistika",
    "Ishlab chiqarish",
    "Boshqa",
]

interface Props {
    companyCode: string
    field: string
    onChange: (field: string, value: string) => void
}

export function UserFields({ companyCode, field, onChange }: Props) {
    return (
        <>
            <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">
                    Korxona kodi
                </Label>
                <div className="relative group">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        value={companyCode}
                        onChange={(e) => onChange("companyCode", e.target.value)}
                        placeholder="KS-4829"
                        className="pl-10"
                        required
                    />
                </div>
                <p className="text-xs text-muted-foreground ml-1">
                    Direktoringizdan oling
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">
                    Yo'nalish
                </Label>
                <select
                    value={field}
                    onChange={(e) => onChange("field", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                >
                    <option value="">Tanlang...</option>
                    {FIELDS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>
        </>
    )
}