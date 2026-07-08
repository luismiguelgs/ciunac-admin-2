"use client"

import React from "react"
import { FileCheck2, FileText, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { IActaExamenUbicacion } from "../interfaces/acta-examen-ubicacion.interface"
import { IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ActasExamenUbicacionService from "../services/actas-examen-ubicacion.service"
import { getActaExamenId, isEstadoExamen } from "../examen-ubicacion.utils"
import { PdfPreviewDialog } from "./pdf-preview-dialog"
import { ActaNotasFormat } from "./formatos/acta-notas-format"

interface ActaExamenButtonProps {
    examen: IExamenUbicacion
    estados: IEstado[]
    onGenerated?: () => void
}

export function ActaExamenButton({ examen, estados, onGenerated }: ActaExamenButtonProps) {
    const router = useRouter()
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [isLoadingActa, setIsLoadingActa] = React.useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
    const [hasGeneratedLocally, setHasGeneratedLocally] = React.useState(false)
    const [acta, setActa] = React.useState<IActaExamenUbicacion | null>(null)

    const generatedActaId = acta?.id ?? acta?._id ?? getActaExamenId(examen)
    const isTerminado = isEstadoExamen("TERMINADO", examen.estadoId, examen.estado?.nombre, estados)
    const isActaGenerada = hasGeneratedLocally || isEstadoExamen("ACTA_GENERADA", examen.estadoId, examen.estado?.nombre, estados) || Boolean(generatedActaId)

    const handleCreate = async () => {
        if (!examen.id) return

        setIsGenerating(true)
        try {
            const created = await ActasExamenUbicacionService.create(examen.id)
            setActa(created)
            setHasGeneratedLocally(true)
            toast.success("Acta generada correctamente")
            onGenerated?.()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo generar el acta")
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePreview = async () => {
        const actaId = generatedActaId

        if (!actaId) {
            toast.error("No se encontro el identificador del acta")
            return
        }

        setIsLoadingActa(true)
        try {
            const data = await ActasExamenUbicacionService.getById(actaId)
            setActa(data)
            setIsPreviewOpen(true)
        } catch (error) {
            console.error(error)
            toast.error("No se pudo cargar el acta")
        } finally {
            setIsLoadingActa(false)
        }
    }

    if (!isTerminado && !isActaGenerada) return null

    return (
        <React.Fragment>
            {isActaGenerada ? (
                <Button type="button" onClick={handlePreview} disabled={isLoadingActa} className="shadow-sm">
                    {isLoadingActa ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileText className="mr-2 h-4 w-4" />
                    )}
                    Ver acta
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={handleCreate}
                    disabled={isGenerating}
                    className="bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                >
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileCheck2 className="mr-2 h-4 w-4" />
                    )}
                    Generar acta
                </Button>
            )}

            {acta ? (
                <PdfPreviewDialog
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    title="Acta de notas"
                >
                    <ActaNotasFormat acta={acta} />
                </PdfPreviewDialog>
            ) : null}
        </React.Fragment>
    )
}
