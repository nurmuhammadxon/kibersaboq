"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { ConfirmDialog } from "@/components/_components/confirm-dialog"
import { ModuleList } from "@/components/courses/module-list"
import { AddModuleModal } from "@/components/courses/add-module-modal"
import { AddLessonModal } from "@/components/courses/add-lesson-modal"
import { useCourseDetail } from "@/hooks/use-course-detail"

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>()

    const {
        course, loading, error, fetchCourse,
        expandedModules, toggleModule,
        moduleModal, setModuleModal, moduleTitle, setModuleTitle,
        moduleSaving, moduleError, deleteModuleId, setDeleteModuleId,
        openModuleModal, handleAddModule, handleDeleteModule,
        lessonModal, setLessonModal,
        lessonTitle, setLessonTitle, lessonType, setLessonType,
        lessonSaving, lessonError, deleteLessonId, setDeleteLessonId,
        openLessonModal, handleAddLesson, handleDeleteLesson,
    } = useCourseDetail(id)

    if (loading) return <Loading />
    if (error) return <ErrorComponent message={error} onRetry={fetchCourse} />
    if (!course) return null

    const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0)

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="flex-1 min-w-0">
                    <h2 className="text-foreground font-bold text-xl truncate">{course.title}</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        {course.modules.length} modul • {totalLessons} dars • {course.enrollments.length} o'quvchi
                    </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${course.isPublished
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-muted text-muted-foreground"
                    }`}>
                    {course.isPublished ? "Faol" : "Qoralama"}
                </span>
            </div>

            {/* Module List */}
            <ModuleList
                modules={course.modules}
                courseId={id}
                expandedModules={expandedModules}
                onToggle={toggleModule}
                onAddModule={openModuleModal}
                onAddLesson={openLessonModal}
                onDeleteModule={setDeleteModuleId}
                onDeleteLesson={(lessonId, moduleId) => {
                    setDeleteLessonId(lessonId)
                }}
            />

            {/* Add Module Modal */}
            <AddModuleModal
                open={moduleModal}
                onClose={() => setModuleModal(false)}
                title={moduleTitle}
                onTitleChange={setModuleTitle}
                onSave={handleAddModule}
                saving={moduleSaving}
                error={moduleError}
            />

            {/* Add Lesson Modal */}
            <AddLessonModal
                open={lessonModal}
                onClose={() => setLessonModal(false)}
                title={lessonTitle}
                onTitleChange={setLessonTitle}
                type={lessonType}
                onTypeChange={setLessonType}
                onSave={handleAddLesson}
                saving={lessonSaving}
                error={lessonError}
            />

            {/* Delete Module Confirm */}
            <ConfirmDialog
                open={!!deleteModuleId}
                onClose={() => setDeleteModuleId(null)}
                onConfirm={() => deleteModuleId && handleDeleteModule(deleteModuleId)}
                description="Bu modul va unga tegishli barcha darslar o'chiriladi."
            />

            {/* Delete Lesson Confirm */}
            <ConfirmDialog
                open={!!deleteLessonId}
                onClose={() => setDeleteLessonId(null)}
                onConfirm={() => {
                    if (!deleteLessonId) return
                    const moduleId = course.modules.find(m =>
                        m.lessons.some(l => l.id === deleteLessonId)
                    )?.id
                    if (moduleId) handleDeleteLesson(deleteLessonId, moduleId)
                }}
                description="Bu dars o'chiriladi."
            />
        </div>
    )
}