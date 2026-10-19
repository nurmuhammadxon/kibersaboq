import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

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