'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Eye, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { DatePicker } from "@/components/forms/date-picker.field"
import SaveButton from "@/components/save.button"
import BackButton from "@/components/back.button"
import { obtenerPeriodo } from "@/lib/utils"
import { IEstado, IIdioma, ISalon } from "@/modules/estructura/interfaces/types.interface"
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"
import { DocenteComboField } from "@/modules/seguimiento-docente/docentes/components/docente-combo.field"
import { IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import { buildCodigoExamen, EXAMEN_ESTADOS } from "../examen-ubicacion.utils"

const formSchema = z.object({
    estadoId: z.string().min(1, "Estado requerido"),
    fecha: z.date(),
    aulaId: z.string().min(1, "Sala requerida"),
    docenteId: z.string().min(1, "Docente requerido"),
    idiomaId: z.string().min(1, "Idioma requerido"),
    codigo: z.string().min(1, "Codigo requerido"),
})

type FormValues = z.infer<typeof formSchema>

interface ExamenFormProps {
    examen?: IExamenUbicacion
    estados: IEstado[]
    idiomas: IIdioma[]
    salones: ISalon[]
    docentes: IDocente[]
    onPreviewActa?: () => void
}

export function ExamenForm({
    examen,
    estados,
    idiomas,
    salones,
    docentes,
    onPreviewActa,
}: ExamenFormProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = React.useState(!examen)
    const isNew = !examen?.id

    const estadosExamen = React.useMemo(() => {
        const filtered = estados.filter((estado) => estado.referencia === "EXAMEN_UBICACION")
        return filtered.length
            ? filtered
            : [
                { id: EXAMEN_ESTADOS.PROGRAMADO, nombre: "Programado", referencia: "EXAMEN_UBICACION" },
                { id: EXAMEN_ESTADOS.ASIGNADO, nombre: "Asignado", referencia: "EXAMEN_UBICACION" },
                { id: EXAMEN_ESTADOS.TERMINADO, nombre: "Terminado", referencia: "EXAMEN_UBICACION" },
            ]
    }, [estados])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            estadoId: String(examen?.estadoId ?? EXAMEN_ESTADOS.PROGRAMADO),
            fecha: examen?.fecha ? new Date(examen.fecha) : new Date(),
            aulaId: examen?.aulaId ? String(examen.aulaId) : "",
            docenteId: examen?.docenteId ?? "",
            idiomaId: examen?.idiomaId ? String(examen.idiomaId) : "",
            codigo: examen?.codigo ?? "",
        },
    })

    const idiomaId = form.watch("idiomaId")
    const aulaId = form.watch("aulaId")

    React.useEffect(() => {
        if (!idiomaId || !aulaId) return
        form.setValue("codigo", buildCodigoExamen(obtenerPeriodo(), idiomaId, aulaId), { shouldValidate: true })
    }, [aulaId, form, idiomaId])

    const onSubmit = async (values: FormValues) => {
        const payload: Partial<IExamenUbicacion> = {
            codigo: values.codigo,
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
                    <SelectField
                        control={form.control}
                        name="estadoId"
                        label="Estado"
                        disabled={!isEditing}
                        options={estadosExamen.map((estado) => ({ label: estado.nombre, value: String(estado.id) }))}
                    />
                    <DatePicker
                        control={form.control}
                        name="fecha"
                        label="Fecha de Examen"
                        disabled={!isEditing}
                        endYear={new Date().getFullYear() + 5}
                    />
                    <SelectField
                        control={form.control}
                        name="aulaId"
                        label="Sala"
                        disabled={!isEditing}
                        options={salones.map((salon) => ({ label: salon.nombre, value: String(salon.id) }))}
                    />
                    <DocenteComboField
                        control={form.control}
                        name="docenteId"
                        docentes={docentes}
                        disabled={!isEditing}
                        currentDocenteId={examen?.docenteId ? String(examen.docenteId) : undefined}
                    />
                    <SelectField
                        control={form.control}
                        name="idiomaId"
                        label="Idioma"
                        disabled={!isNew || !isEditing}
                        options={idiomas.map((idioma) => ({ label: idioma.nombre, value: String(idioma.id) }))}
                    />
                    <InputField
                        control={form.control}
                        name="codigo"
                        label="Codigo"
                        disabled
                    />
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:justify-between">
                <BackButton href="/examen-ubicacion" />
                <div className="flex flex-wrap gap-2">
                    {!isNew && onPreviewActa ? (
                        <Button type="button" variant="outline" onClick={onPreviewActa}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Acta
                        </Button>
                    ) : null}
                    {!isNew && !isEditing ? (
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
                            <SaveButton form={form} formId="examen-ubicacion-form" />
                        </React.Fragment>
                    ) : null}
                </div>
            </CardFooter>
        </Card>
    )
}
