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

    const { lessonId } = await req.json()

    if (!lessonId) {
      return NextResponse.json(
        { error: "lessonId kiritilmagan" },
        { status: 400 }
      )
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: (session.user as any).id,
          lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: (session.user as any).id,
        lessonId,
        completedAt: new Date(),
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}