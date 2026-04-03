import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry: expiry,
            },
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: `"KiberSaboq" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Parolni tiklash havolasi",
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">KiberSaboq</h2>
            <p>Salom! Parolingizni yangilash uchun quyidagi tugmani bosing:</p>
            <div style="margin: 20px 0;">
                <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Parolni o'zgartirish
                </a>
            </div>
            <p style="color: #666; font-size: 12px;">Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
        </div>
    `,
        });

        return NextResponse.json({ message: "Havola yuborildi" });
    } catch (error) {
        console.error("EMAIL_ERROR:", error);
        return NextResponse.json({ error: "Xabar yuborishda xatolik" }, { status: 500 });
    }
}