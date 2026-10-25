import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { ATTEMPT_TTL_MS, PASS_SCORE, quizFlags } from "@/lib/quiz-integrity"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error

        const userId = guard.user.id
        const { quizId } = await params
        const { answers, attemptId, blurCount } = await req.json()

        if (!Array.isArray(answers) || typeof attemptId !== "string") {
            return NextResponse.json({ error: "Javoblar noto'g'ri" }, { status: 400 })
        }

        const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } })
        if (!attempt || attempt.userId !== userId || attempt.quizId !== quizId) {
            return NextResponse.json({ error: "Urinish topilmadi" }, { status: 404 })
        }
        if (attempt.submittedAt) {
            return NextResponse.json({ error: "Bu urinish allaqachon yuborilgan" }, { status: 409 })
        }

        const now = new Date()
        if (now.getTime() - attempt.startedAt.getTime() > ATTEMPT_TTL_MS) {
            return NextResponse.json(
                { error: "Test vaqti tugagan. Testni qaytadan boshlang." },
                { status: 410 }
            )
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: { include: { options: true } },
                lesson: { select: { module: { select: { courseId: true } } } },
            },
        })
        if (!quiz) {
            return NextResponse.json({ error: "Quiz topilmadi" }, { status: 404 })
        }

        const enrolled = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: quiz.lesson.module.courseId } },
        })
        if (!enrolled) {
            return NextResponse.json({ error: "Bu kursga yozilinmagan" }, { status: 403 })
        }

        // Urinishni band qilamiz: bir urinish bir marta yuboriladi (parallel so'rovlarga qarshi)
        const claim = await prisma.quizAttempt.updateMany({
            where: { id: attemptId, submittedAt: null },
            data: { submittedAt: now },
        })
        if (claim.count === 0) {
            return NextResponse.json({ error: "Bu urinish allaqachon yuborilgan" }, { status: 409 })
        }

        // Faqat shu urinishda berilgan savollar hisoblanadi
        const served = quiz.questions.filter((q) => attempt.questionIds.includes(q.id))
        if (served.length === 0) {
            return NextResponse.json({ error: "Savollar topilmadi" }, { status: 400 })
        }

        const chosen = new Map<string, string>()
        for (const a of answers) {
            if (a && typeof a.questionId === "string" && typeof a.optionId === "string") {
                chosen.set(a.questionId, a.optionId)
            }
        }

        let correct = 0
        for (const q of served) {
            const opt = q.options.find((o) => o.id === chosen.get(q.id))
            if (opt?.isCorrect) correct++
        }

        const total = served.length
        const score = Math.round((correct / total) * 100)
        const passed = score >= PASS_SCORE

        const durationSec = Math.max(0, Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000))
        const blur = Math.min(999, Math.max(0, Math.floor(Number(blurCount) || 0)))
        const reasons = quizFlags({ durationSec, questionCount: total, blurCount: blur })

        await prisma.quizResult.create({
            data: {
                userId,
                quizId,
                score,
                passed,
                durationSec,
                flagged: reasons.length > 0,
                flagReason: reasons.length > 0 ? reasons.join("; ") : null,
            },
        })

        return NextResponse.json({ score, passed, correct, total })
    } catch (error) {
        console.error("Quiz submit xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
