"use client"
import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder = "••••••••"
}: PasswordInputProps) => {
    const [show, setShow] = useState(false)

    return (
        <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest ml-1 block">
                {label}
            </Label>
            <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base rounded-lg transition-all"
                    required
                    autoComplete="password"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded"
                    tabIndex={-1}
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    )
}