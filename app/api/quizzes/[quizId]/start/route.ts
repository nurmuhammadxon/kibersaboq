import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import {
    ATTEMPT_TTL_MS,
    ATTEMPT_WINDOW_MS,
    MAX_ATTEMPTS,
    pickQuestions,
    remainingActiveSeconds,
    shuffle,
} from "@/lib/quiz-integrity"

/**
 * Testni boshlaydi: savollar faqat shu yerda beriladi (tasodifiy tanlanadi,
 * tartibi va variantlari aralashtiriladi). Har boshlash urinishga sanaladi.
 */
export async function POST(
    _req: Request,
    { params }: { params: Promise<{ quizId: string }> }
) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error
        const userId = guard.user.id
        const { quizId } = await params

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            select: {
                id: true,
                lessonId: true,
                questions: {
                    select: { id: true, text: true, options: { select: { id: true, text: true } } },
                },
                lesson: {
                    select: {
                        minDuration: true,
                        module: { select: { courseId: true, course: { select: { isPublished: true } } } },
                    },
                },
            },
        })
        if (!quiz || !quiz.lesson.module.course.isPublished) {
            return NextResponse.json({ error: "Test topilmadi" }, { status: 404 })
        }
        if (quiz.questions.length === 0) {
            return NextResponse.json({ error: "Testda savollar yo'q" }, { status: 400 })
        }

        const courseId = quiz.lesson.module.courseId
        const enrolled = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } },
        })
        if (!enrolled) {
            return NextResponse.json({ error: "Bu kursga yozilinmagan" }, { status: 403 })
        }

        // Darsni yetarli faol o'qimagan bo'lsa, test ochilmaydi
        const prog = await prisma.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId: quiz.lessonId } },
            select: { activeSeconds: true, completedAt: true },
        })
        if (!prog) {
            return NextResponse.json({ error: "Avval darsni oching" }, { status: 403 })
        }
        if (!prog.completedAt) {
            const left = remainingActiveSeconds(prog.activeSeconds, quiz.lesson.minDuration)
            if (left > 0) {
                return NextResponse.json(
                    { error: `Testni boshlash uchun darsni yana ${left} soniya o'qing`, remaining: left },
                    { status: 403 }
                )
            }
        }

        const now = Date.now()
        const recent = await prisma.quizAttempt.findMany({
            where: { userId, quizId, startedAt: { gte: new Date(now - ATTEMPT_WINDOW_MS) } },
            orderBy: { startedAt: "asc" },
            select: { id: true, questionIds: true, startedAt: true, submittedAt: true },
        })

        const byId = new Map(quiz.questions.map((q) => [q.id, q]))
        const toPayload = (ids: string[]) =>
            ids
                .map((id) => byId.get(id))
                .filter((q): q is NonNullable<typeof q> => !!q)
                .map((q) => ({ id: q.id, text: q.text, options: shuffle(q.options) }))

        // Yarim qolgan test bo'lsa (sahifa yangilangan), yangi urinish sarflanmaydi
        const open = [...recent]
            .reverse()
            .find((a) => !a.submittedAt && now - a.startedAt.getTime() < ATTEMPT_TTL_MS)
        if (open) {
            const questions = toPayload(open.questionIds)
            if (questions.length > 0) {
                return NextResponse.json({
                    attemptId: open.id,
                    questions,
                    attemptsLeft: Math.max(0, MAX_ATTEMPTS - recent.length),
                })
            }
        }

        if (recent.length >= MAX_ATTEMPTS) {
            const retryAfterSec = Math.max(
                1,
                Math.ceil((recent[0].startedAt.getTime() + ATTEMPT_WINDOW_MS - now) / 1000)
            )
            const hours = Math.ceil(retryAfterSec / 3600)
            return NextResponse.json(
                {
                    error: `Urinishlar tugadi. Taxminan ${hours} soatdan keyin qayta urinib ko'ring. Shu orada darsni qayta o'qib chiqing.`,
                    retryAfterSec,
                },
                { status: 429 }
            )
        }

        const chosen = pickQuestions(quiz.questions)
        const attempt = await prisma.quizAttempt.create({
            data: { userId, quizId, questionIds: chosen.map((q) => q.id) },
            select: { id: true },
        })

        return NextResponse.json({
            attemptId: attempt.id,
            questions: toPayload(chosen.map((q) => q.id)),
            attemptsLeft: MAX_ATTEMPTS - recent.length - 1,
        })
    } catch (error) {
        console.error("Quiz start xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
