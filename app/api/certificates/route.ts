import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const guard = await requireUser()
        if (guard.error) return guard.error

        const role = guard.user.role
        const sessionUserId = guard.user.id

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