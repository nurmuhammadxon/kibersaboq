import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const data = await req.json()

        const user = await prisma.user.update({
            where: { id: params.id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                lang: true,
                createdAt: true,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        await prisma.user.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Foydalanuvchi o'chirildi" })
    } catch (error) {
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}