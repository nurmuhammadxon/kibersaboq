"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Save, Shield, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { PersonalInfoSection } from "@/components/profile/profile-sections"
import Loading from "@/components/_components/loading"

export default function ProfilePage() {
    const router = useRouter()
    const { state, actions } = useProfile()

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-2xl mx-auto space-y-6">

                <div className="flex items-center gap-4 p-4 bg-card/50 border border-border rounded-2xl backdrop-blur-sm">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
                        {state.session?.user?.name?.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-foreground font-semibold truncate">{state.session?.user?.name}</p>
                        <p className="text-muted-foreground text-xs truncate">{state.session?.user?.email}</p>
                        {state.isAdmin && (
                            <div className="flex items-center gap-1.5 mt-1">
                                <Shield className="w-3 h-3 text-primary" />
                                <span className="text-primary text-[10px] font-bold uppercase">Administrator</span>
                            </div>
                        )}
                    </div>
                </div>

                <Card className="bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <User className="w-4 h-4 text-primary" /> Shaxsiy ma'lumotlar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PersonalInfoSection state={state} actions={actions} />
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2 text-base">
                            <Lock className="w-4 h-4 text-primary" /> Parolni o'zgartirish
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Joriy parol</Label>
                            <Input
                                type="password"
                                value={state.currentPassword}
                                onChange={(e) => actions.setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Yangi parol</Label>
                            <Input
                                type="password"
                                value={state.newPassword}
                                onChange={(e) => actions.setNewPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </CardContent>
                </Card>

                {state.message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {state.message}
                    </div>
                )}
                {state.error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {state.error}
                    </div>
                )}

                <Button
                    onClick={actions.handleUpdate}
                    disabled={state.loading}
                    className="w-full h-11 rounded-xl font-bold transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {state.loading ? (
                        <><Loading /> Saqlanmoqda...</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Saqlash</>
                    )}
                </Button>
            </div>
        </div>
    )
}