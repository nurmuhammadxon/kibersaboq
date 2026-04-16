import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Loading from "@/components/_components/loading"

interface Props {
    userName: string
    courseTitle: string
    isDeleting: boolean
    onDelete: () => void
}

export function CertificateDeleteDialog({ userName, courseTitle, isDeleting, onDelete }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                >
                    {isDeleting ? <Loading /> : (
                        <Trash2 className="h-4 w-4" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sertifikatni o'chirish</AlertDialogTitle>
                    <AlertDialogDescription>
                        <strong>{userName}</strong> ning <strong>{courseTitle}</strong> kursi
                        sertifikati o'chiriladi. Bu amalni qaytarib bo'lmaydi.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        O'chirish
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}