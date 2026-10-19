import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error

    const { id } = await params
    const role = guard.user.role
    const userId = guard.user.id

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
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const { id } = await params
    const body = await req.json()
    const data: Record<string, unknown> = {}
    for (const key of ["title", "description", "thumbnail", "price", "duration", "level", "isPublished"]) {
      if (key in body) data[key] = body[key]
    }

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
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const { id } = await params

    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ message: "Kurs o'chirildi" })
  } catch (error) {
    console.error("Course DELETE xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}