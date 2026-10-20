import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const guard = await requireUser()
    if (guard.error) return guard.error

    const role = guard.user.role
    const userId = guard.user.id

    const where =
      role === "SUPER_ADMIN"
        ? {}
        : { isPublished: true }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include:
        role === "SUPER_ADMIN"
          ? {
            modules: {
              include: {
                lessons: true,
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

    if (role === "SUPER_ADMIN") return NextResponse.json(courses)

    const safe = courses.map((c: any) =>
      c.enrollments.length > 0
        ? c
        : {
            ...c,
            modules: c.modules.map((m: any) => ({
              ...m,
              lessons: m.lessons.map(({ content, videoUrl, ...rest }: any) => rest),
            })),
          }
    )

    return NextResponse.json(safe)
  } catch (error) {
    console.error("Courses GET xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const { title, description, level, price, duration, thumbnail } = await req.json()

    if (!title) {
      return NextResponse.json({ error: "Kurs nomi talab etiladi" }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level ?? "BEGINNER",
        price,
        duration,
        thumbnail,
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Courses POST xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}