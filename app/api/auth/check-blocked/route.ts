import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientIp } from "@/lib/rate-limit"

const MAX_PER_EMAIL_IP = 5
const BLOCK_DURATION = 15 * 60 * 1000

export async function POST(req: Request) {
    const { email } = await req.json()
    if (typeof email !== "string") {
        return NextResponse.json({ error: "Email kiritilmagan" }, { status: 400 })
    }

    const ip = clientIp(req)

    const user = await prisma.user.findUnique({
        where: { email },
        select: { isBlocked: true },
    })

    const since = new Date(Date.now() - BLOCK_DURATION)
    const attempts = await prisma.loginAttempt.count({
        where: { email, ip, createdAt: { gte: since } },
    })

    return NextResponse.json({
        isBlocked: user?.isBlocked ?? false,
        tooManyAttempts: attempts >= MAX_PER_EMAIL_IP,
    })
}
