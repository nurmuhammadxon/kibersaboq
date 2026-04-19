import { HelpCircle } from "lucide-react"

interface LessonQuizPlaceholderProps {
    questionCount: number
}

export function LessonQuizPlaceholder({
    questionCount,
}: LessonQuizPlaceholderProps) {
    if (questionCount <= 0) return null

    return (
        <div className="rounded-xl border border-border bg-muted/40 p-5 flex gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
                <p className="text-sm font-medium">Savollar ({questionCount})</p>
                <p className="text-xs text-muted-foreground">
                    Test topshirish funksiyasi tez orada qo‘shiladi. Hozircha darsni
                    o‘qib, yakunlash tugmasidan foydalaning.
                </p>
            </div>
        </div>
    )
}
