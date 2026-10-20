import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

const DAY = 24 * 60 * 60 * 1000
const MAX_RANGE_DAYS = 366

function dayStart(d: Date) {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

function avg(scores: number[]) {
    return scores.length > 0
        ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
        : null
}

export async function GET(req: Request) {
    try {
        const guard = await requireUser(["DIRECTOR"])
        if (guard.error) return guard.error

        const companyId = guard.user.companyId
        if (!companyId) return NextResponse.json({ error: "Korxona topilmadi" }, { status: 404 })

        const { searchParams } = new URL(req.url)
        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")
        const courseId = searchParams.get("courseId") || undefined

        const to = toParam
            ? new Date(toParam + "T23:59:59.999Z")
            : new Date(new Date().toISOString().slice(0, 10) + "T23:59:59.999Z")

        const from = fromParam
            ? new Date(fromParam + "T00:00:00.000Z")
            : new Date(
                new Date(to.getTime() - 29 * DAY).toISOString().slice(0, 10) +
                "T00:00:00.000Z"
            )

        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
            return NextResponse.json({ error: "Noto'g'ri sana formati" }, { status: 400 })
        }
        if (from > to) {
            return NextResponse.json(
                { error: "Boshlanish sanasi tugash sanasidan keyin bo'lmasligi kerak" },
                { status: 400 }
            )
        }

        const totalDays = Math.round((dayStart(to) - dayStart(from)) / DAY) + 1
        if (totalDays > MAX_RANGE_DAYS) {
            return NextResponse.json(
                { error: `Davr ${MAX_RANGE_DAYS} kundan oshmasligi kerak` },
                { status: 400 }
            )
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true, name: true, code: true },
        })
        if (!company) {
            return NextResponse.json({ error: "Korxona topilmadi" }, { status: 404 })
        }

        const employees = await prisma.user.findMany({
            where: { companyId, role: "USER" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                field: true,
                isBlocked: true,
            },
        })
        const employeeIds = employees.map((e) => e.id)
        const userIn = { in: employeeIds }
        const range = { gte: from, lte: to }

        const [
            enrollmentRows,
            completedRows,
            certificateRows,
            quizRows,
            progressRows,
            courseOptions,
        ] = await Promise.all([
            prisma.enrollment.findMany({
                where: {
                    userId: userIn,
                    createdAt: range,
                    ...(courseId ? { courseId } : {}),
                },
                select: { userId: true, courseId: true },
            }),
            prisma.enrollment.findMany({
                where: {
                    userId: userIn,
                    completedAt: { not: null, ...range },
                    ...(courseId ? { courseId } : {}),
                },
                select: { userId: true, courseId: true, completedAt: true },
            }),
            prisma.certificate.findMany({
                where: {
                    userId: userIn,
                    issuedAt: range,
                    ...(courseId ? { courseId } : {}),
                },
                select: { userId: true, courseId: true, issuedAt: true },
            }),
            prisma.quizResult.findMany({
                where: {
                    userId: userIn,
                    createdAt: range,
                    ...(courseId
                        ? { quiz: { lesson: { module: { courseId } } } }
                        : {}),
                },
                select: {
                    userId: true,
                    score: true,
                    quiz: {
                        select: {
                            lesson: { select: { module: { select: { courseId: true } } } },
                        },
                    },
                },
            }),
            prisma.progress.findMany({
                where: {
                    userId: userIn,
                    completedAt: { not: null, ...range },
                    ...(courseId ? { lesson: { module: { courseId } } } : {}),
                },
                select: { userId: true, completedAt: true },
            }),
            prisma.course.findMany({
                where: { enrollments: { some: { userId: userIn } } },
                select: { id: true, title: true },
                orderBy: { title: "asc" },
            }),
        ])

        const bucketSize = totalDays > 31 ? 7 : 1
        const bucketCount = Math.ceil(totalDays / bucketSize)
        const fromDay = dayStart(from)

        const activity = Array.from({ length: bucketCount }, (_, i) => ({
            date: new Date(fromDay + i * bucketSize * DAY).toISOString().slice(0, 10),
            lessons: 0,
            completions: 0,
            certificates: 0,
        }))

        const bucketOf = (d: Date) => {
            const idx = Math.floor((dayStart(d) - fromDay) / DAY / bucketSize)
            return Math.min(Math.max(idx, 0), bucketCount - 1)
        }

        progressRows.forEach((r) => {
            if (r.completedAt) activity[bucketOf(r.completedAt)].lessons++
        })
        completedRows.forEach((r) => {
            if (r.completedAt) activity[bucketOf(r.completedAt)].completions++
        })
        certificateRows.forEach((r) => {
            activity[bucketOf(r.issuedAt)].certificates++
        })

        const byUser = new Map(
            employees.map((e) => [
                e.id,
                {
                    id: e.id,
                    firstName: e.firstName,
                    lastName: e.lastName,
                    email: e.email,
                    field: e.field,
                    isBlocked: e.isBlocked,
                    enrollments: 0,
                    completed: 0,
                    lessons: 0,
                    certificates: 0,
                    scores: [] as number[],
                },
            ])
        )
        enrollmentRows.forEach((r) => { byUser.get(r.userId)!.enrollments++ })
        completedRows.forEach((r) => { byUser.get(r.userId)!.completed++ })
        progressRows.forEach((r) => { byUser.get(r.userId)!.lessons++ })
        certificateRows.forEach((r) => { byUser.get(r.userId)!.certificates++ })
        quizRows.forEach((r) => { byUser.get(r.userId)!.scores.push(r.score) })

        const employeeRows = Array.from(byUser.values())
            .map(({ scores, ...u }) => ({ ...u, avgScore: avg(scores) }))
            .sort(
                (a, b) =>
                    b.completed - a.completed ||
                    b.lessons - a.lessons ||
                    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
            )

        const activeIds = new Set<string>([
            ...enrollmentRows.map((r) => r.userId),
            ...completedRows.map((r) => r.userId),
            ...progressRows.map((r) => r.userId),
            ...quizRows.map((r) => r.userId),
        ])

        const courseRows = courseOptions
            .filter((c) => !courseId || c.id === courseId)
            .map((c) => ({
                id: c.id,
                title: c.title,
                enrollments: enrollmentRows.filter((r) => r.courseId === c.id).length,
                completed: completedRows.filter((r) => r.courseId === c.id).length,
                certificates: certificateRows.filter((r) => r.courseId === c.id).length,
                avgScore: avg(
                    quizRows
                        .filter((r) => r.quiz.lesson.module.courseId === c.id)
                        .map((r) => r.score)
                ),
            }))

        return NextResponse.json({
            range: { from: from.toISOString(), to: to.toISOString() },
            bucketSize,
            company: { name: company.name, code: company.code },
            stats: {
                totalEmployees: employees.length,
                activeEmployees: activeIds.size,
                enrollmentsStarted: enrollmentRows.length,
                enrollmentsCompleted: completedRows.length,
                certificatesIssued: certificateRows.length,
                lessonsCompleted: progressRows.length,
                avgQuizScore: avg(quizRows.map((r) => r.score)) ?? 0,
                quizAttempts: quizRows.length,
            },
            activity,
            employees: employeeRows,
            courses: courseRows,
            courseOptions,
        })
    } catch (error) {
        console.error("Director reports GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}