import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const guard = await requireUser(["DIRECTOR"])
        if (guard.error) return guard.error

        const companyId = guard.user.companyId
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