import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { quizId } = await params
        const { text, options } = await req.json()

        if (!text || !options?.length) {
            return NextResponse.json({ error: "Savol va variantlar kiritilishi shart" }, { status: 400 })
        }

        const question = await prisma.question.create({
            data: {
                text,
                quizId,
                options: {
                    create: options.map((o: { text: string; isCorrect: boolean }) => ({
                        text: o.text,
                        isCorrect: o.isCorrect,
                    }))
                }
            },
            include: { options: true }
        })

        return NextResponse.json(question, { status: 201 })
    } catch (error) {
        console.error("Question POST xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}