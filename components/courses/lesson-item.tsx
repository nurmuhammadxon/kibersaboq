import { FileText, Video, File, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lesson } from "@/hooks/use-course-detail"

interface Props {
    lesson: Lesson
    index: number
    courseId: string
    moduleId: string
    onDelete: (lessonId: string, moduleId: string) => void
}

const lessonTypeIcon = (type: string) => {
    if (type === "VIDEO") return <Video className="w-3.5 h-3.5" />
    if (type === "FILE") return <File className="w-3.5 h-3.5" />
    return <FileText className="w-3.5 h-3.5" />
}

export function LessonItem({ lesson, index, courseId, moduleId, onDelete }: Props) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors border-b border-border last:border-0">
            <span className="text-muted-foreground/50 text-xs font-mono w-5">{index + 1}</span>
            <span className="text-muted-foreground">{lessonTypeIcon(lesson.type)}</span>
            <Link
                href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                className="flex-1 text-secondary-foreground text-sm hover:text-foreground transition-colors"
            >
                {lesson.title}
            </Link>
            <Button
                size="icon" variant="ghost"
                className="text-destructive hover:bg-destructive/10 w-7 h-7"
                onClick={() => onDelete(lesson.id, moduleId)}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    )
}