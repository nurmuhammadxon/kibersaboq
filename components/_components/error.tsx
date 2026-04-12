"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
    title?: string
    message: string
    onRetry?: () => void
    fullScreen?: boolean
}

export function Error({
    title = "Xatolik yuz berdi",
    message,
    onRetry,
    fullScreen = false,
}: ErrorProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
                <h2 className="text-lg font-bold text-destructive">{title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{message}</p>
            </div>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Qayta urinish
                </Button>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                {content}
            </div>
        )
    }

    return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            {content}
        </div>
    )
}