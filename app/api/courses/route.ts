import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        modules: {
          include: {
            lessons: true,
          }
        },
        enrollments: true,
      }
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
        organizationId: (session.user as any).organizationId,
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Courses POST xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}