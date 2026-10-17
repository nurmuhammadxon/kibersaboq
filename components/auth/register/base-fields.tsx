import { User, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    firstName: string
    lastName: string
    email: string
    onChange: (field: string, value: string) => void
}

export function BaseFields({ firstName, lastName, email, onChange }: Props) {
    return (
        <>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">Ism</Label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            value={firstName}
                            onChange={(e) => onChange("firstName", e.target.value)}
                            placeholder="Ali"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">Familya</Label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            value={lastName}
                            onChange={(e) => onChange("lastName", e.target.value)}
                            placeholder="Valiyev"
                            className="pl-10"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold ml-1">Email</Label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => onChange("email", e.target.value)}
                        placeholder="email@example.com"
                        className="pl-10"
                        required
                    />
                </div>
            </div>
        </>
    )
}