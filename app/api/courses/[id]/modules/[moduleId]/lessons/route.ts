import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { cleanLessonHtml } from "@/lib/sanitize-html"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { moduleId } = await params
        const { title, type, order, content } = await req.json()

        if (!title) {
            return NextResponse.json({ error: "Dars nomi kiritilishi shart" }, { status: 400 })
        }

        const lesson = await prisma.lesson.create({
            data: {
                title,
                type: type || "TEXT",
                order,
                content: cleanLessonHtml(content),
                moduleId,
            }
        })

        return NextResponse.json(lesson, { status: 201 })
    } catch (error) {
        console.error("Lesson POST xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}