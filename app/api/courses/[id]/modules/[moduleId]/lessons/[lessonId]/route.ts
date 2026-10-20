import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { cleanLessonHtml } from "@/lib/sanitize-html"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { lessonId } = await params

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                quizzes: {
                    include: {
                        questions: {
                            include: { options: true }
                        }
                    }
                }
            }
        })

        if (!lesson) {
            return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 })
        }

        return NextResponse.json(lesson)
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
        const body = await req.json()
        const data: Record<string, unknown> = {}
        for (const key of ["title", "content", "videoUrl", "fileUrl", "type", "order", "minDuration"]) {
            if (key in body) data[key] = body[key]
        }
        if ("content" in data) data.content = cleanLessonHtml(data.content)

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data,
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