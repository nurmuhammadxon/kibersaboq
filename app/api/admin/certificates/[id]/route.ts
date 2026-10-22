import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { id } = await params
        const body = await req.json().catch(() => ({}))
        const revoke = body?.revoke === true
        const reason =
            typeof body?.reason === "string" && body.reason.trim()
                ? body.reason.trim().slice(0, 200)
                : null

        const exists = await prisma.certificate.findUnique({ where: { id }, select: { id: true } })
        if (!exists) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        const updated = await prisma.certificate.update({
            where: { id },
            data: revoke
                ? { revokedAt: new Date(), revokedReason: reason }
                : { revokedAt: null, revokedReason: null },
            select: { id: true, revokedAt: true, revokedReason: true },
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error("Admin certificate PATCH xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { id } = await params

        const certificate = await prisma.certificate.findUnique({ where: { id } })
        if (!certificate) {
            return NextResponse.json({ error: "Sertifikat topilmadi" }, { status: 404 })
        }

        await prisma.certificate.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Admin certificate DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}
