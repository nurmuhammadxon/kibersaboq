import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const [
            totalUsers,
            totalCourses,
            totalEnrollments,
            completedEnrollments,
            quizResults,
            recentUsers,
            topUsers,
        ] = await Promise.all([
            prisma.user.count({
                where: { role: "USER" },
            }),

            prisma.course.count(),

            prisma.enrollment.count(),

            prisma.enrollment.count({
                where: { completedAt: { not: null } },
            }),

            prisma.quizResult.findMany({
                select: { score: true },
            }),

            prisma.user.findMany({
                where: { role: "USER" },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                },
            }),

            prisma.user.findMany({
                where: { role: "USER" },
                take: 5,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    results: {
                        select: { score: true },
                    },
                    enrollments: {
                        where: { completedAt: { not: null } },
                        select: { id: true },
                    },
                },
            }),
        ])

        const avgScore =
            quizResults.length > 0
                ? Math.round(
                    quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length
                )
                : 0

        const topUsersFormatted = topUsers
            .map((u) => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                avgScore:
                    u.results.length > 0
                        ? Math.round(
                            u.results.reduce((sum, r) => sum + r.score, 0) / u.results.length
                        )
                        : 0,
                completedCourses: u.enrollments.length,
            }))
            .sort((a, b) => b.avgScore - a.avgScore)

        const recentUsersFormatted = recentUsers.map((u) => ({
            ...u,
            name: `${u.firstName} ${u.lastName}`,
        }))

        return NextResponse.json({
            stats: {
                totalUsers,
                totalCourses,
                totalEnrollments,
                completedEnrollments,
                avgScore,
                completionRate:
                    totalEnrollments > 0
                        ? Math.round((completedEnrollments / totalEnrollments) * 100)
                        : 0,
            },
            recentUsers: recentUsersFormatted,
            topUsers: topUsersFormatted,
        })
    } catch (error) {
        console.error("Dashboard xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}