import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save, Check } from "lucide-react"

function getYoutubeEmbedUrl(url: string): string {
    const watchMatch = url.match(/[?&]v=([^&]+)/)
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
    if (url.includes("/embed/")) return url
    return url
}

interface Props {
    type: string
    content: string
    videoUrl: string
    fileUrl: string
    minDuration: number | null
    onContentChange: (v: string) => void
    onVideoUrlChange: (v: string) => void
    onFileUrlChange: (v: string) => void
    onMinDurationChange: (v: number | null) => void
    onSave: () => void
    saving: boolean
    saved: boolean
}

export function LessonContent({
    type, content, videoUrl, fileUrl, minDuration,
    onContentChange, onVideoUrlChange, onFileUrlChange, onMinDurationChange,
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

            {/* ─── Minimum vaqt ─────────────────────────────────── */}
            <div className="space-y-1.5">
                <Label className="text-foreground">
                    Minimum o'qish vaqti (daqiqa)
                </Label>
                <Input
                    type="number"
                    min={0}
                    placeholder="Masalan: 5 (5 daqiqa)"
                    value={minDuration ?? ""}
                    onChange={e => {
                        const v = e.target.value
                        onMinDurationChange(v === "" ? null : Number(v))
                    }}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground w-60"
                />
                <p className="text-xs text-muted-foreground">
                    Foydalanuvchi bu vaqt o'tmasdan darsni yakunlay olmaydi. Bo'sh qoldiring — cheklov yo'q.
                </p>
            </div>

            {/* ─── TEXT ─────────────────────────────────────────── */}
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

            {/* ─── VIDEO ────────────────────────────────────────── */}
            {type === "VIDEO" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-foreground">Video URL</Label>
                        <Input
                            placeholder="https://youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={e => onVideoUrlChange(e.target.value)}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    {videoUrl && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-secondary">
                            <iframe
                                src={getYoutubeEmbedUrl(videoUrl)}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

            {/* ─── FILE ─────────────────────────────────────────── */}
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