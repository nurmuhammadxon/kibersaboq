import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")
        const courseId = searchParams.get("courseId") || undefined

        const to = toParam
            ? new Date(toParam + "T23:59:59.999Z")
            : new Date(new Date().toISOString().slice(0, 10) + "T23:59:59.999Z")

        const from = fromParam
            ? new Date(fromParam + "T00:00:00.000Z")
            : new Date(new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T00:00:00.000Z")

        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            return NextResponse.json({ error: "Noto'g'ri sana formati" }, { status: 400 })
        }

        if (from > to) {
            return NextResponse.json(
                { error: "Boshlanish sanasi tugash sanasidan keyin bo'lmasligi kerak" },
                { status: 400 }
            )
        }

        const coursesList = await prisma.course.findMany({
            select: { id: true, title: true, price: true },
            orderBy: { title: "asc" },
        })

        const enrollmentWhereBase = {
            createdAt: { gte: from, lte: to },
            ...(courseId ? { courseId } : {}),
        }

        const completedWhereBase = {
            completedAt: { not: null, gte: from, lte: to },
            ...(courseId ? { courseId } : {}),
        }

        const quizResultWhereBase = {
            createdAt: { gte: from, lte: to },
            ...(courseId ? { quiz: { lesson: { module: { courseId } } } } : {}),
        }

        const [
            newUsers,
            enrollmentsStarted,
            enrollmentsCompleted,
            certificatesIssued,
            quizResultsForAvg,
            quizAttemptsCount,
        ] = await Promise.all([
            prisma.user.count({
                where: {
                    role: "USER",
                    createdAt: { gte: from, lte: to },
                },
            }),
            prisma.enrollment.count({ where: enrollmentWhereBase }),
            prisma.enrollment.count({ where: completedWhereBase }),
            prisma.certificate.count({
                where: {
                    issuedAt: { gte: from, lte: to },
                    ...(courseId ? { courseId } : {}),
                },
            }),
            prisma.quizResult.findMany({
                where: quizResultWhereBase,
                select: { score: true },
            }),
            prisma.quizResult.count({ where: quizResultWhereBase }),
        ])

        const avgQuizScore =
            quizResultsForAvg.length > 0
                ? Math.round(
                    quizResultsForAvg.reduce((s, r) => s + r.score, 0) /
                    quizResultsForAvg.length
                )
                : 0

        const coursesForBreakdown = courseId
            ? coursesList.filter((c) => c.id === courseId)
            : coursesList

        const courseRows = await Promise.all(
            coursesForBreakdown.map(async (c) => {
                const [enrollments, completed, certs, scores] = await Promise.all([
                    prisma.enrollment.count({
                        where: {
                            courseId: c.id,
                            createdAt: { gte: from, lte: to },
                        },
                    }),
                    prisma.enrollment.count({
                        where: {
                            courseId: c.id,
                            completedAt: { not: null, gte: from, lte: to },
                        },
                    }),
                    prisma.certificate.count({
                        where: {
                            courseId: c.id,
                            issuedAt: { gte: from, lte: to },
                        },
                    }),
                    prisma.quizResult.findMany({
                        where: {
                            createdAt: { gte: from, lte: to },
                            quiz: { lesson: { module: { courseId: c.id } } },
                        },
                        select: { score: true },
                    }),
                ])

                const avgScore =
                    scores.length > 0
                        ? Math.round(
                            scores.reduce((s, r) => s + r.score, 0) / scores.length
                        )
                        : null

                return {
                    id: c.id,
                    title: c.title,
                    price: c.price ? Number(c.price) : null,
                    enrollments,
                    completed,
                    certificates: certs,
                    avgScore,
                }
            })
        )

        return NextResponse.json({
            range: { from: from.toISOString(), to: to.toISOString() },
            stats: {
                newUsers,
                enrollmentsStarted,
                enrollmentsCompleted,
                certificatesIssued,
                avgQuizScore,
                quizAttempts: quizAttemptsCount,
            },
            courses: courseRows,
            courseOptions: coursesList,
        })
    } catch (error) {
        console.error("Reports GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}