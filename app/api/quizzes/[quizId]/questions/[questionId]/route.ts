import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ quizId: string; questionId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { questionId } = await params

        await prisma.question.delete({ where: { id: questionId } })

        return NextResponse.json({ message: "Savol o'chirildi" })
    } catch (error) {
        console.error("Question DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}