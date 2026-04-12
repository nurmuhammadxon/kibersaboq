import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import type { User } from "@/hooks/use-users"

interface UserForm {
    name: string
    email: string
    password: string
    organizationName: string
}

interface Props {
    open: boolean
    onClose: () => void
    editUser: User | null
    form: UserForm
    onChange: (fn: (f: UserForm) => UserForm) => void
    onSave: () => void
    saving: boolean
    error: string
}

export function UserModal({ open, onClose, editUser, form, onChange, onSave, saving, error }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {editUser ? "Tahrirlash" : "Yangi foydalanuvchi"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && (
                        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                    )}
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Ism</Label>
                        <Input
                            placeholder="Ali Valiyev"
                            value={form.name}
                            onChange={e => onChange(f => ({ ...f, name: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Email</Label>
                        <Input
                            type="email"
                            placeholder="ali@example.com"
                            value={form.email}
                            onChange={e => onChange(f => ({ ...f, email: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">{editUser ? "Yangi parol (ixtiyoriy)" : "Parol"}</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => onChange(f => ({ ...f, password: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Tashkilot</Label>
                        <Input
                            placeholder="Tashkilot nomi"
                            value={form.organizationName}
                            onChange={e => onChange(f => ({ ...f, organizationName: e.target.value }))}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? "Saqlanmoqda..." : editUser ? "Saqlash" : "Qo'shish"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}