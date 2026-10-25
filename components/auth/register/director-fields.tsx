import { Building2, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    companyName: string
    organizationName: string
    onChange: (field: string, value: string) => void
}

export function DirectorFields({ companyName, organizationName, onChange }: Props) {
    return (
        <>
            <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">
                    Korxona nomi
                </Label>
                <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        value={companyName}
                        onChange={(e) => onChange("companyName", e.target.value)}
                        placeholder="Kiber Saboq"
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">
                    Lavozim
                </Label>
                <div className="relative group">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        value={organizationName}
                        onChange={(e) => onChange("organizationName", e.target.value)}
                        placeholder="Direktor"
                        className="pl-10"
                        required
                    />
                </div>
            </div>
        </>
    )
}