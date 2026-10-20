import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error
    const { user } = guard

    const { searchParams } = new URL(req.url)
    const requested = searchParams.get("userId")
    const targetUserId =
      user.role === "SUPER_ADMIN" && requested ? requested : user.id

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: targetUserId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error
    const { user } = guard

    const { courseId, userId } = await req.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "courseId kiritilmagan" },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { isPublished: true },
    })
    if (!course || (!course.isPublished && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 })
    }

    const targetUserId =
      user.role === "SUPER_ADMIN" && userId ? userId : user.id

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: targetUserId, courseId },
      },
      update: {},
      create: { userId: targetUserId, courseId },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error
    const { user } = guard

    const { courseId, userId } = await req.json()

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "courseId kiritilmagan" }, { status: 400 })
    }

    const targetUserId =
      user.role === "SUPER_ADMIN" && userId ? userId : user.id

    await prisma.enrollment.deleteMany({
      where: { userId: targetUserId, courseId },
    })

    return NextResponse.json({ message: "Kursdan chiqarildi" })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}
