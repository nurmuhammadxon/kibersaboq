import { FileText, Video } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LESSON_TYPES = [
    { value: "TEXT", label: "Matn", icon: <FileText className="w-4 h-4" /> },
    { value: "VIDEO", label: "Video", icon: <Video className="w-4 h-4" /> },
]

interface Props {
    open: boolean
    onClose: () => void
    title: string
    onTitleChange: (v: string) => void
    type: string
    onTypeChange: (v: string) => void
    onSave: () => void
    saving: boolean
    error: string
}

export function AddLessonModal({ open, onClose, title, onTitleChange, type, onTypeChange, onSave, saving, error }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Yangi dars</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Dars nomi</Label>
                        <Input
                            placeholder="Masalan: Kirish darsi"
                            value={title}
                            onChange={e => onTitleChange(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && onSave()}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Tur</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {LESSON_TYPES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => onTypeChange(t.value)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors ${type === t.value
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border text-muted-foreground hover:border-muted hover:text-foreground"
                                        }`}
                                >
                                    {t.icon}
                                    {t.label}
                                </button>
                            ))}
                        </div>
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