import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json({ error: "Token va parol talab etiladi" }, { status: 400 })
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }, { status: 400 })
        }

        if (typeof token !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 })
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const user = await prisma.user.findUnique({
            where: { resetToken: tokenHash }
        })

        if (!user) {
            return NextResponse.json({ error: "Token yaroqsiz" }, { status: 400 })
        }

        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: "Token muddati tugagan. Qayta so'rov yuboring." }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            }
        })

        // Parol tiklangach eski xato urinishlar akkauntni qulflab turmasligi uchun
        await prisma.loginAttempt.deleteMany({ where: { email: user.email } })

        return NextResponse.json({ message: "Parol muvaffaqiyatli yangilandi" })

    } catch (error) {
        console.error("RESET_PASSWORD_ERROR:", error)
        return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
    }
}