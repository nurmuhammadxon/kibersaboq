import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const role = (token as any)?.role

  if (!token && pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password" && pathname !== "/reset-password") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    if (role === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    } else {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    if (role === "EMPLOYEE") return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    if (role === "SUPER_ADMIN" || role === "ORG_ADMIN") return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register", "/forgot-password", "/reset-password"]
}