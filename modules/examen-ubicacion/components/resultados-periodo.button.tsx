"use client"

import React from "react"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SelectPeriodo } from "@/components/select-periodo"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { IModulo } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import CalificacionesUbicacionService from "../services/calificaciones.service"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"
import { PdfPreviewDialog } from "./pdf-preview-dialog"
import { ResultadoUbicacionGrupo, ResultadosUbicacionFormat } from "./formatos/resultados-ubicacion-format"

interface ResultadosPeriodoButtonProps {
    examenes: IExamenUbicacion[]
}

function normalizePeriod(value?: string | number | null) {
    return String(value ?? "").replace(/\D/g, "").slice(0, 6)
}

function getExamPeriodCode(examen: IExamenUbicacion) {
    const codigo = String(examen.codigo ?? "")
    const match = codigo.match(/^(\d{4})-?(\d{2})/)

    if (match) return `${match[1]}${match[2]}`

    return normalizePeriod(codigo.split("-")[0])
}

function isExamInPeriodo(examen: IExamenUbicacion, periodo?: IModulo) {
    const codigo = String(examen.codigo ?? "")
    const rawCandidates = [periodo?.id, periodo?.nombre].filter(Boolean).map(String)
    const normalizedCandidates = rawCandidates.map(normalizePeriod).filter((value) => value.length === 6)
    const examPeriod = getExamPeriodCode(examen)

    if (examPeriod && normalizedCandidates.includes(examPeriod)) return true

    return rawCandidates.some((candidate) => codigo.startsWith(`${candidate}-`))
}

function buildGroups(examenes: IExamenUbicacion[], detallesByExam: IDetalleExamenUbicacion[][]) {
    const groups = new Map<string, IDetalleExamenUbicacion[]>()

    examenes.forEach((examen, index) => {
        const idioma = String(examen.idioma?.nombre ?? examen.idiomaId ?? "Idioma")
        const detalles = detallesByExam[index] ?? []
        const current = groups.get(idioma) ?? []

        groups.set(idioma, current.concat(detalles))
    })

    return Array.from(groups.entries())
        .map<ResultadoUbicacionGrupo>(([idioma, detalles]) => ({
            idioma,
            detalles: [...detalles].sort((a, b) => {
                const studentA = `${a.estudiante?.apellidos ?? ""} ${a.estudiante?.nombres ?? ""}`.trim()
                const studentB = `${b.estudiante?.apellidos ?? ""} ${b.estudiante?.nombres ?? ""}`.trim()
                return studentA.localeCompare(studentB)
            }),
        }))
        .filter((grupo) => grupo.detalles.length > 0)
}

export function ResultadosPeriodoButton({ examenes }: ResultadosPeriodoButtonProps) {
    const [isSelectorOpen, setIsSelectorOpen] = React.useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
    const [periodoId, setPeriodoId] = React.useState("")
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [groups, setGroups] = React.useState<ResultadoUbicacionGrupo[]>([])
    const [calificaciones, setCalificaciones] = React.useState<ICalificacionUbicacion[]>([])
    const [periodoLabel, setPeriodoLabel] = React.useState("")
    const { data: periodos } = useOpciones<IModulo>(Collection.Modulos)

    const selectedPeriodo = React.useMemo(() => {
        return periodos.find((periodo) => String(periodo.id) === periodoId)
    }, [periodoId, periodos])

    const handleGenerate = async () => {
        if (!selectedPeriodo) {
            toast.warning("Seleccione un periodo primero")
            return
        }

        const examenesPeriodo = examenes.filter((examen) => isExamInPeriodo(examen, selectedPeriodo))

        if (!examenesPeriodo.length) {
            toast.warning("No hay exámenes de ubicación para el periodo seleccionado")
            return
        }

        setIsGenerating(true)
        try {
            const [detallesByExam, calificacionesData] = await Promise.all([
                Promise.all(examenesPeriodo.map((examen) => ExamenesUbicacionService.fetchItemsDetail(examen.id!))),
                CalificacionesUbicacionService.fetchItems(),
            ])
            const grouped = buildGroups(examenesPeriodo, detallesByExam)

            if (!grouped.length) {
                toast.warning("No hay resultados disponibles para el periodo seleccionado")
                return
            }

            setGroups(grouped)
            setCalificaciones(calificacionesData)
            setPeriodoLabel(selectedPeriodo.nombre)
            setIsSelectorOpen(false)
            setIsPreviewOpen(true)
        } catch (error) {
            console.error(error)
            toast.error("No se pudo generar el PDF de resultados")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <React.Fragment>
            <Button type="button" variant="outline" onClick={() => setIsSelectorOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Publicar resultados
            </Button>

            <AlertDialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Resultados por periodo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Seleccione el periodo para generar la vista previa del PDF de resultados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <SelectPeriodo
                        value={periodoId}
                        onValueChange={setPeriodoId}
                        label="Periodo"
                        placeholder="Seleccionar periodo"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isGenerating}>Cancelar</AlertDialogCancel>
                        <Button type="button" onClick={handleGenerate} disabled={isGenerating || !periodoId}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                            Generar PDF
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {groups.length ? (
                <PdfPreviewDialog
                    isOpen={isPreviewOpen}
                    onOpenChange={setIsPreviewOpen}
                    title="Resultados del Examen de Ubicación"
                >
                    <ResultadosUbicacionFormat
                        periodo={periodoLabel}
                        grupos={groups}
                        calificaciones={calificaciones}
                    />
                </PdfPreviewDialog>
            ) : null}
        </React.Fragment>
    )
}
