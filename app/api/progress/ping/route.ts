import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import { pingCredit } from "@/lib/quiz-integrity"

/**
 * Mijoz dars sahifasi ochiq va foydalanuvchi faol bo'lganda har ~10 soniyada chaqiradi.
 * Faol o'qish vaqtini faqat server hisoblaydi: hisoblanadigan vaqt ikki ping orasidagi
 * haqiqiy vaqtdan oshmaydi, shuning uchun pingni tez-tez yuborish foyda bermaydi.
 */
export async function POST(req: Request) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error
        const userId = guard.user.id

        const { lessonId } = await req.json()
        if (!lessonId || typeof lessonId !== "string") {
            return NextResponse.json({ error: "lessonId kiritilmagan" }, { status: 400 })
        }

        const prog = await prisma.progress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
            select: { id: true, completedAt: true, activeSeconds: true, lastPingAt: true },
        })
        if (!prog) {
            return NextResponse.json({ error: "Avval darsni oching" }, { status: 404 })
        }
        if (prog.completedAt) {
            return NextResponse.json({ activeSeconds: prog.activeSeconds, completed: true })
        }

        const now = new Date()
        const { credit, advance } = pingCredit(prog.lastPingAt, now)
        if (!advance) {
            return NextResponse.json({ activeSeconds: prog.activeSeconds })
        }

        // Ikki oyna bir vaqtda ping yuborsa, vaqt ikki marta hisoblanmasligi uchun
        // faqat lastPingAt o'zgarmagan bo'lsa yangilaymiz.
        await prisma.progress.updateMany({
            where: { id: prog.id, lastPingAt: prog.lastPingAt },
            data: { activeSeconds: { increment: credit }, lastPingAt: now },
        })

        const fresh = await prisma.progress.findUnique({
            where: { id: prog.id },
            select: { activeSeconds: true },
        })
        return NextResponse.json({ activeSeconds: fresh?.activeSeconds ?? prog.activeSeconds })
    } catch (error) {
        console.error("Progress ping xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
