import { prisma } from "@/lib/prisma"

/**
 * Sertifikatlar uchun shubhali test natijalari sabablari.
 * Kalit: `${userId}:${courseId}`, qiymat: noyob sabablar ro'yxati.
 */
export async function flagsForCertificates(
    pairs: { userId: string; courseId: string }[]
): Promise<Map<string, string[]>> {
    const out = new Map<string, string[]>()
    if (pairs.length === 0) return out

    const rows = await prisma.quizResult.findMany({
        where: {
            flagged: true,
            userId: { in: [...new Set(pairs.map((p) => p.userId))] },
            quiz: {
                lesson: { module: { courseId: { in: [...new Set(pairs.map((p) => p.courseId))] } } },
            },
        },
        select: {
            userId: true,
            flagReason: true,
            quiz: { select: { lesson: { select: { module: { select: { courseId: true } } } } } },
        },
    })

    for (const r of rows) {
        const key = `${r.userId}:${r.quiz.lesson.module.courseId}`
        const list = out.get(key) ?? []
        for (const reason of (r.flagReason ?? "").split("; ").filter(Boolean)) {
            if (!list.includes(reason)) list.push(reason)
        }
        if (list.length === 0) list.push("Shubhali natija")
        out.set(key, list)
    }
    return out
}
