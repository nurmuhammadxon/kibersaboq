import { randomInt } from "crypto"

/**
 * Test va dars vaqti bo'yicha halollikni ta'minlash qoidalari.
 * Hamma hisob-kitob serverda bajariladi, brauzerga ishonilmaydi.
 */
export const MAX_ATTEMPTS = 3 // bir testga 24 soat ichida urinishlar soni
export const ATTEMPT_WINDOW_MS = 24 * 60 * 60 * 1000
export const ATTEMPT_TTL_MS = 30 * 60 * 1000 // boshlangan test shu vaqt ichida yuborilishi kerak
export const QUESTIONS_PER_ATTEMPT = 5 // savollar bankidan shuncha savol tasodifiy tanlanadi
export const PASS_SCORE = 70
export const MIN_SEC_PER_QUESTION = 4 // bundan tez yechilsa shubhali
export const BLUR_LIMIT = 3 // test vaqtida sahifadan shuncha marta chiqilsa shubhali
export const PING_MIN_GAP_MS = 3000
export const PING_MAX_CREDIT_S = 12 // bitta ping uchun ko'pi bilan shuncha soniya hisoblanadi
export const TIME_TOLERANCE_S = 2

/** Fisher-Yates, kriptografik tasodifiylik bilan */
export function shuffle<T>(items: readonly T[]): T[] {
    const a = [...items]
    for (let i = a.length - 1; i > 0; i--) {
        const j = randomInt(i + 1)
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

export function pickQuestions<T>(all: readonly T[], n = QUESTIONS_PER_ATTEMPT): T[] {
    return shuffle(all).slice(0, n)
}

/**
 * Oldingi pingdan beri o'tgan vaqt uchun nechta soniya hisoblanishini aniqlaydi.
 * Mijoz har ~10 soniyada ping yuboradi; ping tez-tez yuborilsa ham, hisoblanadigan
 * vaqt haqiqiy o'tgan vaqtdan oshmaydi, uzoq tanaffusdan keyin esa cheklangan miqdor beriladi.
 */
export function pingCredit(
    prev: Date | null,
    now: Date
): { credit: number; advance: boolean } {
    if (!prev) return { credit: 0, advance: true }
    const gapMs = now.getTime() - prev.getTime()
    if (gapMs < PING_MIN_GAP_MS) return { credit: 0, advance: false }
    return { credit: Math.min(Math.floor(gapMs / 1000), PING_MAX_CREDIT_S), advance: true }
}

/** Dars yakunlanishi uchun yana necha soniya faol o'qish kerak (0 bo'lsa, yetarli) */
export function remainingActiveSeconds(active: number, minDuration: number | null): number {
    if (!minDuration) return 0
    return Math.max(0, Math.ceil(minDuration - TIME_TOLERANCE_S - active))
}

/** Shubhali natija sabablari (bo'sh massiv: shubhasiz) */
export function quizFlags(input: {
    durationSec: number
    questionCount: number
    blurCount: number
}): string[] {
    const reasons: string[] = []
    if (input.questionCount > 0 && input.durationSec < input.questionCount * MIN_SEC_PER_QUESTION) {
        reasons.push(`Test juda tez yechilgan (${input.durationSec} soniya)`)
    }
    if (input.blurCount >= BLUR_LIMIT) {
        reasons.push(`Test vaqtida sahifadan ${input.blurCount} marta chiqilgan`)
    }
    return reasons
}
