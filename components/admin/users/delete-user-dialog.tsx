import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export function DeleteUserDialog({ open, onClose, onConfirm }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">O'chirishni tasdiqlang</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                        Bu foydalanuvchi butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-secondary text-secondary-foreground border-border hover:bg-secondary/80">
                        Bekor qilish
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onConfirm}
                    >
                        O'chirish
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}