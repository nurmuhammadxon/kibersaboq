import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModuleItem } from "./module-item"
import { Module } from "@/hooks/use-course-detail"

interface Props {
    modules: Module[]
    courseId: string
    expandedModules: string[]
    onToggle: (moduleId: string) => void
    onAddModule: () => void
    onAddLesson: (moduleId: string) => void
    onDeleteModule: (moduleId: string) => void
    onDeleteLesson: (lessonId: string, moduleId: string) => void
}

export function ModuleList({
    modules, courseId, expandedModules,
    onToggle, onAddModule, onAddLesson,
    onDeleteModule, onDeleteLesson
}: Props) {
    return (
        <div className="space-y-3">
            {modules.map((module, mi) => (
                <ModuleItem
                    key={module.id}
                    module={module}
                    index={mi}
                    courseId={courseId}
                    expanded={expandedModules.includes(module.id)}
                    onToggle={onToggle}
                    onAddLesson={onAddLesson}
                    onDeleteModule={onDeleteModule}
                    onDeleteLesson={onDeleteLesson}
                />
            ))}

            <Button
                variant="outline"
                className="w-full gap-2 border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                onClick={onAddModule}
            >
                <Plus className="w-4 h-4" />
                Modul qo'shish
            </Button>
        </div>
    )
}