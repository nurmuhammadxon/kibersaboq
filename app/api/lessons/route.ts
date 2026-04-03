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
    const moduleId = searchParams.get("moduleId")

    const lessons = await prisma.lesson.findMany({
      where: moduleId ? { moduleId } : undefined,
      orderBy: { order: "asc" },
    })

    return NextResponse.json(lessons)
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

    const { title, titleRu, content, contentRu, videoUrl, fileUrl, type, moduleId } =
      await req.json()

    if (!title || !titleRu || !content || !contentRu || !moduleId) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      )
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
    })

    const lesson = await prisma.lesson.create({
      data: {
        title,
        titleRu,
        content,
        contentRu,
        videoUrl,
        fileUrl,
        type: type || "TEXT",
        moduleId,
        order: lastLesson ? lastLesson.order + 1 : 1,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}