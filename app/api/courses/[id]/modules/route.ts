import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

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