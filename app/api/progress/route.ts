import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error

    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get("lessonId")

    const progress = await prisma.progress.findMany({
      where: {
        userId: guard.user.id,
        ...(lessonId ? { lessonId } : {}),
      },
      include: {
        lesson: true,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error
    const userId = guard.user.id

    const { lessonId } = await req.json()

    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json({ error: "lessonId kiritilmagan" }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: { select: { courseId: true, course: { select: { isPublished: true } } } },
        quizzes: { select: { id: true } },
      },
    })

    if (!lesson || !lesson.module.course.isPublished) {
      return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 })
    }

    const courseId = lesson.module.courseId

    // 1) Foydalanuvchi shu kursga yozilgan bo'lishi shart
    const enrolled = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    if (!enrolled) {
      return NextResponse.json({ error: "Bu kursga yozilinmagan" }, { status: 403 })
    }

    // 2) Darsdagi barcha testlardan o'tilgan bo'lishi shart
    if (lesson.quizzes.length > 0) {
      const passedQuizzes = await prisma.quizResult.findMany({
        where: {
          userId,
          passed: true,
          quizId: { in: lesson.quizzes.map((q: { id: string }) => q.id) },
        },
        select: { quizId: true },
        distinct: ["quizId"],
      })
      if (passedQuizzes.length < lesson.quizzes.length) {
        return NextResponse.json(
          { error: "Avval darsdagi testdan muvaffaqiyatli o'ting" },
          { status: 403 }
        )
      }
    }

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completedAt: new Date() },
      create: { userId, lessonId, completedAt: new Date() },
    })

    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    })

    const completedLessons = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: allLessons.map((l) => l.id) },
        completedAt: { not: null },
      },
      select: { lessonId: true },
    })

    const courseCompleted =
      allLessons.length > 0 && completedLessons.length === allLessons.length

    if (courseCompleted) {
      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { completedAt: new Date() },
      })

      // Taxmin qilib bo'lmaydigan raqam + (userId, courseId) bo'yicha takrorlanmaslik
      const certificateNumber = `CERT-${new Date().getFullYear()}-${randomBytes(5)
        .toString("hex")
        .toUpperCase()}`

      await prisma.certificate.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { userId, courseId, certificateNumber },
      })
    }

    return NextResponse.json({ ...progress, courseCompleted })
  } catch (error) {
    console.error("Progress POST xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}
