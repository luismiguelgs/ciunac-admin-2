"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2, GraduationCap, ReceiptText } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import BackButton from "@/components/back.button"
import SaveButton from "@/components/save.button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { obtenerPeriodo } from "@/lib/utils"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type {
    IEscuela,
    IEstado,
    IFacultad,
    IIdioma,
    INivel,
    ITipoSolicitud,
} from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import SolicitudEstudiantesService, {
    type UpsertEstudianteSolicitudPayload,
} from "../shared/solicitud-estudiantes.service"
import type { IEstudianteSolicitud } from "../shared/solicitud.interface"
import {
    findSolicitudEstado,
    isAdministrativeSolicitudType,
    isTipoSolicitudDigital,
} from "../shared/solicitud-workflow"
import SolicitudesService from "../shared/solicitudes.service"
import { EstudianteFields } from "./estudiante-fields"
import { getNuevaSolicitudDefaults, nuevaSolicitudSchema, type NuevaSolicitudFormValues } from "./nueva-solicitud.schema"
import { PagoFields } from "./pago-fields"
import { SolicitudFields } from "./solicitud-fields"

const EMPTY_OPTION = "none"

export function NuevaSolicitudForm() {
    const [studentId, setStudentId] = React.useState<string | null>(null)
    const [searchedDocument, setSearchedDocument] = React.useState("")
    const [searching, setSearching] = React.useState(false)

    const { data: tiposCatalogo, loading: loadingTipos } = useOpciones<ITipoSolicitud>(Collection.Tiposolicitud)
    const { data: estados, loading: loadingEstados } = useOpciones<IEstado>(Collection.Estados)
    const { data: idiomas, loading: loadingIdiomas } = useOpciones<IIdioma>(Collection.Idiomas)
    const { data: niveles, loading: loadingNiveles } = useOpciones<INivel>(Collection.Niveles)
    const { data: facultades, loading: loadingFacultades } = useOpciones<IFacultad>(Collection.Facultades)
    const { data: escuelas, loading: loadingEscuelas } = useOpciones<IEscuela>(Collection.Escuelas)

    const form = useForm<NuevaSolicitudFormValues>({
        resolver: zodResolver(nuevaSolicitudSchema),
        defaultValues: getNuevaSolicitudDefaults(),
    })

    const tipoDocumento = useWatch({ control: form.control, name: "tipoDocumento" })
    const numeroDocumento = useWatch({ control: form.control, name: "numeroDocumento" })
    const facultadId = useWatch({ control: form.control, name: "facultadId" })
    const escuelaId = useWatch({ control: form.control, name: "escuelaId" })
    const tipoSolicitudId = useWatch({ control: form.control, name: "tipoSolicitudId" })

    const tiposSolicitud = React.useMemo(
        () => tiposCatalogo.filter(isAdministrativeSolicitudType),
        [tiposCatalogo]
    )
    const estadoNueva = React.useMemo(() => findSolicitudEstado(estados, "nueva"), [estados])
    const escuelasFiltradas = React.useMemo(() => {
        const selectedFacultadId = Number(facultadId)
        if (!selectedFacultadId) return []
        return escuelas.filter(escuela => escuela.facultadId === selectedFacultadId)
    }, [escuelas, facultadId])

    const loadingCatalogs = loadingTipos || loadingEstados || loadingIdiomas || loadingNiveles || loadingFacultades || loadingEscuelas
    const missingRequiredCatalog = !loadingCatalogs && (
        tiposSolicitud.length === 0 || idiomas.length === 0 || niveles.length === 0 || typeof estadoNueva?.id !== "number"
    )

    React.useEffect(() => {
        if (!searchedDocument) return
        if (`${tipoDocumento}:${numeroDocumento.trim()}` !== searchedDocument) {
            setStudentId(null)
            setSearchedDocument("")
        }
    }, [numeroDocumento, searchedDocument, tipoDocumento])

    React.useEffect(() => {
        if (!escuelaId || escuelaId === EMPTY_OPTION) return
        if (!escuelasFiltradas.some(escuela => String(escuela.id) === escuelaId)) {
            form.setValue("escuelaId", "", { shouldValidate: true })
        }
    }, [escuelaId, escuelasFiltradas, form])

    React.useEffect(() => {
        const selectedTipo = tiposSolicitud.find(tipo => String(tipo.id) === tipoSolicitudId)
        if (selectedTipo) {
            form.setValue("pago", String(Number(selectedTipo.precio) || 0), { shouldValidate: true })
        }
    }, [form, tipoSolicitudId, tiposSolicitud])

    const applyStudent = React.useCallback((student: IEstudianteSolicitud) => {
        form.setValue("nombres", student.nombres || "")
        form.setValue("apellidos", student.apellidos || "")
        form.setValue("celular", student.celular || "")
        form.setValue("facultadId", student.facultadId ? String(student.facultadId) : "")
        form.setValue("escuelaId", student.escuelaId ? String(student.escuelaId) : "")
        form.setValue("codigo", student.codigo || "")
        form.setValue("alumnoCiunac", Boolean(student.facultadId || student.escuelaId || student.codigo))
    }, [form])

    async function handleSearch() {
        const valid = await form.trigger(["tipoDocumento", "numeroDocumento"])
        if (!valid) return

        setSearching(true)
        try {
            const student = await SolicitudEstudiantesService.findByDocument(numeroDocumento.trim())
            setSearchedDocument(`${tipoDocumento}:${numeroDocumento.trim()}`)

            if (student?.id) {
                setStudentId(student.id)
                applyStudent(student)
                toast.success("Estudiante encontrado")
            } else {
                setStudentId(null)
                form.setValue("nombres", "")
                form.setValue("apellidos", "")
                form.setValue("celular", "")
                form.setValue("facultadId", "")
                form.setValue("escuelaId", "")
                form.setValue("codigo", "")
                form.setValue("alumnoCiunac", false)
                toast.info("No se encontro el estudiante. Complete sus datos para registrarlo.")
            }
        } catch (error) {
            console.error(error)
            toast.error("No se pudo buscar al estudiante")
        } finally {
            setSearching(false)
        }
    }

    function buildStudentPayload(values: NuevaSolicitudFormValues): UpsertEstudianteSolicitudPayload {
        const facultad = values.facultadId && values.facultadId !== EMPTY_OPTION ? Number(values.facultadId) : undefined
        const escuela = values.escuelaId && values.escuelaId !== EMPTY_OPTION ? Number(values.escuelaId) : undefined

        return {
            nombres: values.nombres.trim(),
            apellidos: values.apellidos.trim(),
            tipoDocumento: values.tipoDocumento,
            numeroDocumento: values.numeroDocumento.trim(),
            celular: values.celular.trim(),
            ...(facultad ? { facultadId: facultad } : {}),
            ...(escuela ? { escuelaId: escuela } : {}),
            ...(values.codigo ? { codigo: values.codigo.trim() } : {}),
        }
    }

    async function onSubmit(values: NuevaSolicitudFormValues) {
        const selectedTipo = tiposSolicitud.find(tipo => String(tipo.id) === values.tipoSolicitudId)
        if (!selectedTipo?.id || typeof estadoNueva?.id !== "number") {
            toast.error("Faltan catalogos requeridos para registrar la solicitud")
            return
        }

        try {
            const studentPayload = buildStudentPayload(values)
            let currentStudentId = studentId

            if (currentStudentId) {
                await SolicitudEstudiantesService.update(currentStudentId, studentPayload)
            } else {
                const existingStudent = await SolicitudEstudiantesService.findByDocument(values.numeroDocumento.trim())
                if (existingStudent?.id) {
                    currentStudentId = existingStudent.id
                    await SolicitudEstudiantesService.update(currentStudentId, studentPayload)
                } else {
                    const createdStudent = await SolicitudEstudiantesService.create(studentPayload)
                    if (!createdStudent.id) throw new Error("El servicio no devolvio el identificador del estudiante")
                    currentStudentId = createdStudent.id
                }
                setStudentId(currentStudentId)
                setSearchedDocument(`${values.tipoDocumento}:${values.numeroDocumento.trim()}`)
            }

            if (!currentStudentId) throw new Error("No se pudo resolver el estudiante de la solicitud")

            const solicitud = await SolicitudesService.create({
                estudianteId: currentStudentId,
                tipoSolicitudId: selectedTipo.id,
                idiomaId: Number(values.idiomaId),
                nivelId: Number(values.nivelId),
                estadoId: estadoNueva.id,
                periodo: obtenerPeriodo(),
                alumnoCiunac: values.alumnoCiunac,
                fechaPago: values.fechaPago.toISOString().split("T")[0],
                pago: Number(values.pago),
                numeroVoucher: values.numeroVoucher.trim(),
                observaciones: values.observaciones || undefined,
                digital: isTipoSolicitudDigital(selectedTipo),
                manual: true,
            })

            toast.success(`Solicitud #${solicitud.id} registrada correctamente`)
            form.reset(getNuevaSolicitudDefaults())
            setStudentId(null)
            setSearchedDocument("")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo registrar la solicitud. Puede corregir los datos y reintentar.")
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-6xl space-y-5 pb-12">
            <div className="flex items-center justify-between gap-3">
                <BackButton href="/solicitudes/constancias" />
            </div>

            {missingRequiredCatalog ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    No se encontraron todos los tipos, idiomas, niveles o el estado Nueva del catalogo de solicitudes.
                </div>
            ) : null}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="h-5 w-5" />
                        Estudiante
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <EstudianteFields
                        form={form}
                        facultadOptions={[
                            { label: "Sin facultad", value: EMPTY_OPTION },
                            ...facultades.map(item => ({ label: item.nombre, value: String(item.id) })),
                        ]}
                        escuelaOptions={[
                            { label: "Sin escuela", value: EMPTY_OPTION },
                            ...escuelasFiltradas.map(item => ({ label: item.nombre, value: String(item.id) })),
                        ]}
                        loadingCatalogs={loadingFacultades || loadingEscuelas}
                        searching={searching}
                        foundStudent={Boolean(studentId)}
                        onSearch={handleSearch}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FilePlus2 className="h-5 w-5" />
                        Datos de la solicitud
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SolicitudFields
                        form={form}
                        tiposSolicitud={tiposSolicitud}
                        idiomas={idiomas}
                        niveles={niveles}
                        loading={loadingTipos || loadingIdiomas || loadingNiveles}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ReceiptText className="h-5 w-5" />
                        Informacion de pago
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PagoFields form={form} />
                </CardContent>
                <CardFooter className="justify-end border-t pt-5">
                    <SaveButton form={form} disabled={loadingCatalogs || missingRequiredCatalog || searching} />
                </CardFooter>
            </Card>
        </form>
    )
}
