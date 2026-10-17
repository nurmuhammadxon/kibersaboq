import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

        const role = (session.user as any).role
        if (role !== "DIRECTOR") return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

        const companyId = (session.user as any).companyId
        if (!companyId) return NextResponse.json({ error: "Korxona topilmadi" }, { status: 404 })

        const employees = await prisma.user.findMany({
            where: { companyId, role: "USER" },
            select: { id: true },
        })

        const employeeIds = employees.map(e => e.id)
        const totalEmployees = employees.length

        const [
            enrollments,
            completedEnrollments,
            certificatesIssued,
            quizResults,
            activeEmployees,
        ] = await Promise.all([
            prisma.enrollment.count({
                where: { userId: { in: employeeIds } },
            }),
            prisma.enrollment.count({
                where: { userId: { in: employeeIds }, completedAt: { not: null } },
            }),
            prisma.certificate.count({
                where: { userId: { in: employeeIds } },
            }),
            prisma.quizResult.findMany({
                where: { userId: { in: employeeIds } },
                select: { score: true },
            }),
            prisma.user.count({
                where: {
                    companyId,
                    role: "USER",
                    enrollments: { some: {} },
                },
            }),
        ])

        const avgScore = quizResults.length > 0
            ? Math.round(quizResults.reduce((s, r) => s + r.score, 0) / quizResults.length)
            : 0

        return NextResponse.json({
            totalEmployees,
            activeEmployees,
            totalEnrollments: enrollments,
            completedEnrollments,
            certificatesIssued,
            avgScore,
        })
    } catch (error) {
        console.error("Director dashboard xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}