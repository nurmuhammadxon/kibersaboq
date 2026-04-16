import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save, Check } from "lucide-react"

interface Props {
    type: string
    content: string
    videoUrl: string
    fileUrl: string
    onContentChange: (v: string) => void
    onVideoUrlChange: (v: string) => void
    onFileUrlChange: (v: string) => void
    onSave: () => void
    saving: boolean
    saved: boolean
}

export function LessonContent({
    type, content, videoUrl, fileUrl,
    onContentChange, onVideoUrlChange, onFileUrlChange,
    onSave, saving, saved
}: Props) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-foreground font-medium text-sm">Kontent</h3>
                <Button size="sm" onClick={onSave} disabled={saving} className="gap-2">
                    {saved
                        ? <><Check className="w-3.5 h-3.5" /> Saqlandi</>
                        : <><Save className="w-3.5 h-3.5" /> {saving ? "Saqlanmoqda..." : "Saqlash"}</>
                    }
                </Button>
            </div>

            {/* Text */}
            {type === "TEXT" && (
                <div className="space-y-1.5">
                    <Label className="text-foreground">Matn</Label>
                    <Textarea
                        placeholder="Dars matni..."
                        value={content}
                        onChange={e => onContentChange(e.target.value)}
                        rows={12}
                        className="font-mono text-sm resize-none bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            )}

            {/* Video */}
            {type === "VIDEO" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Video URL</Label>
                        <Input
                            placeholder="https://youtube.com/..."
                            value={videoUrl}
                            onChange={e => onVideoUrlChange(e.target.value)}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    {videoUrl && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                            <iframe
                                src={videoUrl.replace("watch?v=", "embed/")}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Qo'shimcha matn</Label>
                        <Textarea
                            placeholder="Video haqida qo'shimcha ma'lumot..."
                            value={content}
                            onChange={e => onContentChange(e.target.value)}
                            rows={4}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
            )}

            {/* File */}
            {type === "FILE" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Fayl URL</Label>
                        <Input
                            placeholder="https://..."
                            value={fileUrl}
                            onChange={e => onFileUrlChange(e.target.value)}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Tavsif</Label>
                        <Textarea
                            placeholder="Fayl haqida qisqacha..."
                            value={content}
                            onChange={e => onContentChange(e.target.value)}
                            rows={4}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}