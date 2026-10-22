import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const users = await prisma.user.findMany({
      where: { role: { in: ["USER", "DIRECTOR"] } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationName: true,
        createdAt: true,
        isBlocked: true,
        // Direktorning korxonasi (ownedCompany) yoki xodim qo'shilgan korxona (company)
        ownedCompany: { select: { code: true } },
        company: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      users.map(({ ownedCompany, company, ...u }) => ({
        ...u,
        companyCode: ownedCompany?.code ?? company?.code ?? null,
      }))
    )
  } catch (error) {
    console.error("Users GET xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}
