"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, CircleCheck, KeyRound, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/services/api.service"
import {
    type ResetPasswordFormValues,
    resetPasswordSchema,
} from "./password-recovery.schema"
import {
    PASSWORD_RESET_INVALID_LINK_MESSAGE,
    PASSWORD_RESET_SUCCESS_MESSAGE,
    resetPassword,
} from "./password-recovery.service"

const RESET_ERROR_MESSAGE =
    "No pudimos actualizar tu contraseña. Verifica tu conexión e inténtalo nuevamente."

function InvalidRecoveryLink() {
    return (
        <Card>
            <CardHeader className="text-center">
                <div className="bg-destructive/10 text-destructive mx-auto flex size-11 items-center justify-center rounded-full">
                    <CircleAlert className="size-6" />
                </div>
                <CardTitle className="text-xl">Enlace no disponible</CardTitle>
                <CardDescription>{PASSWORD_RESET_INVALID_LINK_MESSAGE}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/recuperar-contrasena">Solicitar un nuevo enlace</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")?.trim() ?? ""
    const [invalidToken, setInvalidToken] = useState(false)
    const [passwordUpdated, setPasswordUpdated] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting

    useEffect(() => {
        if (!passwordUpdated) return

        const redirectTimer = window.setTimeout(() => {
            router.replace("/")
        }, 1800)

        return () => window.clearTimeout(redirectTimer)
    }, [passwordUpdated, router])

    async function onSubmit(values: ResetPasswordFormValues) {
        if (!token) {
            setInvalidToken(true)
            return
        }

        setSubmitError(null)

        try {
            await resetPassword(token, values.newPassword, values.confirmPassword)
            window.history.replaceState(window.history.state, "", "/restablecer-contrasena")
            setPasswordUpdated(true)
        } catch (error) {
            if (error instanceof ApiError && error.status === 400) {
                setInvalidToken(true)
                return
            }

            setSubmitError(RESET_ERROR_MESSAGE)
        }
    }

    if (!token || invalidToken) {
        return <InvalidRecoveryLink />
    }

    if (passwordUpdated) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
                        <CircleCheck className="size-6" />
                    </div>
                    <CardTitle className="text-xl">Contraseña actualizada</CardTitle>
                    <CardDescription>{PASSWORD_RESET_SUCCESS_MESSAGE}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center text-sm" aria-live="polite">
                        Redirigiendo al inicio de sesión...
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Nueva contraseña</CardTitle>
                <CardDescription>
                    Ingresa y confirma la contraseña que usarás para acceder
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <FieldGroup>
                        {submitError ? (
                            <Alert variant="destructive">
                                <AlertDescription>{submitError}</AlertDescription>
                            </Alert>
                        ) : null}

                        <Field data-invalid={Boolean(form.formState.errors.newPassword)}>
                            <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
                            <Input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(form.formState.errors.newPassword)}
                                disabled={isSubmitting}
                                {...form.register("newPassword")}
                            />
                            <FieldError errors={[form.formState.errors.newPassword]} />
                        </Field>

                        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
                            <FieldLabel htmlFor="confirm-password">Confirmar contraseña</FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                                disabled={isSubmitting}
                                {...form.register("confirmPassword")}
                            />
                            <FieldError errors={[form.formState.errors.confirmPassword]} />
                        </Field>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <KeyRound />
                                    Actualizar contraseña
                                </>
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
