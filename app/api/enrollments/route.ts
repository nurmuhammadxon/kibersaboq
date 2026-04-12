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
    const userId = searchParams.get("userId")

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId || (session.user as any).id,
      },
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
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { courseId, userId } = await req.json()

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId kiritilmagan" },
        { status: 400 }
      )
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: userId || (session.user as any).id,
          courseId,
        },
      },
      update: {},
      create: {
        userId: userId || (session.user as any).id,
        courseId,
        organizationId: (session.user as any).organizationId,
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { courseId, userId } = await req.json()

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: userId || (session.user as any).id,
          courseId,
        },
      },
    })

    return NextResponse.json({ message: "Kursdan chiqarildi" })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}