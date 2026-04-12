import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { lessonId } = await params

        const quiz = await prisma.quiz.create({
            data: { lessonId }
        })

        return NextResponse.json(quiz, { status: 201 })
    } catch (error) {
        console.error("Quiz POST xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}