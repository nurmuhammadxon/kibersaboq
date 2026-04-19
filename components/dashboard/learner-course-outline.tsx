"use client"

import Link from "next/link"
import { CheckCircle2, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { LearnerCourseData } from "@/hooks/use-learner-course"

interface LearnerCourseOutlineProps {
    course: LearnerCourseData
    completedLessonIds: Set<string>
    coursePathPrefix: string
}

export function LearnerCourseOutline({
    course,
    completedLessonIds,
    coursePathPrefix,
}: LearnerCourseOutlineProps) {
    const [open, setOpen] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {}
        for (const m of course.modules) initial[m.id] = true
        return initial
    })

    return (
        <div className="space-y-3">
            {course.modules.map((mod) => (
                <div
                    key={mod.id}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setOpen((s) => ({ ...s, [mod.id]: !s[mod.id] }))
                        }
                        className="flex w-full items-center gap-2 px-4 py-3 text-left font-medium text-sm hover:bg-secondary/60 transition-colors"
                    >
                        {open[mod.id] ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                        <span className="truncate">{mod.title}</span>
                        <span className="text-muted-foreground font-normal text-xs ml-auto shrink-0">
                            {mod.lessons.length} dars
                        </span>
                    </button>
                    {open[mod.id] && (
                        <ul className="border-t border-border divide-y divide-border">
                            {mod.lessons.map((lesson) => {
                                const done = completedLessonIds.has(lesson.id)
                                return (
                                    <li key={lesson.id}>
                                        <Link
                                            href={`${coursePathPrefix}/lessons/${lesson.id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                                "hover:bg-secondary/50",
                                                done && "text-muted-foreground"
                                            )}
                                        >
                                            <CheckCircle2
                                                className={cn(
                                                    "h-4 w-4 shrink-0",
                                                    done
                                                        ? "text-emerald-500"
                                                        : "text-muted-foreground/40"
                                                )}
                                            />
                                            <span className="flex-1 truncate">
                                                {lesson.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground capitalize shrink-0">
                                                {lesson.type.toLowerCase()}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    )
}
