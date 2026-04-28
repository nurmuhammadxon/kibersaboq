import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const [users, courses, certificates] = await Promise.all([
            prisma.user.count({ where: { role: "USER" } }),
            prisma.course.count({ where: { isPublished: true } }),
            prisma.certificate.count(),
        ])

        return NextResponse.json({ users, courses, certificates })
    } catch (error) {
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}