"use client"

import { Loader } from "lucide-react"

interface LoadingProps {
    fullScreen?: boolean
}

export default function Loading({ fullScreen = false }: LoadingProps) {
    const content = (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        )
    }

    return <div className="flex justify-center py-12">{content}</div>
}