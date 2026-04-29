    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"

    interface Props {
        open: boolean
        onClose: () => void
        title: string
        onTitleChange: (v: string) => void
        onSave: () => void
        saving: boolean
        error: string
    }

    export function AddModuleModal({ open, onClose, title, onTitleChange, onSave, saving, error }: Props) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-sm bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Yangi modul</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
                        <div className="space-y-1.5">
                            <Label className="text-foreground">Modul nomi</Label>
                            <Input
                                placeholder="Masalan: Kirish"
                                value={title}
                                onChange={e => onTitleChange(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && onSave()}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                        <Button onClick={onSave} disabled={saving}>
                            {saving ? "Saqlanmoqda..." : "Qo'shish"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }