import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const DAY = 24 * 60 * 60 * 1000
const MAX_RANGE_DAYS = 366
const MAX_USER_ROWS = 500

function dayStart(d: Date) {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

function avg(scores: number[]) {
    return scores.length > 0
        ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
        : null
}

type Agg = {
    enrollments: number
    completed: number
    lessons: number
    certificates: number
    scores: number[]
}

const emptyAgg = (): Agg => ({
    enrollments: 0,
    completed: 0,
    lessons: 0,
    certificates: 0,
    scores: [],
})

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }
        if ((session.user as any).role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
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

        const range = { gte: from, lte: to }
        const byCourse = courseId ? { courseId } : {}
        const lessonCourse = courseId ? { lesson: { module: { courseId } } } : {}

        const [
            totalUsers,
            totalCompanies,
            totalCourses,
            totalCertificates,
            newUsers,
            users,
            companies,
            coursesList,
            enrollmentRows,
            completedRows,
            certificateRows,
            progressRows,
            quizRows,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "USER" } }),
            prisma.company.count(),
            prisma.course.count(),
            prisma.certificate.count(),
            prisma.user.count({ where: { role: "USER", createdAt: range } }),
            prisma.user.findMany({
                where: { role: "USER" },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    organizationName: true,
                    isBlocked: true,
                    companyId: true,
                },
            }),
            prisma.company.findMany({
                select: { id: true, name: true, code: true },
                orderBy: { name: "asc" },
            }),
            prisma.course.findMany({
                select: { id: true, title: true, price: true },
                orderBy: { title: "asc" },
            }),
            prisma.enrollment.findMany({
                where: { createdAt: range, ...byCourse },
                select: { userId: true, courseId: true },
            }),
            prisma.enrollment.findMany({
                where: { completedAt: { not: null, ...range }, ...byCourse },
                select: { userId: true, courseId: true, completedAt: true },
            }),
            prisma.certificate.findMany({
                where: { issuedAt: range, ...byCourse },
                select: { userId: true, courseId: true, issuedAt: true },
            }),
            prisma.progress.findMany({
                where: { completedAt: { not: null, ...range }, ...lessonCourse },
                select: { userId: true, completedAt: true },
            }),
            prisma.quizResult.findMany({
                where: {
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

        const userAgg = new Map<string, Agg>(users.map((u) => [u.id, emptyAgg()]))
        enrollmentRows.forEach((r) => { const a = userAgg.get(r.userId); if (a) a.enrollments++ })
        completedRows.forEach((r) => { const a = userAgg.get(r.userId); if (a) a.completed++ })
        progressRows.forEach((r) => { const a = userAgg.get(r.userId); if (a) a.lessons++ })
        certificateRows.forEach((r) => { const a = userAgg.get(r.userId); if (a) a.certificates++ })
        quizRows.forEach((r) => { const a = userAgg.get(r.userId); if (a) a.scores.push(r.score) })

        const companyName = new Map(companies.map((c) => [c.id, c.name]))

        const allUserRows = users
            .map((u) => {
                const a = userAgg.get(u.id)!
                return {
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    email: u.email,
                    company: (u.companyId && companyName.get(u.companyId)) || u.organizationName || "Mustaqil",
                    isBlocked: u.isBlocked,
                    enrollments: a.enrollments,
                    completed: a.completed,
                    lessons: a.lessons,
                    certificates: a.certificates,
                    avgScore: avg(a.scores),
                }
            })
            .sort(
                (a, b) =>
                    b.completed - a.completed ||
                    b.lessons - a.lessons ||
                    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
            )

        const companyAgg = new Map<string, Agg & { employees: number; active: number }>()
        const NO_COMPANY = "__none__"
        users.forEach((u) => {
            const key = u.companyId ?? NO_COMPANY
            const c = companyAgg.get(key) ?? { ...emptyAgg(), employees: 0, active: 0 }
            const a = userAgg.get(u.id)!
            c.employees++
            c.enrollments += a.enrollments
            c.completed += a.completed
            c.lessons += a.lessons
            c.certificates += a.certificates
            c.scores.push(...a.scores)
            if (a.enrollments + a.completed + a.lessons + a.scores.length > 0) c.active++
            companyAgg.set(key, c)
        })

        const companyRows = [
            ...companies.map((c) => ({ id: c.id, name: c.name, code: c.code })),
            ...(companyAgg.has(NO_COMPANY)
                ? [{ id: NO_COMPANY, name: "Korxonasiz", code: "—" }]
                : []),
        ].map((c) => {
            const a = companyAgg.get(c.id) ?? { ...emptyAgg(), employees: 0, active: 0 }
            return {
                id: c.id,
                name: c.name,
                code: c.code,
                employees: a.employees,
                activeEmployees: a.active,
                enrollments: a.enrollments,
                completed: a.completed,
                lessons: a.lessons,
                certificates: a.certificates,
                avgScore: avg(a.scores),
            }
        })

        const courseRows = coursesList
            .filter((c) => !courseId || c.id === courseId)
            .map((c) => ({
                id: c.id,
                title: c.title,
                price: c.price ? Number(c.price) : null,
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
            totals: { totalUsers, totalCompanies, totalCourses, totalCertificates },
            stats: {
                newUsers,
                enrollmentsStarted: enrollmentRows.length,
                enrollmentsCompleted: completedRows.length,
                certificatesIssued: certificateRows.length,
                lessonsCompleted: progressRows.length,
                avgQuizScore: avg(quizRows.map((r) => r.score)) ?? 0,
                quizAttempts: quizRows.length,
            },
            activity,
            companies: companyRows,
            users: allUserRows.slice(0, MAX_USER_ROWS),
            usersTotal: allUserRows.length,
            courses: courseRows,
            courseOptions: coursesList.map((c) => ({ id: c.id, title: c.title })),
        })
    } catch (error) {
        console.error("Reports GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}