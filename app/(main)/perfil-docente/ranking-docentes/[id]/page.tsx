'use client'

import React from "react"
import NavigationBread from "@/components/navigation-bread"
import BackButton from "@/components/back.button"
import { SelectPeriodo } from "@/components/select-periodo"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

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

export default function RankingDocentesDetalle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [periodo, setPeriodo] = React.useState<string>("")
    const [perfilDocente, setPerfilDocente] = React.useState<PerfilDocente | null>(null)
    const [resultados, setResultados] = React.useState<IPerfilResultado[] | null>(null)
    const [documentos, setDocumentos] = React.useState<DocumentosPerfil[] | null>(null)
    const [detalleResultado, setDetalleResultado] = React.useState<DetalleResultado | null>(null)
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        if (!id) return
        const getPerfilDocente = async () => {
            setLoading(true)
            try {
                const responseDocente: PerfilDocente = await PerfilDocenteService.getItem(id)
                const responseResultados: IPerfilResultado[] = await PerfilResultadoService.getItemsByDocente(id)
                const documentos: DocumentosPerfil[] = await DocumentosDocenteService.getDocuments(id)
                setResultados(responseResultados)
                setPerfilDocente(responseDocente)
                setDocumentos(documentos)
            } finally {
                setLoading(false)
            }
        }
        getPerfilDocente()
    }, [id])

    React.useEffect(() => {
        const docenteId = perfilDocente?.docente?.id
        if (!periodo || !docenteId) return

        const getResultados = async () => {
            const responseDetalle: DetalleResultado = await PerfilResultadoService.getItemsByDocenteAndModulo(periodo, docenteId)
            setDetalleResultado(responseDetalle)
        }
        getResultados()
    }, [periodo, perfilDocente?.docente?.id])

    if (loading) {
        return (
            <div className="flex bg-background items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium animate-pulse">Cargando perfil docente...</p>
                </div>
            </div>
        )
    }

    const currentResultado = resultados?.find(item => String(item.moduloId) === String(periodo))

    return (
        <React.Fragment>
            <NavigationBread section="Perfil Docente" href="/perfil-docente/ranking-docentes" page="Detalle Perfil Docente" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-0 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Detalle de Evaluación Docente
                        </h2>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base">Visualización de desempeño individual</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-[200px]">
                            <SelectPeriodo
                                value={periodo}
                                onValueChange={setPeriodo}
                                placeholder="Seleccionar periodo"
                                label=""
                            />
                        </div>
                        <BackButton href="/perfil-docente/ranking-docentes" />
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
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{perfilDocente?.docente?.nombres} {perfilDocente?.docente?.apellidos}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-muted-foreground bg-background/50 backdrop-blur-sm">ID: {id}</Badge>
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                                    Idioma: {perfilDocente?.idioma?.nombre}
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
                    {/* 1. Desglose de Pilares Actual */}
                    <DetalleRankingPilares
                        perfilProfesional={{ obtenido: Number(perfilDocente?.puntajeFinal ?? 0), maximo: 100 }}
                        cumplimientoAdmin={{ obtenido: (Number(detalleResultado?.cumplimiento?.[0]?.puntaje ?? 0) + Number(detalleResultado?.cumplimiento?.[1]?.puntaje ?? 0) + Number(detalleResultado?.cumplimiento?.[2]?.puntaje ?? 0)) / 3, maximo: 100 }}
                        gestionAula={{ obtenido: Number(detalleResultado?.cumplimiento?.[3]?.puntaje ?? 0), maximo: 100 }}
                        valoracionEstudiantil={{ obtenido: Number(detalleResultado?.encuestaMetricas?.promedioGeneral ?? 0), maximo: 100 }}
                    />

                    {/* 2. Detalle de Perfil Profesional */}
                    <DetalleRankingPerfil
                        documentos={documentos ?? []}
                        perfilDocente={perfilDocente}
                    />

                    {/* 3. Detalle de Cumplimiento Admin */}
                    <DetalleRankingCumplimiento detalleResultado={detalleResultado} />

                    {/* 4. Tendencia Histórica - Promedio de Valoración por Aula*/}
                    <DetalleRankingGraficos
                        resultados={resultados}
                        detalleResultado={detalleResultado}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}