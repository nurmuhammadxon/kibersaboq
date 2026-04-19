import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const role = (session.user as any).role as string
        if (role === "SUPER_ADMIN") {
            return NextResponse.json(
                { error: "Bu endpoint faqat foydalanuvchilar uchun" },
                { status: 403 }
            )
        }

        const userId = (session.user as any).id as string

        const [enrollments, quizResults, certificateCount] = await Promise.all([
            prisma.enrollment.findMany({
                where: { userId },
                include: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            thumbnail: true,
                            level: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.quizResult.findMany({
                where: { userId },
                select: { score: true },
            }),
            prisma.certificate.count({ where: { userId } }),
        ])

        const courseIds = [...new Set(enrollments.map((e) => e.courseId))]
        const lessonRows =
            courseIds.length > 0
                ? await prisma.lesson.findMany({
                      where: {
                          module: { courseId: { in: courseIds } },
                      },
                      select: { id: true, module: { select: { courseId: true } } },
                  })
                : []

        const lessonsByCourse = new Map<string, string[]>()
        for (const row of lessonRows) {
            const cid = row.module.courseId
            const arr = lessonsByCourse.get(cid) ?? []
            arr.push(row.id)
            lessonsByCourse.set(cid, arr)
        }

        const completedLessons = await prisma.progress.findMany({
            where: {
                userId,
                completedAt: { not: null },
                lessonId: {
                    in: lessonRows.map((r) => r.id),
                },
            },
            select: { lessonId: true },
        })
        const doneSet = new Set(completedLessons.map((p) => p.lessonId))

        const coursesSummary = enrollments.map((e) => {
            const lid = lessonsByCourse.get(e.courseId) ?? []
            const total = lid.length
            const done = lid.filter((id) => doneSet.has(id)).length
            const progressPercent =
                total === 0 ? 0 : Math.round((done / total) * 100)
            return {
                enrollmentId: e.id,
                courseId: e.course.id,
                title: e.course.title,
                thumbnail: e.course.thumbnail,
                level: e.course.level,
                completedAt: e.completedAt,
                progressPercent,
                totalLessons: total,
                completedLessons: done,
            }
        })

        const inProgress = coursesSummary
            .filter((c) => !c.completedAt)
            .sort((a, b) => b.progressPercent - a.progressPercent)
            .slice(0, 5)

        const avgQuizScore =
            quizResults.length > 0
                ? Math.round(
                      quizResults.reduce((s, r) => s + r.score, 0) /
                          quizResults.length
                  )
                : 0

        return NextResponse.json({
            stats: {
                enrolledCourses: enrollments.length,
                completedCourses: enrollments.filter((e) => e.completedAt).length,
                certificates: certificateCount,
                avgQuizScore,
            },
            inProgress,
            courses: coursesSummary,
        })
    } catch (error) {
        console.error("User dashboard GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
