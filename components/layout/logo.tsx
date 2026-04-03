import { Shield } from "lucide-react"

interface LogoProps {
    showText?: boolean
}

export function Logo({ showText = true }: LogoProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
            </div>
            {showText && (
                <span className="text-white font-bold text-lg italic">KiberSaboq</span>
            )}
        </div>
    )
}