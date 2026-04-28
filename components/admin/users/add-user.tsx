"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { useAddUser } from "@/hooks/use-add-user"
import { Error } from "@/components/_components/error"

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddUser({ open, onClose, onSuccess }: Props) {
    const { form, setForm, error, saving, handleSave } = useAddUser({ onSuccess, onClose })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Yangi foydalanuvchi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && <Error message={error} />}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-foreground">Ism</Label>
                            <Input
                                placeholder="Ali"
                                value={form.firstName}
                                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-foreground">Familya</Label>
                            <Input
                                placeholder="Valiyev"
                                value={form.lastName}
                                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Tashkilot</Label>
                        <Input
                            placeholder="Tashkilot nomi"
                            value={form.organizationName}
                            onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Email</Label>
                        <Input
                            type="email"
                            placeholder="kibersaboq@example.com"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Parol</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saqlanmoqda..." : "Qo'shish"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}