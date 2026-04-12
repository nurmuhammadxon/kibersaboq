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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { lessonId } = await params
        const data = await req.json()

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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { lessonId } = await params

        await prisma.lesson.delete({ where: { id: lessonId } })

        return NextResponse.json({ message: "Dars o'chirildi" })
    } catch (error) {
        console.error("Lesson DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}