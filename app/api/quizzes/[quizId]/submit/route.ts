import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error

        const userId = guard.user.id
        const { quizId } = await params
        const { answers, lessonId } = await req.json()

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: { options: true },
                },
                lesson: { select: { module: { select: { courseId: true } } } },
            },
        })

        if (!quiz) {
            return NextResponse.json({ error: "Quiz topilmadi" }, { status: 404 })
        }

        const enrolled = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId: quiz.lesson.module.courseId },
            },
        })
        if (!enrolled) {
            return NextResponse.json({ error: "Bu kursga yozilinmagan" }, { status: 403 })
        }

        if (!Array.isArray(answers)) {
            return NextResponse.json({ error: "Javoblar noto'g'ri" }, { status: 400 })
        }

        let correct = 0
        for (const answer of answers) {
            const question = quiz.questions.find((q) => q.id === answer.questionId)
            if (!question) continue
            const option = question.options.find((o) => o.id === answer.optionId)
            if (option?.isCorrect) correct++
        }

        const total = quiz.questions.length
        const score = total > 0 ? Math.round((correct / total) * 100) : 0
        const passed = score >= 70

        await prisma.quizResult.create({
            data: {
                userId,
                quizId,
                score,
                passed,
            },
        })

        return NextResponse.json({ score, passed, correct, total })
    } catch (error) {
        console.error("Quiz submit xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}