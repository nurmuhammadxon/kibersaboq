"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { ConfirmDialog } from "@/components/_components/confirm-dialog"
import { LessonContent } from "@/components/admin/courses/lessons/lesson-content"
import { LessonQuiz } from "@/components/admin/courses/lessons/lesson-quiz"
import { AddQuestionModal } from "@/components/admin/courses/lessons/add-question-modal"
import { useLessonDetail } from "@/hooks/use-lesson-detail"

export default function LessonDetailPage() {
    const { id, lessonId } = useParams<{ id: string; lessonId: string }>()

    const {
        lesson, loading, error, fetchLesson,
        content, setContent,
        videoUrl, setVideoUrl,
        fileUrl, setFileUrl,
        saving, saved, handleSaveContent,
        quizModal, setQuizModal,
        questionText, setQuestionText,
        options, setOptions,
        correctIndex, setCorrectIndex,
        quizSaving, quizError,
        deleteQuizId, setDeleteQuizId,
        handleAddQuiz, handleDeleteQuestion,
    } = useLessonDetail(lessonId)

    if (loading) return <Loading />
    if (error) return <ErrorComponent message={error} onRetry={fetchLesson} />
    if (!lesson) return null

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href={`/admin/courses/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <h2 className="text-foreground font-bold text-xl truncate">{lesson.title}</h2>
                    <p className="text-muted-foreground text-sm mt-0.5 capitalize">{lesson.type.toLowerCase()} darsi</p>
                </div>
            </div>

            {/* Content */}
            <LessonContent
                type={lesson.type}
                content={content}
                videoUrl={videoUrl}
                fileUrl={fileUrl}
                onContentChange={setContent}
                onVideoUrlChange={setVideoUrl}
                onFileUrlChange={setFileUrl}
                onSave={handleSaveContent}
                saving={saving}
                saved={saved}
            />

            {/* Quiz */}
            <LessonQuiz
                quizzes={lesson.quizzes}
                onAddQuestion={() => setQuizModal(true)}
                onDeleteQuestion={handleDeleteQuestion}
            />

            {/* Add Question Modal */}
            <AddQuestionModal
                open={quizModal}
                onClose={() => setQuizModal(false)}
                questionText={questionText}
                onQuestionChange={setQuestionText}
                options={options}
                onOptionChange={(i, v) => {
                    const updated = [...options]
                    updated[i] = v
                    setOptions(updated)
                }}
                correctIndex={correctIndex}
                onCorrectChange={setCorrectIndex}
                onSave={handleAddQuiz}
                saving={quizSaving}
                error={quizError}
            />

            {/* Delete Question Confirm */}
            <ConfirmDialog
                open={!!deleteQuizId}
                onClose={() => setDeleteQuizId(null)}
                onConfirm={() => {
                    if (!deleteQuizId) return
                    const quiz = lesson.quizzes[0]
                    if (quiz) handleDeleteQuestion(quiz.id, deleteQuizId)
                    setDeleteQuizId(null)
                }}
                description="Bu savol o'chiriladi."
            />
        </div>
    )
}