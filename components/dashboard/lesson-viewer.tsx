import type { LearnerLesson } from "@/hooks/use-learner-lesson"

interface LessonViewerProps {
    lesson: LearnerLesson
}

export function LessonViewer({ lesson }: LessonViewerProps) {
    const type = lesson.type

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-medium text-sm text-foreground">Materiallar</h3>

            {type === "TEXT" && (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-foreground">
                    {lesson.content || "Matn mavjud emas."}
                </div>
            )}

            {type === "VIDEO" && (
                <div className="space-y-4">
                    {lesson.videoUrl ? (
                        <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                            <iframe
                                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                                title={lesson.title}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Video havolasi qo‘shilmagan.
                        </p>
                    )}
                    {lesson.content ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {lesson.content}
                        </div>
                    ) : null}
                </div>
            )}

            {type === "FILE" && (
                <div className="space-y-4">
                    {lesson.fileUrl ? (
                        <a
                            href={lesson.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Faylni ochish
                        </a>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Fayl havolasi yo‘q.
                        </p>
                    )}
                    {lesson.content ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {lesson.content}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
