import { z } from "zod"

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Ingresa tu correo electrónico")
        .email("Correo electrónico inválido"),
})

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(72, "La contraseña debe tener como máximo 72 caracteres"),
        confirmPassword: z
            .string()
            .min(1, "Confirma tu nueva contraseña")
            .max(72, "La confirmación debe tener como máximo 72 caracteres"),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
