"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { useAddUser } from "@/hooks/use-add-user"

interface Props {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddUser({ open, onClose, onSuccess }: Props) {
    const { form, setForm, organization, error, saving, handleSave } = useAddUser({ onSuccess, onClose })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Yangi foydalanuvchi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && (
                        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                    )}
                    {organization && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg border border-border">
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-muted-foreground text-xs">Tashkilot:</span>
                            <span className="text-foreground text-xs font-medium">{organization.name}</span>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Ism</Label>
                        <Input
                            placeholder="Ali Valiyev"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Email</Label>
                        <Input
                            type="email"
                            placeholder="ali@example.com"
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