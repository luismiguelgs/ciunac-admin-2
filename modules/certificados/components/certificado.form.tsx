"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLink, FileCheck2, Pencil, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuditSection } from "@/components/audit.section"
import BackButton from "@/components/back.button"
import { DatePicker } from "@/components/forms/date-picker.field"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { SwitchField } from "@/components/forms/switch.field"
import SaveButton from "@/components/save.button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { obtenerPeriodo } from "@/lib/utils"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type ICiclo from "@/modules/estructura/interfaces/ciclo.interface"
import type { IEstado, IIdioma, INivel } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import type { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import { SolicitudPickerSheet } from "@/modules/solicitudes/shared/solicitud-picker.sheet"
import { findSolicitudEstado, normalizeCatalogText } from "@/modules/solicitudes/shared/solicitud-workflow"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import type { ICertificado, ICertificadoNota, CertificadoPayload } from "../certificado.interface"
import { certificadoSchema, getCertificadoDefaults, type CertificadoFormValues } from "../certificado.schema"
import { CertificadosService } from "../certificados.service"
import {
    cleanCertificadoNotas,
    getCertificadoId,
    getCurrentCertificatePeriod,
    isCertificadoDigital,
} from "../certificados.utils"
import { CertificadoNotasTable } from "./certificado-notas.table"
import { CertificadoFirmaButton } from "./certificado-firma.button"
import { CertificadoPdfButton } from "./certificado-pdf.button"
import { CertificadoUploadButton } from "./certificado-upload.button"

interface CertificadoFormProps {
    certificado?: ICertificado
    elaborador?: string
}

export function CertificadoForm({ certificado, elaborador = "" }: CertificadoFormProps) {
    const router = useRouter()
    const certificadoId = getCertificadoId(certificado)
    const signed = Boolean(certificado?.impreso)
    const [editing, setEditing] = React.useState(!certificado)
    const [notas, setNotas] = React.useState<ICertificadoNota[]>(certificado?.notas || [])
    const form = useForm<CertificadoFormValues>({
        resolver: zodResolver(certificadoSchema) as never,
        defaultValues: getCertificadoDefaults(certificado),
    })

    const { data: idiomas, loading: loadingIdiomas } = useOpciones<IIdioma>(Collection.Idiomas)
    const { data: niveles, loading: loadingNiveles } = useOpciones<INivel>(Collection.Niveles)
    const { data: ciclos } = useOpciones<ICiclo>(Collection.Ciclos)
    const { data: estados } = useOpciones<IEstado>(Collection.Estados)
    const estadoProcesada = React.useMemo(
        () => findSolicitudEstado(estados, "observada", "certificados"),
        [estados]
    )

    const idiomaId = form.watch("idiomaId")
    const nivelId = form.watch("nivelId")
    const tipo = form.watch("tipo")
    const curriculaAnterior = form.watch("curriculaAnterior")
    const duplicado = form.watch("duplicado")
    const liveValues = form.watch()

    React.useEffect(() => {
        if (!certificado) return
        if (!form.getValues("idiomaId") && idiomas.length) {
            const idioma = idiomas.find(item => normalizeCatalogText(item.nombre) === normalizeCatalogText(certificado.idioma))
            if (idioma?.id) form.setValue("idiomaId", String(idioma.id))
        }
        if (!form.getValues("nivelId") && niveles.length) {
            const nivel = niveles.find(item => normalizeCatalogText(item.nombre) === normalizeCatalogText(certificado.nivel))
            if (nivel?.id) form.setValue("nivelId", String(nivel.id))
        }
    }, [certificado, form, idiomas, niveles])

    function handleSolicitud(solicitud: ISolicitud) {
        const requestType = normalizeCatalogText(solicitud.tiposSolicitud?.solicitud)
        const requestCycles = ciclos
            .filter(ciclo => ciclo.idiomaId === solicitud.idiomaId && ciclo.nivelId === solicitud.nivelId)
            .toSorted((a, b) => a.numeroCiclo - b.numeroCiclo)

        form.setValue("solicitudId", solicitud.id, { shouldValidate: true })
        form.setValue("estudiante", `${solicitud.estudiante?.apellidos || ""} ${solicitud.estudiante?.nombres || ""}`.trim().toUpperCase(), { shouldValidate: true })
        form.setValue("numeroDocumento", solicitud.estudiante?.numeroDocumento || "", { shouldValidate: true })
        form.setValue("idiomaId", String(solicitud.idiomaId), { shouldValidate: true })
        form.setValue("nivelId", String(solicitud.nivelId), { shouldValidate: true })
        form.setValue("tipo", solicitud.digital ? "VIRTUAL" : "FISICO", { shouldValidate: true })
        form.setValue("duplicado", requestType.includes("COPIA") || requestType.includes("DUPLIC"), { shouldValidate: true })
        form.setValue("cantidadHoras", requestCycles.length * 40, { shouldValidate: true })

        setNotas(requestCycles.map(ciclo => ({
            id: crypto.randomUUID(),
            ciclo: ciclo.nombre,
            periodo: getCurrentCertificatePeriod(),
            modalidad: "C.R.",
            nota: 0,
            isNew: true,
        })))
    }

    function buildPayload(values: CertificadoFormValues): CertificadoPayload {
        const idioma = idiomas.find(item => String(item.id) === values.idiomaId)
        const nivel = niveles.find(item => String(item.id) === values.nivelId)
        if (!idioma?.id || !nivel?.id) throw new Error("Idioma o nivel no disponible")

        return {
            tipo: values.tipo,
            periodo: certificado?.periodo || obtenerPeriodo(),
            estudiante: values.estudiante.trim().toUpperCase(),
            numeroDocumento: values.numeroDocumento.trim(),
            idioma: idioma.nombre,
            idiomaId: idioma.id,
            nivel: nivel.nombre,
            nivelId: nivel.id,
            cantidadHoras: Number(values.cantidadHoras),
            solicitudId: Number(values.solicitudId),
            fechaEmision: values.fechaEmision.toISOString(),
            numeroRegistro: values.numeroRegistro.trim(),
            fechaConcluido: values.fechaConcluido.toISOString(),
            curriculaAnterior: values.curriculaAnterior,
            impreso: Boolean(certificado?.impreso),
            duplicado: values.duplicado,
            certificadoOriginal: values.duplicado ? values.certificadoOriginal.trim() : "",
            url: certificado?.url || null,
            driveId: certificado?.driveId || null,
            aceptado: Boolean(certificado?.aceptado),
            fechaAceptacion: certificado?.fechaAceptacion || null,
            elaboradoPor: certificado?.elaboradoPor || elaborador,
            notas: cleanCertificadoNotas(notas),
        }
    }

    async function uploadDigitalPdf(item: ICertificado) {
        if (!isCertificadoDigital(item.tipo)) throw new Error("Solo los certificados digitales se almacenan en Drive")
        const id = getCertificadoId(item)
        if (!id) throw new Error("El certificado no tiene identificador")
        const { createCertificadoPdfFile } = await import("./certificado-pdf")
        const file = await createCertificadoPdfFile(item)
        await CertificadosService.uploadArchivo(id, file)
    }

    async function onSubmit(values: CertificadoFormValues) {
        let saved: ICertificado | undefined
        let created = false
        try {
            const payload = buildPayload(values)
            if (certificadoId) {
                saved = await CertificadosService.update(certificadoId, payload)
                toast.success("Certificado actualizado")
            } else {
                saved = await CertificadosService.create(payload)
                created = true
                toast.success("Certificado creado")
            }

            const savedId = getCertificadoId(saved)
            if (!savedId) throw new Error("El backend no devolvio el ID del certificado")

            if (created) {
                if (typeof estadoProcesada?.id === "number") {
                    const updated = await SolicitudesService.update(values.solicitudId, { estadoId: estadoProcesada.id })
                    if (!updated) toast.warning("El certificado fue creado, pero no se actualizo el estado de la solicitud")
                } else {
                    toast.warning("El certificado fue creado, pero falta el estado Observada/Procesada")
                }
            }

            if (isCertificadoDigital(saved.tipo)) {
                try {
                    await uploadDigitalPdf(saved)
                    toast.success("PDF digital guardado en Drive")
                } catch (error) {
                    console.error(error)
                    toast.error("Los datos se guardaron, pero no se pudo subir el PDF. Puede reintentar desde el detalle.")
                }
            }

            if (created) {
                router.push(`/certificados/${savedId}`)
            } else {
                setEditing(false)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast.error(saved ? "El certificado se guardo parcialmente" : "No se pudo guardar el certificado")
        }
    }

    const liveCertificate = React.useMemo<ICertificado>(() => {
        const values = liveValues
        const idioma = idiomas.find(item => String(item.id) === values.idiomaId)
        const nivel = niveles.find(item => String(item.id) === values.nivelId)
        return {
            ...certificado,
            id: certificadoId,
            tipo: values.tipo,
            periodo: certificado?.periodo || obtenerPeriodo(),
            estudiante: values.estudiante,
            numeroDocumento: values.numeroDocumento,
            idioma: idioma?.nombre || certificado?.idioma || "",
            idiomaId: idioma?.id,
            nivel: nivel?.nombre || certificado?.nivel || "",
            nivelId: nivel?.id,
            cantidadHoras: Number(values.cantidadHoras || 0),
            solicitudId: Number(values.solicitudId || 0),
            fechaEmision: values.fechaEmision,
            numeroRegistro: values.numeroRegistro,
            fechaConcluido: values.fechaConcluido,
            curriculaAnterior: values.curriculaAnterior,
            duplicado: values.duplicado,
            certificadoOriginal: values.certificadoOriginal,
            impreso: signed,
            aceptado: Boolean(certificado?.aceptado),
            elaboradoPor: certificado?.elaboradoPor || elaborador,
            notas,
        }
    }, [certificado, certificadoId, elaborador, idiomas, liveValues, niveles, notas, signed])

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <BackButton href={signed ? "/certificados/firmados" : "/certificados"} />
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={signed ? "default" : "outline"}>{signed ? "Firmado" : "Pendiente"}</Badge>
                    {certificadoId ? <CertificadoPdfButton certificado={liveCertificate} /> : null}
                    {certificadoId && !signed && isCertificadoDigital(tipo) ? <CertificadoUploadButton certificado={liveCertificate} /> : null}
                    {certificadoId && !signed ? <CertificadoFirmaButton certificado={liveCertificate} /> : null}
                    {!certificado && (
                        <SolicitudPickerSheet
                            endpoint="certificados"
                            onSelect={handleSolicitud}
                            title="Solicitudes de certificado pagadas"
                        />
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileCheck2 className="h-5 w-5" />Datos del certificado</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="certificado-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField control={form.control} name="estudiante" label="Estudiante" disabled={!editing || signed} />
                            <InputField control={form.control} name="solicitudId" label="ID de solicitud" type="number" disabled />
                            <InputField control={form.control} name="numeroDocumento" label="Documento de identidad" disabled={!editing || signed} />
                            <InputField control={form.control} name="numeroRegistro" label="Numero de registro" disabled={!editing || signed} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-4">
                            <SelectField control={form.control} name="idiomaId" label="Idioma" options={idiomas.map(item => ({ label: item.nombre, value: String(item.id) }))} loading={loadingIdiomas} disabled={!editing || signed} />
                            <SelectField control={form.control} name="nivelId" label="Nivel" options={niveles.map(item => ({ label: item.nombre, value: String(item.id) }))} loading={loadingNiveles} disabled={!editing || signed} />
                            <InputField control={form.control} name="cantidadHoras" label="Cantidad de horas" type="number" disabled={!editing || signed} />
                            <SelectField control={form.control} name="tipo" label="Formato" options={[{ label: "Fisico", value: "FISICO" }, { label: "Digital", value: "VIRTUAL" }]} disabled={!editing || signed || Boolean(certificado)} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <DatePicker control={form.control} name="fechaEmision" label="Fecha de Emisión" disabled={!editing || signed} />
                            <DatePicker control={form.control} name="fechaConcluido" label="Fecha de conclusion" disabled={!editing || signed} />
                            <InputField control={form.control} name="certificadoOriginal" label="Certificado original" disabled={!editing || signed || !duplicado} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <SwitchField control={form.control} name="curriculaAnterior" label="Curricula anterior" disabled={!editing || signed} />
                            <SwitchField control={form.control} name="duplicado" label="Duplicado" disabled={!editing || signed} />
                        </div>
                        <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm">
                            <span className="font-medium">Elaborado por:</span> {certificado?.elaboradoPor || elaborador || "No disponible"}
                            {isCertificadoDigital(tipo) && certificado?.url ? (
                                <a href={certificado.url} target="_blank" rel="noreferrer" className="ml-4 inline-flex items-center gap-1 text-primary hover:underline">
                                    Abrir archivo en Drive <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            ) : null}
                        </div>
                        {certificado ? <AuditSection creadoEn={certificado.creadoEn ? new Date(certificado.creadoEn) : undefined} modificadoEn={certificado.modificadoEn ? new Date(certificado.modificadoEn) : undefined} /> : null}
                    </form>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t pt-5">
                    {certificado && !editing && !signed ? <Button type="button" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Editar</Button> : null}
                    {editing && !signed ? (
                        <>
                            {certificado ? <Button type="button" variant="secondary" onClick={() => { form.reset(getCertificadoDefaults(certificado)); setNotas(certificado.notas || []); setEditing(false) }}><X className="h-4 w-4" />Cancelar</Button> : null}
                            <SaveButton form={form} formId="certificado-form" />
                        </>
                    ) : null}
                </CardFooter>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <CertificadoNotasTable
                        notas={notas}
                        onChange={setNotas}
                        ciclos={ciclos}
                        idiomaId={idiomaId}
                        nivelId={nivelId}
                        curriculaAnterior={curriculaAnterior}
                        disabled={!editing || signed}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
