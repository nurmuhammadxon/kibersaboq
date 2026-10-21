import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // HTTPS (server) da sessiya cookie nomi "__Secure-" bilan boshlanadi.
  // getToken buni o'zi aniqlamaydi, shuning uchun protokolni shu yerda beramiz.
  // (Reverse proxy orqasida protokol x-forwarded-proto sarlavhasida keladi.)
  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "")
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    secureCookie: proto === "https",
  })

  const role = (token as any)?.role

  if (!token &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/forgot-password" &&
    pathname !== "/reset-password" &&
    pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url))
    } else if (role === "DIRECTOR") {
      return NextResponse.redirect(new URL("/director", req.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    if (role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/director")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    if (role !== "DIRECTOR") return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url))
    if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", req.url))
    if (role === "DIRECTOR") return NextResponse.redirect(new URL("/director", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/director/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ]
}