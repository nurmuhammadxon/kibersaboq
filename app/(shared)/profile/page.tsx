"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, Save, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [changeEmail, setChangeEmail] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const role = (session?.user as any)?.role
    const isAdmin = role === "SUPER_ADMIN"

    useEffect(() => {
        if (session?.user?.name) setName(session.user.name)
        if (session?.user?.email) setEmail(session.user.email)
    }, [session])

    useEffect(() => {
        if (!changeEmail && session?.user?.email) {
            setEmail(session.user.email)
        }
    }, [changeEmail, session])

    const handleUpdateProfile = async () => {
        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email: isAdmin && changeEmail ? email : undefined,
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error)
                return
            }

            await update({ name, email: isAdmin && changeEmail ? email : undefined })
            setMessage("Profil muvaffaqiyatli yangilandi!")
            setCurrentPassword("")
            setNewPassword("")
            setChangeEmail(false)
        } catch {
            setError("Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-6">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Avatar va rol */}
                <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-900/20 flex-shrink-0">
                        {session?.user?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-zinc-100 font-semibold text-base">{session?.user?.name}</p>
                        <p className="text-zinc-500 text-xs">{session?.user?.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Shield className="w-3 h-3 text-blue-500" />
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                                {isAdmin ? "Administrator" : "Xodim"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shaxsiy ma'lumotlar */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-zinc-100 flex items-center gap-2 text-base">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-500" />
                            </div>
                            Shaxsiy ma'lumotlar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-zinc-400 text-sm mb-1.5 block">
                                Ism familiya
                            </Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ism familiyangiz"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <Label className="text-zinc-400 text-sm">Email</Label>
                                {isAdmin && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="changeEmail"
                                            checked={changeEmail}
                                            onCheckedChange={(val) => setChangeEmail(val as boolean)}
                                            className="border-zinc-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <label
                                            htmlFor="changeEmail"
                                            className="text-zinc-500 text-xs cursor-pointer hover:text-zinc-300 transition-colors"
                                        >
                                            O'zgartirish
                                        </label>
                                    </div>
                                )}
                            </div>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isAdmin || !changeEmail}
                                placeholder="email@korxona.uz"
                                className={`transition-all ${isAdmin && changeEmail
                                    ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                                    : "bg-zinc-800! border-zinc-700/50 text-zinc-300 cursor-not-allowed"
                                    }`}
                            />
                        </div>

                        <div>
                            <Label className="text-zinc-400 text-sm mb-1.5 block">Rol</Label>
                            <Input
                                value={isAdmin ? "Administrator" : "Xodim"}
                                disabled
                                className="bg-zinc-800! border-zinc-700/50 text-zinc-300 cursor-not-allowed"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Parol */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-zinc-100 flex items-center gap-2 text-base">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Lock className="w-4 h-4 text-blue-500" />
                            </div>
                            Parolni o'zgartirish
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-zinc-400 text-sm mb-1.5 block">Joriy parol</Label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                            />
                        </div>
                        <div>
                            <Label className="text-zinc-400 text-sm mb-1.5 block">Yangi parol</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                            />
                        </div>
                        <p className="text-zinc-600 text-xs">Parolni o'zgartirmasangiz bo'sh qoldiring</p>
                    </CardContent>
                </Card>

                {/* Xabarlar */}
                {message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl p-3.5 flex items-center gap-2">
                        <span>✓</span> {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-3.5 flex items-center gap-2">
                        <span>✕</span> {error}
                    </div>
                )}

                <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-medium"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
            </div>
        </div>
    )
}