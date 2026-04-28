import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000

export async function POST(req: Request) {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
        where: { email },
        select: { isBlocked: true },
    })

    const since = new Date(Date.now() - BLOCK_DURATION)
    const attempts = await prisma.loginAttempt.count({
        where: { email, createdAt: { gte: since } },
    })

    return NextResponse.json({
        isBlocked: user?.isBlocked ?? false,
        tooManyAttempts: attempts >= MAX_ATTEMPTS,
    })
}