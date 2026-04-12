"use client"
import { Plus, BookOpen } from "lucide-react"
import Loading from "@/components/_components/loading"
import { Error as ErrorComponent } from "@/components/_components/error"
import { ConfirmDialog } from "@/components/_components/confirm-dialog"
import { Button } from "@/components/ui/button"
import CourseCard from "@/components/courses/course-card"
import CourseForm from "@/components/courses/course-form"
import { useCourses } from "@/hooks/use-courses"

export default function CoursesPage() {
    const {
        courses, loading, error, modalOpen, form, formError,
        saving, deleteId, editCourse, setForm, setDeleteId,
        openAdd, openEdit, closeModal, handleSave, handleDelete,
        togglePublish, fetchCourses
    } = useCourses()

    if (loading) return <Loading />
    if (error) return <ErrorComponent message={error} onRetry={fetchCourses} />

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-foreground font-bold text-xl">Kurslar</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">{courses.length} ta kurs</p>
                </div>
                <Button onClick={openAdd} className="gap-2 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Kurs qo'shish
                </Button>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Hech qanday kurs yo'q</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onEdit={openEdit}
                            onDelete={setDeleteId}
                            onTogglePublish={togglePublish}
                        />
                    ))}
                </div>
            )}

            <CourseForm
                open={modalOpen}
                onClose={closeModal}
                onSave={handleSave}
                form={form}
                onChange={setForm}
                saving={saving}
                error={formError}
                isEdit={!!editCourse}
            />

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => deleteId && handleDelete(deleteId)}
                description="Bu kurs va unga tegishli barcha ma'lumotlar o'chiriladi."
            />
        </div>
    )
}