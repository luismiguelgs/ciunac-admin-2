import { Suspense } from "react"
import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ResetPasswordForm } from "@/modules/auth/password-recovery/reset-password.form"

function ResetPasswordFallback() {
    return (
        <Card>
            <CardContent className="space-y-5 pt-1">
                <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-6 w-40" />
                    <Skeleton className="mx-auto h-4 w-64 max-w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </CardContent>
        </Card>
    )
}

export default function RestablecerContrasenaPage() {
    return (
        <AuthPageShell>
            <Suspense fallback={<ResetPasswordFallback />}>
                <ResetPasswordForm />
            </Suspense>
        </AuthPageShell>
    )
}
