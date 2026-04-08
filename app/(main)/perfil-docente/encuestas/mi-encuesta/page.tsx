'use client'

import React from "react"
import { SelectPeriodo } from "@/components/select-periodo"
import { useDocenteStore } from "@/modules/seguimiento-docente/docentes/docente.store"
import EncuestaService from "@/modules/seguimiento-docente/encuestas/services/encuesta.service"
import { IEncuestaMetricas } from "@/modules/seguimiento-docente/encuestas/interfaces/encuesta-metricas.interface"
import { IEncuestaRespuesta } from "@/modules/seguimiento-docente/encuestas/interfaces/respuestas.interface"
import { RespuestasDataTable } from "@/modules/seguimiento-docente/encuestas/components/respuestas-datatable"
import ProtectedRoute from "@/components/protected-route"
import { FileQuestion } from "lucide-react"
import NavigationBread from "@/components/navigation-bread"

export default function MiEncuestaPage() {
    const { docenteId, isLoaded } = useDocenteStore()
    const [periodo, setPeriodo] = React.useState<string>("")
    const [metricas, setMetricas] = React.useState<IEncuestaMetricas | null>(null)
    const [respuestas, setRespuestas] = React.useState<IEncuestaRespuesta[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (!isLoaded || !docenteId || !periodo) return

        const fetchData = async () => {
            setLoading(true)
            try {
                // Buscar métricas del docente para este periodo
                const allMetricas = await EncuestaService.getItemsByModulo(periodo)
                const docMetricas = allMetricas.find(m => String(m.docenteId) === String(docenteId))
                
                if (docMetricas) {
                    setMetricas(docMetricas)
                    const res = await EncuestaService.getItemsByDocenteAndModulo(String(docenteId), Number(periodo))
                    setRespuestas(res)
                } else {
                    setMetricas(null)
                    setRespuestas([])
                }
            } catch (error) {
                console.error("Error fetching survey data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [docenteId, periodo, isLoaded])

    return (
        <ProtectedRoute>
            <NavigationBread section="Seguimiento Docente" page="Mis Encuestas" href="/perfil-docente/encuestas/mi-encuesta" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Mis Encuestas</h2>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base">
                            Visualiza la valoración de los estudiantes por cada periodo
                        </p>
                    </div>
                    <div className="w-full sm:w-[220px]">
                        <SelectPeriodo
                            value={periodo}
                            onValueChange={setPeriodo}
                            placeholder="Seleccionar periodo"
                            label=""
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : metricas ? (
                    <RespuestasDataTable data={respuestas} metricas={metricas} showBack={false} />
                ) : isLoaded && periodo ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-2xl bg-muted/5 p-12 text-center">
                        <FileQuestion className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No se encontraron encuestas</h3>
                        <p className="text-muted-foreground max-w-md">
                            No hay registros de encuestas para el periodo seleccionado. Si crees que esto es un error, contacta al administrador.
                        </p>
                    </div>
                ) : null}
            </div>
        </ProtectedRoute>
    )
}
