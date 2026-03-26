"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import UsuariosService from "@/modules/usuarios/services/usuarios.service"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const registroSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La confirmación debe tener al menos 6 caracteres"),
    tipoDocumento: z.enum(["DNI", "CE"]),
    numeroDocumento: z.string().regex(/^\d+$/, "Solo debe contener números"),
    rol: z.enum(["DOCENTE"]),
}).refine((data) => {
    if (data.tipoDocumento === "DNI") return data.numeroDocumento.length === 8;
    if (data.tipoDocumento === "CE") return data.numeroDocumento.length === 9;
    return false;
}, {
    message: "Longitud inválida (DNI: 8 dígitos, CE: 9 dígitos)",
    path: ["numeroDocumento"],
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

type RegistroFormValues = z.infer<typeof registroSchema>

export function RegistroForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<RegistroFormValues>({
        resolver: zodResolver(registroSchema),
        defaultValues: {
            email: "",
            password: "",
            tipoDocumento: "DNI",
            numeroDocumento: "",
            rol: "DOCENTE"
        },
    })

    const tipoDoc = form.watch("tipoDocumento")

    async function onSubmit(data: RegistroFormValues) {
        setIsLoading(true)

        try {
            await UsuariosService.newItem({
                email: data.email,
                password: data.password,
                numeroDocumento: data.numeroDocumento,
                rol: data.rol,
            })

            toast.success("Registro exitoso", {
                description: "Ahora puedes iniciar sesión con tus credenciales.",
            })

            router.push("/")
        } catch (error: any) {
            console.error("Error en registro:", error)
            toast.error("No se pudo completar el registro", {
                description: error.message || "Ocurrió un error inesperado.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Crear una cuenta</CardTitle>
                    <CardDescription>
                        Ingresa tus datos para registrarte en CIUNAC
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    {...form.register("email")}
                                    disabled={isLoading}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-destructive text-xs mt-1">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Tipo de Documento</FieldLabel>
                                <RadioGroup
                                    defaultValue="DNI"
                                    onValueChange={(val) => form.setValue("tipoDocumento", val as "DNI" | "CE")}
                                    className="flex gap-4 mt-2"
                                    disabled={isLoading}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="DNI" id="dni" />
                                        <Label htmlFor="dni" className="font-normal">DNI</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="CE" id="ce" />
                                        <Label htmlFor="ce" className="font-normal">CE</Label>
                                    </div>
                                </RadioGroup>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="numeroDocumento">
                                    {tipoDoc === "DNI" ? "DNI (8 dígitos)" : "CE (9 dígitos)"}
                                </FieldLabel>
                                <Input
                                    id="numeroDocumento"
                                    type="text"
                                    placeholder={tipoDoc === "DNI" ? "12345678" : "012345678"}
                                    maxLength={tipoDoc === "DNI" ? 8 : 9}
                                    {...form.register("numeroDocumento")}
                                    disabled={isLoading}
                                />
                                {form.formState.errors.numeroDocumento && (
                                    <p className="text-destructive text-xs mt-1">
                                        {form.formState.errors.numeroDocumento.message}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    {...form.register("password")}
                                    disabled={isLoading}
                                />
                                {form.formState.errors.password && (
                                    <p className="text-destructive text-xs mt-1">
                                        {form.formState.errors.password.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword">Confirmar Contraseña</FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...form.register("confirmPassword")}
                                    disabled={isLoading}
                                />
                                {form.formState.errors.confirmPassword && (
                                    <p className="text-destructive text-xs mt-1">
                                        {form.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Registrando..." : "Registrarse"}
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    ¿Ya tienes una cuenta? <a href="/" className="underline">Inicia sesión</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
                DNI o CE es obligatorio para la validación de identidad.
            </FieldDescription>
        </div>
    )
}
