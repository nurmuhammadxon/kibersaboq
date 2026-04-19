import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function startOfDay(d: Date) {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
}

function endOfDay(d: Date) {
    const x = new Date(d)
    x.setHours(23, 59, 59, 999)
    return x
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId as string
        const { searchParams } = new URL(req.url)

        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")
        const courseId = searchParams.get("courseId") || undefined

        const to = toParam ? endOfDay(new Date(toParam)) : endOfDay(new Date())
        const from = fromParam
            ? startOfDay(new Date(fromParam))
            : startOfDay(new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000))

        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            return NextResponse.json({ error: "Noto'g'ri sana formati" }, { status: 400 })
        }

        if (from > to) {
            return NextResponse.json(
                { error: "Boshlanish sanasi tugash sanasidan keyin bo'lmasligi kerak" },
                { status: 400 }
            )
        }

        if (courseId) {
            const course = await prisma.course.findFirst({
                where: { id: courseId, organizationId: orgId },
            })
            if (!course) {
                return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 })
            }
        }

        const coursesList = await prisma.course.findMany({
            where: { organizationId: orgId },
            select: { id: true, title: true },
            orderBy: { title: "asc" },
        })

        const enrollmentWhereBase = {
            organizationId: orgId,
            createdAt: { gte: from, lte: to },
            ...(courseId ? { courseId } : {}),
        }

        const completedWhereBase = {
            organizationId: orgId,
            completedAt: { not: null, gte: from, lte: to },
            ...(courseId ? { courseId } : {}),
        }

        const quizResultWhereBase = {
            createdAt: { gte: from, lte: to },
            user: { organizationId: orgId },
            ...(courseId
                ? {
                      quiz: {
                          lesson: { module: { courseId } },
                      },
                  }
                : {}),
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
                    organizationId: orgId,
                    role: "USER",
                    createdAt: { gte: from, lte: to },
                },
            }),
            prisma.enrollment.count({ where: enrollmentWhereBase }),
            prisma.enrollment.count({ where: completedWhereBase }),
            prisma.certificate.count({
                where: {
                    issuedAt: { gte: from, lte: to },
                    user: { organizationId: orgId },
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
                            organizationId: orgId,
                            courseId: c.id,
                            createdAt: { gte: from, lte: to },
                        },
                    }),
                    prisma.enrollment.count({
                        where: {
                            organizationId: orgId,
                            courseId: c.id,
                            completedAt: { not: null, gte: from, lte: to },
                        },
                    }),
                    prisma.certificate.count({
                        where: {
                            courseId: c.id,
                            issuedAt: { gte: from, lte: to },
                            user: { organizationId: orgId },
                        },
                    }),
                    prisma.quizResult.findMany({
                        where: {
                            createdAt: { gte: from, lte: to },
                            user: { organizationId: orgId },
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
