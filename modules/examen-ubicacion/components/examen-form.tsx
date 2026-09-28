'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { CircleAlert, Eye, Pencil, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SelectField } from "@/components/forms/select.field"
import { DatePicker } from "@/components/forms/date-picker.field"
import SaveButton from "@/components/save.button"
import BackButton from "@/components/back.button"
import { IEstado, IIdioma, IModulo, ISalon } from "@/modules/estructura/interfaces/types.interface"
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"
import { DocenteComboField } from "@/modules/seguimiento-docente/docentes/components/docente-combo.field"
import { IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import { buildCodigoExamen, findEstadoExamenByKey, getEstadosExamen } from "../examen-ubicacion.utils"

const formSchema = z.object({
    estadoId: z.string().min(1, "Estado requerido"),
    fecha: z.date(),
    aulaId: z.string().min(1, "Sala requerida"),
    docenteId: z.string().min(1, "Docente requerido"),
    idiomaId: z.string().min(1, "Idioma requerido"),
})

type FormValues = z.infer<typeof formSchema>

interface ExamenFormProps {
    examen?: IExamenUbicacion
    estados: IEstado[]
    idiomas: IIdioma[]
    salones: ISalon[]
    docentes: IDocente[]
    modulos?: IModulo[]
    immutable?: boolean
    onPreviewListado?: () => void
    listadoActions?: React.ReactNode
}

export function ExamenForm({
    examen,
    estados,
    idiomas,
    salones,
    docentes,
    modulos = [],
    immutable = false,
    onPreviewListado,
    listadoActions,
}: ExamenFormProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = React.useState(!examen)
    const isNew = !examen?.id
    const modulosActivos = React.useMemo(() => modulos.filter((modulo) => modulo.activo), [modulos])
    const moduloActivo = modulosActivos.length === 1 && modulosActivos[0].nombre.trim()
        ? modulosActivos[0]
        : undefined
    const moduloConfigurationError = React.useMemo(() => {
        if (!isNew) return null
        if (!modulosActivos.length) return "No existe un módulo académico activo. Revise la configuración de periodos."
        if (modulosActivos.length > 1) return "Existe más de un módulo académico activo. Debe mantenerse solo uno."
        if (!modulosActivos[0].nombre.trim()) return "El módulo académico activo no tiene un nombre válido."
        return null
    }, [isNew, modulosActivos])

    const estadosExamen = React.useMemo(() => {
        const filtered = getEstadosExamen(estados)
        const currentEstadoId = examen?.estadoId
        const currentEstado = examen?.estado

        if (
            currentEstadoId &&
            currentEstado?.nombre &&
            currentEstado?.referencia === "EXAMEN_UBICACION" &&
            !filtered.some((estado) => estado.id === currentEstadoId)
        ) {
            return [...filtered, currentEstado]
        }

        return filtered
    }, [estados, examen?.estado, examen?.estadoId])

    const estadoInicialId = examen?.estadoId ?? findEstadoExamenByKey(estados, "NUEVO")?.id ?? ""

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            estadoId: estadoInicialId ? String(estadoInicialId) : "",
            fecha: examen?.fecha ? new Date(examen.fecha) : new Date(),
            aulaId: examen?.aulaId ? String(examen.aulaId) : "",
            docenteId: examen?.docenteId ?? "",
            idiomaId: examen?.idiomaId ? String(examen.idiomaId) : "",
        },
    })

    const idiomaId = useWatch({ control: form.control, name: "idiomaId" })
    const aulaId = useWatch({ control: form.control, name: "aulaId" })
    const moduloNombre = moduloActivo?.nombre.trim() ?? ""
    const codigoExamen = isNew
        ? moduloNombre && idiomaId && aulaId
            ? buildCodigoExamen(moduloNombre, idiomaId, aulaId)
            : ""
        : examen?.codigo ?? ""

    React.useEffect(() => {
        if (immutable && isEditing) {
            form.reset()
            setIsEditing(false)
        }
    }, [form, immutable, isEditing])

    const onSubmit = async (values: FormValues) => {
        if (immutable) return
        if (isNew && !moduloNombre) {
            toast.error(moduloConfigurationError ?? "No se pudo determinar el módulo académico activo")
            return
        }

        const payload: Partial<IExamenUbicacion> = {
            codigo: isNew
                ? buildCodigoExamen(moduloNombre, values.idiomaId, values.aulaId)
                : examen?.codigo ?? "",
            fecha: values.fecha.toISOString().split("T")[0],
            estadoId: Number(values.estadoId),
            aulaId: Number(values.aulaId),
            docenteId: values.docenteId,
            idiomaId: Number(values.idiomaId),
        }

        try {
            if (examen?.id) {
                await ExamenesUbicacionService.update(examen.id, payload)
                toast.success("Examen actualizado correctamente")
                setIsEditing(false)
                router.refresh()
            } else {
                const created = await ExamenesUbicacionService.create(payload)
                toast.success("Examen creado correctamente")
                router.push(`/examen-ubicacion/${created.id}`)
            }
        } catch (error) {
            console.error(error)
            toast.error("No se pudo guardar el examen")
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isNew ? "Nuevo Examen de Ubicacion" : `Examen ${examen.codigo}`}</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="examen-ubicacion-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {moduloConfigurationError ? (
                        <Alert variant="destructive" className="md:col-span-3">
                            <CircleAlert />
                            <AlertTitle>Configuración de periodo requerida</AlertTitle>
                            <AlertDescription>{moduloConfigurationError}</AlertDescription>
                        </Alert>
                    ) : null}
                    <SelectField
                        control={form.control}
                        name="estadoId"
                        label="Estado"
                        disabled={!isEditing || immutable}
                        options={estadosExamen.map((estado) => ({ label: estado.nombre, value: String(estado.id) }))}
                    />
                    <DatePicker
                        control={form.control}
                        name="fecha"
                        label="Fecha de Examen"
                        disabled={!isEditing || immutable}
                        endYear={new Date().getFullYear() + 5}
                    />
                    <SelectField
                        control={form.control}
                        name="aulaId"
                        label="Sala"
                        disabled={!isEditing || immutable}
                        options={salones.map((salon) => ({ label: salon.nombre, value: String(salon.id) }))}
                    />
                    <DocenteComboField
                        control={form.control}
                        name="docenteId"
                        docentes={docentes}
                        disabled={!isEditing || immutable}
                        currentDocenteId={examen?.docenteId ? String(examen.docenteId) : undefined}
                    />
                    <SelectField
                        control={form.control}
                        name="idiomaId"
                        label="Idioma"
                        disabled={!isNew || !isEditing || immutable}
                        options={idiomas.map((idioma) => ({ label: idioma.nombre, value: String(idioma.id) }))}
                    />
                    {isNew ? (
                        <Field>
                            <FieldLabel htmlFor="examen-modulo-academico">Periodo académico</FieldLabel>
                            <FieldContent>
                                <Input id="examen-modulo-academico" value={moduloNombre} disabled />
                            </FieldContent>
                        </Field>
                    ) : null}
                    <Field>
                        <FieldLabel htmlFor="examen-codigo">Código</FieldLabel>
                        <FieldContent>
                            <Input id="examen-codigo" value={codigoExamen} disabled />
                        </FieldContent>
                    </Field>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:justify-between">
                <BackButton href="/examen-ubicacion" />
                <div className="flex flex-wrap gap-2">
                    {!isNew && onPreviewListado ? (
                        <Button type="button" variant="outline" onClick={onPreviewListado} disabled={immutable}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver listado
                        </Button>
                    ) : null}
                    {!isNew ? listadoActions : null}
                    {!isNew && !isEditing && !immutable ? (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    ) : null}
                    {isEditing ? (
                        <React.Fragment>
                            {!isNew ? (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        form.reset()
                                        setIsEditing(false)
                                    }}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                            ) : null}
                            <SaveButton
                                form={form}
                                formId="examen-ubicacion-form"
                                disabled={isNew && Boolean(moduloConfigurationError)}
                            />
                        </React.Fragment>
                    ) : null}
                </div>
            </CardFooter>
        </Card>
    )
}
