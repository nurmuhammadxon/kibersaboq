import { NextResponse } from "next/server"
import { CERT_NUMBER_RE } from "@/lib/certificate-verify"
import { clientIp, isLimited, recordHit } from "@/lib/rate-limit"
import { prisma } from "@/lib/prisma"

// Ochiq (login talab qilmaydi): faqat YAROQLI sertifikat uchun PDF yaratishga
// kerakli ma'lumotni qaytaradi. To'liq ism faqat shu yerda, tugma bosilganda
// beriladi (tekshiruv sahifasining o'zida ism qisqartirilgan holda turadi).
export async function GET(
    req: Request,
    { params }: { params: Promise<{ number: string }> }
) {
    try {
        const { number: raw } = await params
        const number = decodeURIComponent(raw).trim()

        const ip = clientIp(req)
        const key = `verifydl:${ip}`
        if (await isLimited(key, 20, 10 * 60 * 1000)) {
            return NextResponse.json({ error: "Juda ko'p so'rov. Keyinroq urinib ko'ring." }, { status: 429 })
        }
        await recordHit(key, ip)

        if (!CERT_NUMBER_RE.test(number)) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        const cert = await prisma.certificate.findUnique({
            where: { certificateNumber: number },
            select: {
                certificateNumber: true,
                issuedAt: true,
                revokedAt: true,
                course: { select: { title: true } },
                user: { select: { firstName: true, lastName: true } },
            },
        })

        // Bekor qilingan sertifikatni yuklab bo'lmaydi
        if (!cert || cert.revokedAt) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        return NextResponse.json({
            userName: `${cert.user.firstName} ${cert.user.lastName}`,
            courseTitle: cert.course.title,
            issuedAt: cert.issuedAt,
            certificateNumber: cert.certificateNumber,
        })
    } catch (error) {
        console.error("Verify certificate xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
