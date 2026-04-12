import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "../layout/logo"
import { Footer } from "../layout/footer"

interface AuthWrapperProps {
    children: React.ReactNode
    title: string
    error?: string
}

export const AuthWrapper = ({ children, title, error }: AuthWrapperProps) => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">

            <div className="flex justify-center">
                <Logo />
            </div>

            <Card className="border-border bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden rounded-xl sm:rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-center text-foreground uppercase tracking-widest font-bold">
                        {title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4 sm:mb-5 py-2 sm:py-3 rounded-lg">
                            <AlertDescription className="text-xs sm:text-sm text-center font-medium">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    {children}
                </CardContent>
            </Card>

            <Footer />
        </div>
    </div>
)