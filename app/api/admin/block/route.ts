import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { email } = await req.json()

    await prisma.user.update({
        where: { email },
        data: { isBlocked: true },
    })

    return NextResponse.json({ success: true })
}