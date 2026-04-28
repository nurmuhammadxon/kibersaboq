import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { lessonId } = await params
        const role = (session.user as any).role as string
        const userId = (session.user as any).id as string

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

            const sanitized = {
                ...lesson,
                quizzes: lesson.quizzes.map((qz) => ({
                    ...qz,
                    questions: qz.questions.map((q) => ({
                        ...q,
                        options: q.options.map((o) => ({
                            id: o.id,
                            text: o.text,
                        })),
                    })),
                })),
            }
            const { module: _m, ...rest } = sanitized
            void _m
            return NextResponse.json(rest)
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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        if ((session.user as any).role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        const { lessonId } = await params
        const { content, videoUrl, fileUrl, minDuration } = await req.json()

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: { content, videoUrl, fileUrl, minDuration },
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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        if ((session.user as any).role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        const { lessonId } = await params

        await prisma.lesson.delete({ where: { id: lessonId } })

        return NextResponse.json({ message: "Dars o'chirildi" })
    } catch (error) {
        console.error("Lesson DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}