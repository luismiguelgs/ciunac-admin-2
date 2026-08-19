import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { ForgotPasswordForm } from "@/modules/auth/password-recovery/forgot-password.form"

export default function RecuperarContrasenaPage() {
    return (
        <AuthPageShell>
            <ForgotPasswordForm />
        </AuthPageShell>
    )
}
