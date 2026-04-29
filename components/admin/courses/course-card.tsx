import { BookOpen, Users, Eye, EyeOff, Pencil, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Course {
    id: string
    title: string
    description?: string
    level: string
    price?: number
    duration?: number
    thumbnail?: string
    isPublished: boolean
    modules: { lessons: any[] }[]
    enrollments: any[]
}

interface Props {
    course: Course
    onEdit: (course: Course) => void
    onDelete: (id: string) => void
    onTogglePublish: (course: Course) => void
}

const levelLabel: Record<string, string> = {
    BEGINNER: "Boshlang'ich",
    INTERMEDIATE: "O'rta",
    ADVANCED: "Yuqori",
}

const levelColor: Record<string, string> = {
    BEGINNER: "bg-green-500/10 text-green-400",
    INTERMEDIATE: "bg-yellow-500/10 text-yellow-400",
    ADVANCED: "bg-red-500/10 text-red-400",
}

export default function CourseCard({ course, onEdit, onDelete, onTogglePublish }: Props) {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-muted transition-colors flex flex-col">
            {/* Thumbnail */}
            {course.thumbnail ? (
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 object-cover"
                />
            ) : (
                <div className="w-full h-36 bg-linear-to-{dir} from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary/40" />
                </div>
            )}

            <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-foreground font-semibold text-sm leading-snug">{course.title}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${levelColor[course.level]}`}>
                        {levelLabel[course.level]}
                    </span>
                </div>

                {/* Description */}
                {course.description && (
                    <p className="text-muted-foreground text-xs line-clamp-2">{course.description}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {totalLessons} dars
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.enrollments.length} o'quvchi
                    </span>
                    {course.duration && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration} daq
                        </span>
                    )}
                </div>

                {/* Price & Status */}
                <div className="flex items-center justify-between">
                    <span className="text-foreground text-sm font-medium">
                        {course.price ? `$${course.price}` : "Bepul"}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${course.isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                        {course.isPublished ? "Faol" : "Qoralama"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 mt-auto">
                    <Link href={`/admin/courses/${course.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                            Boshqarish
                        </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => onTogglePublish(course)}>
                        {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => onEdit(course)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => onDelete(course.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}