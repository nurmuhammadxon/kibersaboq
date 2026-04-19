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
    const lessonId = searchParams.get("lessonId")

    const progress = await prisma.progress.findMany({
      where: {
        userId: (session.user as any).id,
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
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const userId = (session.user as any).id as string
    const { lessonId } = await req.json()

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId kiritilmagan" }, { status: 400 })
    }

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completedAt: new Date() },
      create: { userId, lessonId, completedAt: new Date() },
    })

    // Dars qaysi kursga tegishli
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    })

    if (!lesson) {
      return NextResponse.json({ ...progress, courseCompleted: false })
    }

    const courseId = lesson.module.courseId

    // Kursning barcha darslarini topamiz
    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    })

    // Foydalanuvchi tugatgan darslar
    const completedLessons = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: allLessons.map((l) => l.id) },
        completedAt: { not: null },
      },
      select: { lessonId: true },
    })

    const courseCompleted = allLessons.length > 0 && completedLessons.length === allLessons.length

    if (courseCompleted) {
      // Enrollment ni yakunlangan deb belgilaymiz
      await prisma.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { completedAt: new Date() },
      })

      // Sertifikat allaqachon bormi
      const existing = await prisma.certificate.findFirst({
        where: { userId, courseId },
      })

      if (!existing) {
        const certificateNumber = `CERT-${Date.now()}-${userId.slice(-4).toUpperCase()}`
        await prisma.certificate.create({
          data: {
            userId,
            courseId,
            certificateNumber,
            issuedAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({ ...progress, courseCompleted })
  } catch (error) {
    console.error("Progress POST xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}