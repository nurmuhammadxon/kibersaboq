import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LessonItem } from "./lesson-item"
import { Module } from "@/hooks/use-course-detail"

interface Props {
    module: Module
    index: number
    courseId: string
    expanded: boolean
    onToggle: (moduleId: string) => void
    onAddLesson: (moduleId: string) => void
    onDeleteModule: (moduleId: string) => void
    onDeleteLesson: (lessonId: string, moduleId: string) => void
}

export function ModuleItem({
    module, index, courseId, expanded,
    onToggle, onAddLesson, onDeleteModule, onDeleteLesson
}: Props) {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Module Header */}
            <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => onToggle(module.id)}
            >
                <span className="text-muted-foreground/50 text-xs font-mono w-5">{index + 1}</span>
                {expanded
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                }
                <span className="text-foreground font-medium text-sm flex-1">{module.title}</span>
                <span className="text-muted-foreground/50 text-xs">{module.lessons.length} dars</span>
                <Button
                    size="icon" variant="ghost"
                    className="text-destructive hover:bg-destructive/10 w-7 h-7"
                    onClick={e => { e.stopPropagation(); onDeleteModule(module.id) }}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Lessons */}
            {expanded && (
                <div className="border-t border-border">
                    {module.lessons.map((lesson, li) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            index={li}
                            courseId={courseId}
                            moduleId={module.id}
                            onDelete={onDeleteLesson}
                        />
                    ))}

                    <div className="px-4 py-3">
                        <Button
                            variant="ghost" size="sm"
                            className="text-muted-foreground hover:text-foreground gap-2 text-xs"
                            onClick={() => onAddLesson(module.id)}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Dars qo'shish
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}