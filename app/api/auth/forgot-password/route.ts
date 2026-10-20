import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { clientIp, isLimited, recordHit } from "@/lib/rate-limit"

const WINDOW = 60 * 60 * 1000

const OK = { message: "Agar bu email ro'yxatdan o'tgan bo'lsa, havola yuborildi" }

export async function POST(req: Request) {
    try {
        const { email } = await req.json()
        if (typeof email !== "string" || !email) {
            return NextResponse.json({ error: "Email kiritilmagan" }, { status: 400 })
        }

        const ip = clientIp(req)
        const ipKey = `forgot-ip:${ip}`
        const emailKey = `forgot-email:${email.toLowerCase()}`

        if ((await isLimited(ipKey, 10, WINDOW)) || (await isLimited(emailKey, 3, WINDOW))) {
            return NextResponse.json(
                { error: "Juda ko'p urinish. Keyinroq qayta urinib ko'ring." },
                { status: 429 }
            )
        }
        await Promise.all([recordHit(ipKey, ip), recordHit(emailKey, ip)])

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return NextResponse.json(OK)

        const resetToken = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: tokenHash,
                resetTokenExpiry: new Date(Date.now() + 3600000),
            },
        })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

        await transporter.sendMail({
            from: `"KiberSaboq" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Parolni tiklash havolasi",
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">KiberSaboq</h2>
            <p>Salom! Parolingizni yangilash uchun quyidagi tugmani bosing:</p>
            <div style="margin: 20px 0;">
                <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Parolni o'zgartirish
                </a>
            </div>
            <p style="color: #666; font-size: 12px;">Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
        </div>
    `,
        })

        return NextResponse.json(OK)
    } catch (error) {
        console.error("EMAIL_ERROR:", error)
        return NextResponse.json({ error: "Xabar yuborishda xatolik" }, { status: 500 })
    }
}
