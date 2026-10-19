import { prisma } from "@/lib/prisma"

/**
 * Oddiy bazaga asoslangan cheklov (qo'shimcha xizmat kerak emas).
 * Mavjud LoginAttempt jadvalidan `email` ustuni kalit sifatida ishlatiladi
 * (masalan "forgot:1.2.3.4"), shuning uchun sxemani o'zgartirish shart emas.
 */
export function clientIp(req: Request): string {
    const xff = req.headers.get("x-forwarded-for")
    return xff?.split(",")[0].trim() || "unknown"
}

export async function isLimited(
    key: string,
    max: number,
    windowMs: number
): Promise<boolean> {
    const since = new Date(Date.now() - windowMs)
    const count = await prisma.loginAttempt.count({
        where: { email: key, createdAt: { gte: since } },
    })
    return count >= max
}

export async function recordHit(key: string, ip: string) {
    await prisma.loginAttempt.create({ data: { email: key, ip } })
}
