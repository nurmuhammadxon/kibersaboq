import type { LearnerLesson } from "@/hooks/use-learner-lesson"
import { getYoutubeEmbedUrl } from "@/lib/youtube"


interface LessonViewerProps {
    lesson: LearnerLesson
}

export function LessonViewer({ lesson }: LessonViewerProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-medium text-sm text-foreground">Materiallar</h3>

            {lesson.type === "VIDEO" && lesson.videoUrl && getYoutubeEmbedUrl(lesson.videoUrl) && (
                <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                    <iframe
                        src={getYoutubeEmbedUrl(lesson.videoUrl)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        title={lesson.title}
                    />
                </div>
            )}

            {lesson.content && (
                <div
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
            )}

            {!lesson.videoUrl && !lesson.content && (
                <p className="text-sm text-muted-foreground">Kontent qo'shilmagan.</p>
            )}
        </div>
    )
}