import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

        const role = (session.user as any).role
        if (role !== "DIRECTOR") return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })

        const companyId = (session.user as any).companyId
        if (!companyId) return NextResponse.json({ error: "Korxona topilmadi" }, { status: 404 })

        const { searchParams } = new URL(req.url)
        const userSearch = (searchParams.get("user") || "").trim()
        const courseSearch = (searchParams.get("course") || "").trim()

        const certificates = await prisma.certificate.findMany({
            where: {
                user: {
                    companyId,
                    role: "USER",
                    ...(userSearch
                        ? {
                            OR: [
                                { firstName: { contains: userSearch, mode: "insensitive" } },
                                { lastName: { contains: userSearch, mode: "insensitive" } },
                                { email: { contains: userSearch, mode: "insensitive" } },
                            ],
                        }
                        : {}),
                },
                ...(courseSearch
                    ? { course: { title: { contains: courseSearch, mode: "insensitive" } } }
                    : {}),
            },
            select: {
                id: true,
                certificateNumber: true,
                issuedAt: true,
                user: {
                    select: { id: true, firstName: true, lastName: true, email: true, field: true },
                },
                course: { select: { id: true, title: true, level: true } },
            },
            orderBy: { issuedAt: "desc" },
        })

        return NextResponse.json(certificates)
    } catch (error) {
        console.error("Director certificates xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}