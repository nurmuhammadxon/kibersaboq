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
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                field: true,
                createdAt: true,
                isBlocked: true,
                enrollments: {
                    select: {
                        id: true,
                        completedAt: true,
                        course: { select: { id: true, title: true } },
                    },
                },
                certificates: {
                    select: { id: true },
                },
                results: {
                    select: { score: true },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        const result = employees.map(emp => {
            const totalEnrollments = emp.enrollments.length
            const completedEnrollments = emp.enrollments.filter(e => e.completedAt).length
            const avgScore = emp.results.length > 0
                ? Math.round(emp.results.reduce((s, r) => s + r.score, 0) / emp.results.length)
                : 0
            const progressPercent = totalEnrollments > 0
                ? Math.round((completedEnrollments / totalEnrollments) * 100)
                : 0

            return {
                id: emp.id,
                firstName: emp.firstName,
                lastName: emp.lastName,
                email: emp.email,
                field: emp.field,
                createdAt: emp.createdAt,
                isBlocked: emp.isBlocked,
                totalEnrollments,
                completedEnrollments,
                certificates: emp.certificates.length,
                avgScore,
                progressPercent,
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Director employees xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}