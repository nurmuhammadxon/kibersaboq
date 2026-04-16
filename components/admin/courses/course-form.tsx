"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface CourseFormData {
    title: string
    description: string
    level: string
    price: string
    duration: string
    thumbnail: string
}

interface Props {
    open: boolean
    onClose: () => void
    onSave: () => void
    form: CourseFormData
    onChange: (form: CourseFormData) => void
    saving: boolean
    error: string
    isEdit: boolean
}

export default function CourseForm({ open, onClose, onSave, form, onChange, saving, error, isEdit }: Props) {
    const set = (key: keyof CourseFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => onChange({ ...form, [key]: e.target.value })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{isEdit ? "Kursni tahrirlash" : "Yangi kurs"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {error && (
                        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <div className="space-y-1.5">
                        <Label className="text-foreground">Kurs nomi *</Label>
                        <Input
                            placeholder="Masalan: Kiberxavfsizlik asoslari"
                            value={form.title}
                            onChange={set("title")}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-foreground">Tavsif</Label>
                        <Textarea
                            placeholder="Kurs haqida qisqacha..."
                            value={form.description}
                            onChange={set("description")}
                            rows={3}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-foreground">Daraja</Label>
                            <Select
                                value={form.level}
                                onValueChange={v => onChange({ ...form, level: v })}
                            >
                                <SelectTrigger className="bg-input border-border text-foreground">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border text-foreground">
                                    <SelectItem value="BEGINNER">Boshlang'ich</SelectItem>
                                    <SelectItem value="INTERMEDIATE">O'rta</SelectItem>
                                    <SelectItem value="ADVANCED">Yuqori</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-foreground">Narx (USD)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={form.price}
                                onChange={set("price")}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-foreground">Davomiyligi (daqiqa)</Label>
                            <Input
                                type="number"
                                placeholder="60"
                                value={form.duration}
                                onChange={set("duration")}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-foreground">Thumbnail URL</Label>
                            <Input
                                placeholder="https://..."
                                value={form.thumbnail}
                                onChange={set("thumbnail")}
                                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Yaratish"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}