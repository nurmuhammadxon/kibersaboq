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
      where: {
        organizationId: (session.user as any).organizationId,
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
      },
    })

    return NextResponse.json(courses)
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

    const { title, titleRu, description, descriptionRu, imageUrl } =
      await req.json()

    if (!title || !titleRu) {
      return NextResponse.json(
        { error: "Kurs nomini kiriting" },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        titleRu,
        description,
        descriptionRu,
        imageUrl,
        organizationId: (session.user as any).organizationId,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}