import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export const PersonalInfoSection = ({ state, actions }: any) => (
    <div className="space-y-4">
        <div>
            <Label className="text-muted-foreground text-sm mb-2 block">Ism familiya</Label>
            <Input
                value={state.name}
                onChange={(e) => actions.setName(e.target.value)}
            />
        </div>
        <div>
            <div className="flex items-center justify-between mb-2">
                <Label className="text-muted-foreground text-sm">Email</Label>
                {state.isAdmin && (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="changeEmail"
                            checked={state.changeEmail}
                            onCheckedChange={(val) => actions.setChangeEmail(val)}
                        />
                        <label htmlFor="changeEmail" className="text-muted-foreground text-xs cursor-pointer">O'zgartirish</label>
                    </div>
                )}
            </div>
            <Input
                value={state.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                disabled={!state.isAdmin || !state.changeEmail}
                className={(!state.isAdmin || !state.changeEmail) ? "opacity-50 cursor-not-allowed" : ""}
            />
        </div>
    </div>
)