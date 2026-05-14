'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { validationSchema, initialValues, type ConstanciaFormValues } from "../validation.schema"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { SwitchField } from "@/components/forms/switch.field"
import { X, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IConstancia, IConstanciaDetalle } from "../constancias.interface"
import { ConstanciasService } from "../constancias.service"
import SaveButton from "@/components/save.button"
import { AuditSection } from "@/components/audit.section"
import { DetalleNotasTable } from "./detalle-notas.table"
import { ConstanciaPdfButton } from "./constancia-pdf.button"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { IIdioma, INivel } from "@/modules/estructura/interfaces/types.interface"
import { AsignarSolicitudButton } from "./asignar-solicitud.button"
import { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"

interface ConstanciaFormProps {
    constancia?: IConstancia
}

export default function ConstanciaForm({ constancia }: ConstanciaFormProps) {
    // Cast needed: Zod v4's z.coerce + superRefine produces 'unknown' input types
    // which conflicts with react-hook-form's Resolver type inference
    const form = useForm<ConstanciaFormValues>({
        resolver: zodResolver(validationSchema) as any,
        defaultValues: constancia ? {
            estudiante: constancia.estudiante,
            dni: constancia.dni,
            idioma: constancia.idioma,
            nivel: constancia.nivel,
            tipo: constancia.tipo,
            ciclo: constancia.ciclo,
            modalidad: constancia.modalidad || 'REGULAR',
            impreso: constancia.impreso,
            aceptado: constancia.aceptado,
            id_solicitud: constancia.id_solicitud,
            horario: constancia.horario || '',
            url: constancia.url || '',
        } : initialValues,
    })

    const [isEditing, setIsEditing] = React.useState(!constancia)
    const [detalle, setDetalle] = React.useState<IConstanciaDetalle[]>(constancia?.detalle || [])
    const router = useRouter()

    const { data: idiomas, loading: loadingIdiomas } = useOpciones<IIdioma>(Collection.Idiomas)
    const { data: niveles, loading: loadingNiveles } = useOpciones<INivel>(Collection.Niveles)
    const tipoValue = form.watch('tipo')

    // Efecto para convertir IDs a nombres en caso de que vengan de la BD como números
    React.useEffect(() => {
        if (constancia) {
            const currentNivel = form.getValues('nivel');
            if (currentNivel && !isNaN(Number(currentNivel)) && niveles.length > 0) {
                const found = niveles.find(n => String(n.id) === String(currentNivel));
                if (found) form.setValue('nivel', found.nombre);
            }

            const currentIdioma = form.getValues('idioma');
            if (currentIdioma && !isNaN(Number(currentIdioma)) && idiomas.length > 0) {
                const found = idiomas.find(i => String(i.id) === String(currentIdioma));
                if (found) form.setValue('idioma', found.nombre);
            }
        }
    }, [constancia, niveles, idiomas, form]);

    const handleAsignarSolicitud = (solicitud: ISolicitud) => {
        form.setValue('estudiante', `${solicitud.estudiante?.nombres || ''} ${solicitud.estudiante?.apellidos || ''}`.trim(), { shouldValidate: true })
        form.setValue('dni', solicitud.estudiante?.numeroDocumento || '', { shouldValidate: true })

        const isNota = solicitud.tiposSolicitud?.solicitud?.toLowerCase().includes('nota')
        form.setValue('tipo', isNota ? 'NOTAS' : 'MATRICULA', { shouldValidate: true })

        form.setValue('idioma', solicitud.idioma?.nombre || '', { shouldValidate: true })
        form.setValue('nivel', solicitud.nivel?.nombre || '', { shouldValidate: true })
        form.setValue('id_solicitud', solicitud.id || 0, { shouldValidate: true })
    }

    // Build a "live" constancia object for PDF preview
    const liveConstancia: IConstancia = {
        ...constancia,
        estudiante: form.watch('estudiante') || '',
        dni: form.watch('dni') || '',
        idioma: form.watch('idioma') || '',
        nivel: form.watch('nivel') || '',
        tipo: form.watch('tipo') as IConstancia['tipo'],
        modalidad: (form.watch('modalidad') || 'REGULAR') as IConstancia['modalidad'],
        ciclo: Number(form.watch('ciclo') || 0),
        id_solicitud: Number(form.watch('id_solicitud') || 0),
        horario: form.watch('horario') || '',
        impreso: !!form.watch('impreso'),
        aceptado: !!form.watch('aceptado'),
        url: form.watch('url') || '',
        detalle,
    }

    const onSubmit = async (data: ConstanciaFormValues) => {
        try {
            const idiomaObj = idiomas?.find(i => i.nombre === data.idioma);
            const nivelObj = niveles?.find(n => n.nombre === data.nivel);

            const payload: Partial<IConstancia> = {
                estudiante: data.estudiante,
                dni: data.dni,
                idioma: data.idioma,
                idiomaId: idiomaObj?.id ? Number(idiomaObj.id) : 0,
                nivel: data.nivel,
                nivelId: nivelObj?.id ? Number(nivelObj.id) : 0,
                tipo: data.tipo as IConstancia['tipo'],
                modalidad: (data.modalidad || 'REGULAR') as IConstancia['modalidad'],
                ciclo: Number(data.ciclo),
                id_solicitud: Number(data.id_solicitud),
                horario: data.horario || '',
                url: data.url || 'no-url', // Mongoose no acepta string vacío si es requerido
                impreso: data.impreso,
                aceptado: data.aceptado,
                // Quitar isNew y id (generado localmente) para el backend
                detalle: data.tipo === 'NOTAS' ? detalle.map(({ isNew, id, ...rest }) => rest) : undefined,
            }

            let savedItem: IConstancia
            if (constancia) {
                const id = constancia.id || constancia._id
                if (!id) throw new Error("ID de constancia no encontrado")

                savedItem = await ConstanciasService.updateItem<IConstancia>({ ...payload, id } as IConstancia)
                toast.success("Constancia actualizada", { description: "Los datos se han guardado correctamente." })
            } else {
                savedItem = await ConstanciasService.newItem<IConstancia>(payload as IConstancia)
                toast.success("Constancia creada", { description: "La constancia se ha creado correctamente." })
            }

            // Generación y subida automática del PDF
            try {
                const { pdf } = await import("@react-pdf/renderer")
                const MatriculaFormat = (await import("../formatos/matricula.format")).default
                const NotasFormat = (await import("../formatos/notas.format")).default

                const fecha = new Date().toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })

                const docId = savedItem.id || savedItem._id
                const studentName = savedItem.estudiante || 'estudiante'

                const document = savedItem.tipo === 'MATRICULA' ? (
                    <MatriculaFormat
                        estudiante={savedItem.estudiante || ''}
                        dni={savedItem.dni || ''}
                        curso={savedItem.idioma || ''}
                        nivel={String(savedItem.nivel || '')}
                        ciclo={String(savedItem.ciclo || '')}
                        modalidad={savedItem.modalidad || 'REGULAR'}
                        horario={savedItem.horario || ''}
                        fecha={fecha}
                    />
                ) : (
                    <NotasFormat
                        estudiante={savedItem.estudiante || ''}
                        dni={savedItem.dni || ''}
                        curso={savedItem.idioma || ''}
                        nivel={String(savedItem.nivel || '')}
                        ciclo={String(savedItem.ciclo || '')}
                        fecha={fecha}
                        detalle={detalle} // Usamos el detalle local que está actualizado
                    />
                )

                const blob = await pdf(document).toBlob()
                const file = new File([blob], "constancia.pdf", { type: "application/pdf" })

                // Subir el PDF generado
                const uploadResult = await ConstanciasService.uploadConstancia(file, docId!, studentName, savedItem.driveId)

                // Actualizar la constancia con el nuevo URL
                if (uploadResult.downloadLink) {
                    await ConstanciasService.updateItem<IConstancia>({ 
                        ...payload, 
                        id: docId, 
                        url: uploadResult.downloadLink 
                    } as IConstancia)
                }

                toast.success("PDF generado y subido", { description: "El documento digital se ha vinculado correctamente." })
            } catch (pdfError) {
                console.error("Error al generar/subir PDF:", pdfError)
                toast.error("Error PDF", { description: "Los datos se guardaron, pero hubo un error con el archivo digital." })
            }

            if (!constancia) {
                router.push('/constancias')
            }
            setIsEditing(false)
        } catch (error) {
            console.error(error)
            toast.error("Error", { description: "Ha ocurrido un error al guardar." })
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{constancia ? 'Detalle de Constancia' : 'Nueva Constancia'}</CardTitle>
                            <CardDescription>
                                {constancia
                                    ? 'Información de la constancia. Active la edición para modificar los campos.'
                                    : 'Complete la información para crear una nueva constancia.'}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {!constancia && (
                                <AsignarSolicitudButton onAsignar={handleAsignarSolicitud} />
                            )}
                            {constancia && (
                                <ConstanciaPdfButton constancia={liveConstancia} />
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form id="constancia-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Información del estudiante */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Información del Estudiante
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    control={form.control}
                                    name="estudiante"
                                    label="Nombre del Estudiante"
                                    placeholder="Nombres y apellidos"
                                    disabled={!isEditing}
                                />
                                <InputField
                                    control={form.control}
                                    name="dni"
                                    label="DNI"
                                    placeholder="Número de documento"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {/* Información académica */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Información Académica
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <SelectField
                                    control={form.control}
                                    name="tipo"
                                    label="Tipo de Constancia"
                                    placeholder="Seleccionar tipo"
                                    options={[
                                        { label: 'Matrícula', value: 'MATRICULA' },
                                        { label: 'Notas', value: 'NOTAS' },
                                    ]}
                                    disabled={!isEditing}
                                />
                                <SelectField
                                    control={form.control}
                                    name="idioma"
                                    label="Idioma"
                                    placeholder="Seleccionar idioma"
                                    options={idiomas?.map(i => ({ label: i.nombre, value: i.nombre })) || []}
                                    disabled={!isEditing || loadingIdiomas}
                                />
                                <SelectField
                                    control={form.control}
                                    name="nivel"
                                    label="Nivel"
                                    placeholder="Seleccionar nivel"
                                    options={niveles?.map(n => ({ label: n.nombre, value: n.nombre })) || []}
                                    disabled={!isEditing || loadingNiveles}
                                />
                                <InputField
                                    control={form.control}
                                    name="ciclo"
                                    label="Ciclo"
                                    placeholder="Ej: 1"
                                    type="number"
                                    disabled={!isEditing}
                                />
                                {tipoValue === 'MATRICULA' && (
                                    <>
                                        <SelectField
                                            control={form.control}
                                            name="modalidad"
                                            label="Modalidad"
                                            placeholder="Seleccionar modalidad"
                                            options={[
                                                { label: 'Regular', value: 'REGULAR' },
                                                { label: 'Intensivo', value: 'INTENSIVO' },
                                            ]}
                                            disabled={!isEditing}
                                        />
                                        <InputField
                                            control={form.control}
                                            name="horario"
                                            label="Horario"
                                            placeholder="Ej: Lun-Vie 8:00-10:00"
                                            disabled={!isEditing}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Información de solicitud */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Solicitud y Estado
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    control={form.control}
                                    name="id_solicitud"
                                    label="ID Solicitud"
                                    placeholder="Número de solicitud"
                                    type="number"
                                    disabled={true}
                                />
                                <InputField
                                    control={form.control}
                                    name="url"
                                    label="URL de Constancia"
                                    placeholder="Enlace al documento PDF"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SwitchField
                                    control={form.control}
                                    name="aceptado"
                                    label="Firmada"
                                    description="Indica si la constancia ha sido firmada"
                                    disabled={!isEditing}
                                />
                                <SwitchField
                                    control={form.control}
                                    name="impreso"
                                    label="Entregada"
                                    description="Indica si la constancia ha sido entregada"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        {constancia && (
                            <AuditSection
                                creadoEn={constancia.creado_en ? new Date(constancia.creado_en) : undefined}
                                modificadoEn={constancia.modificado_en ? new Date(constancia.modificado_en) : undefined}
                            />
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {constancia && !isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                    )}
                    {isEditing && (
                        <>
                            {constancia && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        form.reset()
                                        setDetalle(constancia.detalle || [])
                                        setIsEditing(false)
                                    }}
                                    disabled={form.formState.isSubmitting}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                            )}
                            <SaveButton form={form} formId="constancia-form" />
                        </>
                    )}
                </CardFooter>
            </Card>

            {/* Tabla de detalle de notas - solo para constancias de tipo NOTAS */}
            {tipoValue === 'NOTAS' && (
                <DetalleNotasTable
                    detalle={detalle}
                    onChange={setDetalle}
                    disabled={!isEditing}
                />
            )}
        </div>
    )
}
