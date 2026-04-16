import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    open: boolean
    onClose: () => void
    questionText: string
    onQuestionChange: (v: string) => void
    options: string[]
    onOptionChange: (index: number, v: string) => void
    correctIndex: number
    onCorrectChange: (index: number) => void
    onSave: () => void
    saving: boolean
    error: string
}

export function AddQuestionModal({
    open, onClose, questionText, onQuestionChange,
    options, onOptionChange, correctIndex, onCorrectChange,
    onSave, saving, error
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Yangi savol</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {error && <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

                    <div className="space-y-1.5">
                        <Label className="text-foreground">Savol</Label>
                        <Input
                            placeholder="Savol matni..."
                            value={questionText}
                            onChange={e => onQuestionChange(e.target.value)}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Variantlar (to'g'risini belgilang)</Label>
                        {options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <button
                                    onClick={() => onCorrectChange(i)}
                                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${correctIndex === i
                                        ? "border-primary bg-primary"
                                        : "border-border"
                                        }`}
                                />
                                <Input
                                    placeholder={`Variant ${i + 1}`}
                                    value={opt}
                                    onChange={e => onOptionChange(i, e.target.value)}
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        ))}
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