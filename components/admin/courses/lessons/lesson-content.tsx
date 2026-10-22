import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, Check } from "lucide-react"
import { RichEditor } from "./rich-editor"
import { getYoutubeEmbedUrl } from "@/lib/youtube"


interface Props {
    type: string
    content: string
    videoUrl: string
    minDuration: number | null
    onContentChange: (v: string) => void
    onVideoUrlChange: (v: string) => void
    onMinDurationChange: (v: number | null) => void
    onSave: () => void
    saving: boolean
    saved: boolean
}

export function LessonContent({
    type, content, videoUrl, minDuration,
    onContentChange, onVideoUrlChange, onMinDurationChange,
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

            <div className="space-y-1.5">
                <Label className="text-foreground">Minimum o'qish vaqti (soniya)</Label>
                <Input
                    type="number"
                    min={0}
                    placeholder="Masalan: 180 (3 daqiqa)"
                    value={minDuration ?? ""}
                    onChange={e => {
                        const v = e.target.value
                        onMinDurationChange(v === "" ? null : Number(v))
                    }}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground w-48"
                />
                <p className="text-xs text-muted-foreground">
                    Bo'sh qoldiring — cheklov yo'q.
                </p>
            </div>

            {type === "VIDEO" && (
                <div className="space-y-1.5">
                    <Label className="text-foreground">Video URL</Label>
                    <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={e => onVideoUrlChange(e.target.value)}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    {videoUrl && getYoutubeEmbedUrl(videoUrl) && (
                        <div className="aspect-video rounded-xl overflow-hidden bg-secondary mt-2">
                            <iframe
                                src={getYoutubeEmbedUrl(videoUrl)}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-1.5">
                <Label className="text-foreground">
                    {type === "VIDEO" ? "Qo'shimcha matn" : "Matn"}
                </Label>
                <RichEditor content={content} onChange={onContentChange} />
            </div>
        </div>
    )
}