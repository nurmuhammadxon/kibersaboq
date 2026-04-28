import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })

        const role = (session.user as any).role as string
        const sessionUserId = (session.user as any).id as string

        const { searchParams } = new URL(req.url)
        const userSearch = searchParams.get("user") || ""
        const courseSearch = searchParams.get("course") || ""

        if (role !== "SUPER_ADMIN") {
            const certificates = await prisma.certificate.findMany({
                where: {
                    userId: sessionUserId,
                    course: {
                        title: { contains: courseSearch, mode: "insensitive" },
                    },
                },
                include: {
                    course: { select: { id: true, title: true, level: true } },
                    user: { select: { firstName: true, lastName: true } },
                },
                orderBy: { issuedAt: "desc" },
            })
            return NextResponse.json(certificates)
        }

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