import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

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
                content: content || "",
                moduleId,
            }
        })

        return NextResponse.json(lesson, { status: 201 })
    } catch (error) {
        console.error("Lesson POST xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}