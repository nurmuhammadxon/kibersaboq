import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { id } = await params
    const role = (session.user as any).role as string
    const userId = (session.user as any).id as string

    const minimal = await prisma.course.findUnique({
      where: { id },
      select: { id: true, isPublished: true },
    })

    if (!minimal) {
      return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 })
    }

    if (role !== "SUPER_ADMIN") {
      if (!minimal.isPublished) {
        return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
      }
      const enrolled = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
      })
      if (!enrolled) {
        return NextResponse.json(
          { error: "Bu kursga hali yozilmagansiz" },
          { status: 403 }
        )
      }
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include:
        role === "SUPER_ADMIN"
          ? {
            modules: {
              orderBy: { order: "asc" },
              include: {
                lessons: { orderBy: { order: "asc" } },
              },
            },
            enrollments: true,
          }
          : {
            modules: {
              orderBy: { order: "asc" },
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    type: true,
                    videoUrl: true, 
                    content: true,
                  },
                },
              },
            },
            enrollments: {
              where: { userId },
            },
          },
    })

    if (!course) {
      return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course GET xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    if ((session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
    }

    const { id } = await params
    const data = await req.json()

    const course = await prisma.course.update({
      where: { id },
      data,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course PATCH xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    if ((session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
    }

    const { id } = await params

    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ message: "Kurs o'chirildi" })
  } catch (error) {
    console.error("Course DELETE xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}