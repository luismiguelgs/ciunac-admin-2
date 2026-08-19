"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, CircleCheck, LoaderCircle, Mail } from "lucide-react"
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
import {
    type ForgotPasswordFormValues,
    forgotPasswordSchema,
} from "./password-recovery.schema"
import {
    forgotPassword,
    PASSWORD_RESET_REQUEST_MESSAGE,
} from "./password-recovery.service"

const REQUEST_ERROR_MESSAGE =
    "No pudimos enviar la solicitud. Verifica tu conexión e inténtalo nuevamente."

export function ForgotPasswordForm() {
    const [requestCompleted, setRequestCompleted] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(values: ForgotPasswordFormValues) {
        setSubmitError(null)

        try {
            await forgotPassword(values.email)
            setRequestCompleted(true)
        } catch {
            setSubmitError(REQUEST_ERROR_MESSAGE)
        }
    }

    if (requestCompleted) {
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="bg-primary/10 text-primary mx-auto flex size-11 items-center justify-center rounded-full">
                        <CircleCheck className="size-6" />
                    </div>
                    <CardTitle className="text-xl">Revisa tu correo</CardTitle>
                    <CardDescription>{PASSWORD_RESET_REQUEST_MESSAGE}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/">
                            <ArrowLeft />
                            Volver al inicio de sesión
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
                <CardDescription>
                    Ingresa tu correo y te enviaremos un enlace de recuperación
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

                        <Field data-invalid={Boolean(form.formState.errors.email)}>
                            <FieldLabel htmlFor="recovery-email">Correo electrónico</FieldLabel>
                            <Input
                                id="recovery-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="correo@ejemplo.com"
                                aria-invalid={Boolean(form.formState.errors.email)}
                                disabled={isSubmitting}
                                {...form.register("email")}
                            />
                            <FieldError errors={[form.formState.errors.email]} />
                        </Field>

                        <Field>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Mail />
                                        Enviar enlace
                                    </>
                                )}
                            </Button>
                            <Button asChild variant="link" className="w-full">
                                <Link href="/">
                                    <ArrowLeft />
                                    Volver al inicio de sesión
                                </Link>
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
