import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "../layout/logo"

interface AuthWrapperProps {
    children: React.ReactNode
    title: string
    error?: string
}

export const AuthWrapper = ({ children, title, error }: AuthWrapperProps) => (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">

            <Logo />

            <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <CardHeader>
                    <CardTitle className="text-xl text-center text-zinc-100 uppercase tracking-widest">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mb-4 py-2">
                            <AlertDescription className="text-xs text-red-400 text-center">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    {children}
                </CardContent>
            </Card>
        </div>
    </div>
)