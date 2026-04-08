'use client'

import React from "react"
import { SelectPeriodo } from "@/components/select-periodo"
import { Badge } from "@/components/ui/badge"
import { User, AlertCircle } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import NavigationBread from "@/components/navigation-bread"

import DetalleRankingGraficos from "@/modules/seguimiento-docente/ranking-docentes/components/detalle-ranking-graficos"
import DetalleRankingCumplimiento from "@/modules/seguimiento-docente/ranking-docentes/components/detalle-ranking-cumplimiento"
import DetalleRankingPerfil from "@/modules/seguimiento-docente/ranking-docentes/components/detalle-ranking-perfil"
import DetalleRankingPilares from "@/modules/seguimiento-docente/ranking-docentes/components/detalle-ranking-pilares"
import PerfilDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/perfil-docente.service"
import { PerfilDocente } from "@/modules/seguimiento-docente/perfil-docente/interfaces/perfil-docente.interface"
import PerfilResultadoService from "@/modules/seguimiento-docente/ranking-docentes/prefil-resultado.service"
import { IPerfilResultado } from "@/modules/seguimiento-docente/ranking-docentes/interfaces/perfil-resultado.interface"
import DocumentosDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/documentos-docente.service"
import DocumentosPerfil from "@/modules/seguimiento-docente/perfil-docente/interfaces/documentos-perfil.interface"
import { DetalleResultado } from "@/modules/seguimiento-docente/ranking-docentes/interfaces/detalle-resultado.interface"
import { useDocenteStore } from "@/modules/seguimiento-docente/docentes/docente.store"

export default function MisResultadosPage() {
    const { docenteId, perfilId, isLoaded } = useDocenteStore()
    
    const [periodo, setPeriodo] = React.useState<string>("")
    const [perfilDocente, setPerfilDocente] = React.useState<PerfilDocente | null>(null)
    const [resultados, setResultados] = React.useState<IPerfilResultado[] | null>(null)
    const [documentos, setDocumentos] = React.useState<DocumentosPerfil[] | null>(null)
    const [detalleResultado, setDetalleResultado] = React.useState<DetalleResultado | null>(null)
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        if (!perfilId || !isLoaded) return
        
        const fetchData = async () => {
            setLoading(true)
            try {
                // El ranking usaba id (perfilId) para estos servicios
                const responseDocente: PerfilDocente = await PerfilDocenteService.getItem(perfilId)
                const responseResultados: IPerfilResultado[] = await PerfilResultadoService.getItemsByDocente(perfilId)
                const docs: DocumentosPerfil[] = await DocumentosDocenteService.getDocuments(perfilId)
                
                setResultados(responseResultados)
                setPerfilDocente(responseDocente)
                setDocumentos(docs)
            } catch (error) {
                console.error("Error loading profile data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [perfilId, docenteId, isLoaded])

    React.useEffect(() => {
        const dId = docenteId || perfilDocente?.docente?.id
        if (!periodo || !dId) return

        const getResultados = async () => {
            try {
                const responseDetalle: DetalleResultado = await PerfilResultadoService.getItemsByDocenteAndModulo(periodo, dId)
                setDetalleResultado(responseDetalle)
            } catch (error) {
                console.error("Error loading module results:", error)
            }
        }
        getResultados()
    }, [periodo, docenteId, perfilDocente?.docente?.id])

    if (!perfilId && isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Perfil no encontrado</h2>
                <p className="text-muted-foreground max-w-md">
                    No hemos podido vincular tu cuenta con un perfil de docente. 
                    Por favor, contacta al administrador para completar tu configuración.
                </p>
            </div>
        )
    }

    if (loading && !perfilDocente) {
        return (
            <div className="flex bg-background items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium animate-pulse">Cargando tus resultados...</p>
                </div>
            </div>
        )
    }

    const currentResultado = resultados?.find(item => String(item.moduloId) === String(periodo))

    return (
        <ProtectedRoute>
            <NavigationBread section="Seguimiento Docente" page="Mis Resultados" href="/perfil-docente/mis-resultados" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Mis Resultados de Evaluación
                        </h2>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base">
                            Sigue tu desempeño y progreso académico
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-[220px]">
                            <SelectPeriodo
                                value={periodo}
                                onValueChange={setPeriodo}
                                placeholder="Seleccionar periodo"
                                label=""
                            />
                        </div>
                    </div>
                </div>

                {/* Perfil Header */}
                <div className="relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-8 rounded-2xl border border-primary/20 shadow-sm transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10 w-full md:w-auto">
                        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-inner shrink-0">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {perfilDocente?.docente?.nombres} {perfilDocente?.docente?.apellidos}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-muted-foreground bg-background/50 backdrop-blur-sm px-3 py-1">
                                    Docente Activo
                                </Badge>
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent px-3 py-1">
                                    Idioma: {perfilDocente?.idioma?.nombre || "No especificado"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-5 bg-background/80 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg min-w-[220px] relative z-10 w-full md:w-auto">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Puntuación General</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black bg-gradient-to-tr from-primary to-primary/60 bg-clip-text text-transparent">
                                {Number(currentResultado?.resultadoFinal ?? 0).toFixed(1)}
                            </span>
                            <span className="text-2xl font-bold text-muted-foreground/50">/ 100</span>
                        </div>
                    </div>
                </div>

                {/* Grid Principal */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    <DetalleRankingPilares
                        perfilProfesional={{ obtenido: Number(perfilDocente?.puntajeFinal ?? 0), maximo: 100 }}
                        cumplimientoAdmin={{ 
                            obtenido: (Number(detalleResultado?.cumplimiento?.[0]?.puntaje ?? 0) + 
                                       Number(detalleResultado?.cumplimiento?.[1]?.puntaje ?? 0) + 
                                       Number(detalleResultado?.cumplimiento?.[2]?.puntaje ?? 0)) / 3, 
                            maximo: 100 
                        }}
                        gestionAula={{ obtenido: Number(detalleResultado?.cumplimiento?.[3]?.puntaje ?? 0), maximo: 100 }}
                        valoracionEstudiantil={{ obtenido: Number(detalleResultado?.encuestaMetricas?.promedioGeneral ?? 0), maximo: 100 }}
                    />

                    <DetalleRankingPerfil
                        documentos={documentos ?? []}
                        perfilDocente={perfilDocente}
                    />

                    <DetalleRankingCumplimiento detalleResultado={detalleResultado} />

                    <DetalleRankingGraficos
                        resultados={resultados}
                        detalleResultado={detalleResultado}
                    />
                </div>
            </div>
        </ProtectedRoute>
    )
}
