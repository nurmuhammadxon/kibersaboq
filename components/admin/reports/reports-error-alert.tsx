import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ReportsErrorAlertProps {
    message: string
    onRetry: () => void
}

export function ReportsErrorAlert({ message, onRetry }: ReportsErrorAlertProps) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Ma'lumot yuklanmadi</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>{message}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/40 shrink-0"
                    onClick={onRetry}
                >
                    Qayta urinish
                </Button>
            </AlertDescription>
        </Alert>
    )
}
