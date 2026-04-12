import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        console.log("Session:", session)

        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const orgId = (session.user as any).organizationId

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
                where: { organizationId: orgId, role: "USER" },
            }),

            prisma.course.count({
                where: { organizationId: orgId }
            }),

            prisma.enrollment.count({
                where: { user: { organizationId: orgId } },
            }),

            prisma.enrollment.count({
                where: {
                    user: { organizationId: orgId },
                    completedAt: { not: null },
                },
            }),

            prisma.quizResult.findMany({
                where: {
                    user: { organizationId: orgId },
                },
                select: { score: true },
            }),

            prisma.user.findMany({
                where: { organizationId: orgId, role: "USER" },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            }),

            prisma.user.findMany({
                where: { organizationId: orgId, role: "USER" },
                take: 5,
                select: {
                    id: true,
                    name: true,
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
                name: u.name,
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
            recentUsers,
            topUsers: topUsersFormatted,
        })
    } catch (error) {
        console.error("Dashboard xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}