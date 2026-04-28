import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

        if ((session.user as any).role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const userSearch = searchParams.get("user") || ""
        const courseSearch = searchParams.get("course") || ""

        const certificates = await prisma.certificate.findMany({
            where: {
                user: {
                    OR: [
                        { firstName: { contains: userSearch, mode: "insensitive" } },
                        { lastName: { contains: userSearch, mode: "insensitive" } },
                    ],
                },
                course: {
                    title: { contains: courseSearch, mode: "insensitive" },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        organizationName: true,
                    },
                },
                course: { select: { id: true, title: true, level: true } },
            },
            orderBy: { issuedAt: "desc" },
        })

        return NextResponse.json(certificates)
    } catch (error) {
        console.error("Admin certificates GET xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}