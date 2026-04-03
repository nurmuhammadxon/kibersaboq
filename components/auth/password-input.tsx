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

export const PasswordInput = ({ label, value, onChange, placeholder = "••••••••" }: PasswordInputProps) => {
    const [show, setShow] = useState(false)

    return (
        <div className="space-y-2">
            <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest ml-1">{label}</Label>
            <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <Input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-10 bg-zinc-950/40 border-zinc-800 text-zinc-200 focus-visible:ring-blue-600 h-11"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-3 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    )
}