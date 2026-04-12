import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { questionId } = await params

        await prisma.question.delete({ where: { id: questionId } })

        return NextResponse.json({ message: "Savol o'chirildi" })
    } catch (error) {
        console.error("Question DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}