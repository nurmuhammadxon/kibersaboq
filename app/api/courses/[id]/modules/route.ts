import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { id } = await params
        const { title, order } = await req.json()

        if (!title) {
            return NextResponse.json({ error: "Modul nomi kiritilishi shart" }, { status: 400 })
        }

        const module = await prisma.module.create({
            data: { title, order, courseId: id }
        })

        return NextResponse.json(module, { status: 201 })
    } catch (error) {
        console.error("Module POST xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}