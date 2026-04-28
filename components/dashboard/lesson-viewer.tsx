import type { LearnerLesson } from "@/hooks/use-learner-lesson"

interface LessonViewerProps {
    lesson: LearnerLesson
}

function getYoutubeEmbedUrl(url: string): string {
    const watchMatch = url.match(/[?&]v=([^&]+)/)
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
    if (url.includes("/embed/")) return url
    return url
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
                                src={getYoutubeEmbedUrl(lesson.videoUrl)}  // ← o'zgartiring
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title={lesson.title}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Video havolasi qo'shilmagan.</p>
                    )}
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
