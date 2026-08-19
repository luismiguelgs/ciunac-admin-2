import { apiFetch } from "@/services/api.service"
import type {
    ForgotPasswordPayload,
    PasswordRecoveryResponse,
    ResetPasswordPayload,
} from "./password-recovery.types"

export const PASSWORD_RESET_REQUEST_MESSAGE =
    "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."

export const PASSWORD_RESET_INVALID_LINK_MESSAGE =
    "El enlace de recuperación no es válido o ha expirado"

export const PASSWORD_RESET_SUCCESS_MESSAGE =
    "Contraseña actualizada correctamente."

export async function forgotPassword(email: string): Promise<PasswordRecoveryResponse> {
    const payload: ForgotPasswordPayload = { email }

    return apiFetch<PasswordRecoveryResponse>(
        "auth/forgot-password",
        "POST",
        payload,
        { skipAuth: true },
    )
}

export async function resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
): Promise<PasswordRecoveryResponse> {
    const payload: ResetPasswordPayload = {
        token,
        newPassword,
        confirmPassword,
    }

    return apiFetch<PasswordRecoveryResponse>(
        "auth/reset-password",
        "POST",
        payload,
        { skipAuth: true },
    )
}
