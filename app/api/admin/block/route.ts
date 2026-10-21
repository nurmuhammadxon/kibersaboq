import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    }

    const { email } = await req.json()

    const target = await prisma.user.findUnique({ where: { email }, select: { role: true } })
    if (!target) {
        return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
    }
    if (target.role === "SUPER_ADMIN") {
        return NextResponse.json({ error: "Adminni bloklab bo'lmaydi" }, { status: 403 })
    }

    await prisma.user.update({
        where: { email },
        data: { isBlocked: true },
    })

    return NextResponse.json({ success: true })
}