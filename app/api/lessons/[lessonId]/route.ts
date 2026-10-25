import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { cleanLessonHtml } from "@/lib/sanitize-html"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error

        const { lessonId } = await params
        const role = guard.user.role
        const userId = guard.user.id

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: {
                    include: { course: true },
                },
                quizzes: {
                    include: {
                        questions: {
                            include: { options: true },
                        },
                    },
                },
            },
        })

        if (!lesson) {
            return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 })
        }

        const course = lesson.module.course

        if (role !== "SUPER_ADMIN") {
            if (!course.isPublished) {
                return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
            }
            const enrolled = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: { userId, courseId: course.id },
                },
            })
            if (!enrolled) {
                return NextResponse.json(
                    { error: "Bu kursga yozilinmagan" },
                    { status: 403 }
                )
            }

            // Dars ochilgan vaqtni serverda yozib qo'yamiz (minimal o'qish vaqtini
            // tekshirish uchun). Mavjud bo'lsa, o'zgartirilmaydi.
            await prisma.progress.upsert({
                where: { userId_lessonId: { userId, lessonId } },
                update: {},
                create: { userId, lessonId },
            })

            const sanitized = {
                ...lesson,
                // Savollar darsning o'zi bilan berilmaydi: test boshlanganda
                // /api/quizzes/[id]/start orqali tasodifiy tartibda beriladi.
                quizzes: lesson.quizzes.map((qz) => ({
                    id: qz.id,
                    questionCount: qz.questions.length,
                })),
            }
            const { module: _m, ...rest } = sanitized
            void _m
            return NextResponse.json({ ...rest, content: cleanLessonHtml(rest.content) })
        }

        const { module: _m, ...rest } = lesson
        void _m
        return NextResponse.json(rest)
    } catch (error) {
        console.error("Lesson GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { lessonId } = await params
        const { content, videoUrl, fileUrl, minDuration } = await req.json()

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                content: content === undefined ? undefined : cleanLessonHtml(content),
                videoUrl,
                fileUrl,
                minDuration,
            },
        })

        return NextResponse.json(lesson)
    } catch (error) {
        console.error("Lesson PATCH xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { lessonId } = await params

        await prisma.lesson.delete({ where: { id: lessonId } })

        return NextResponse.json({ message: "Dars o'chirildi" })
    } catch (error) {
        console.error("Lesson DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}