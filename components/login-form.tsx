"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getSession, signIn, signOut } from "next-auth/react"
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
import { useAuthStore } from "@/modules/usuarios/store/auth.store"
import { useDocenteStore } from "@/modules/seguimiento-docente/docentes/docente.store"
import { normalizeRole } from "@/lib/permissions"
import { ROLES } from "@/lib/roles"
import DocentesService from "@/modules/seguimiento-docente/docentes/docente.service"

const loginSchema = z.object({
    email: z.string().email("Correo electronico invalido"),
    password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const setAuthData = useAuthStore((state) => state.setAuthData)
    const clearAuthData = useAuthStore((state) => state.clearAuthData)
    const setDocenteContext = useDocenteStore((state) => state.setDocenteContext)
    const clearDocenteContext = useDocenteStore((state) => state.clearDocenteContext)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)
        clearAuthData()
        clearDocenteContext()

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                toast.error("Credenciales inválidas", {
                    description: "El correo o la contraseña son incorrectos.",
                })
                return
            }

            const session = await getSession()
            const user = (session?.user ?? null) as Record<string, unknown> | null
            const rol = typeof user?.rol === "string" ? user.rol : ""

            if (!user || !rol) {
                await signOut({ redirect: false })
                clearAuthData()
                toast.error("No se pudo validar el rol del usuario")
                return
            }

            const permisos = Array.isArray(user.permisos)
                ? user.permisos.filter((permission): permission is string => typeof permission === "string")
                : []

            setAuthData(user, permisos)

            // Determinar redirección según rol
            const normalizedRole = normalizeRole(rol)
            let redirectPath = "/dashboard"

            if (normalizedRole === ROLES.DOCENTE) {
                redirectPath = "/perfil-docente/mis-resultados"

                // Cargar contexto docente
                const userId = typeof user.id === "string" ? user.id : String(user.id ?? "")
                if (userId) {
                    try {
                        const docente = await DocentesService.getDocenteByUserId(userId)
                        if (docente?.id && docente?.perfil?.id) {
                            setDocenteContext(String(docente.id), String(docente.perfil.id))
                        } else {
                            toast.warning("Perfil docente incompleto", {
                                description: "Tu perfil docente no está completamente configurado. Contacta al administrador.",
                            })
                        }
                    } catch {
                        toast.warning("No se pudo cargar el perfil docente", {
                            description: "Tu perfil docente no está configurado. Contacta al administrador.",
                        })
                    }
                }
            }

            toast.success("Inicio de sesion exitoso")
            router.push(redirectPath)
            router.refresh()
        } catch {
            await signOut({ redirect: false })
            clearAuthData()
            clearDocenteContext()
            toast.error("Ocurrio un error inesperado")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
                    <CardDescription>
                        Ingresa con tu correo y contrasena
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Correo electronico</FieldLabel>
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
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Contrasena</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Olvidaste tu contrasena?
                                    </a>
                                </div>
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
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    ¿No tienes una cuenta? <a href="/resgistro" className="underline">Regístrate</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-xs">
                Al hacer clic en continuar, aceptas nuestros{" "}
                <a href="#" className="underline">Terminos de Servicio</a> y{" "}
                <a href="#" className="underline">Politica de Privacidad</a>.
            </FieldDescription>
        </div>
    )
}
