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
    const userId = (session.user as any).id as string

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

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Courses GET xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

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