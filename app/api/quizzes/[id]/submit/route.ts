import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { answers } = await req.json()
    // answers = [{ questionId, optionId }]

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Test topilmadi" }, { status: 404 })
    }

    let correct = 0
    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId)
      if (!question) continue

      const selectedOption = question.options.find(
        (o) => o.id === answer.optionId
      )
      if (selectedOption?.isCorrect) correct++
    }

    const score = Math.round((correct / quiz.questions.length) * 100)
    const passed = score >= 70 

    const result = await prisma.quizResult.create({
      data: {
        userId: (session.user as any).id,
        quizId: params.id,
        score,
        passed,
      },
    })

    return NextResponse.json({
      score,
      passed,
      correct,
      total: quiz.questions.length,
      resultId: result.id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}