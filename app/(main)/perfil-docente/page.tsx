import React from "react"
import NavigationBread from "@/components/navigation-bread"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import IndicadoresGlobales from "@/modules/seguimiento-docente/dashboard/indicadores-globales"
import DesglosePorPilares from "@/modules/seguimiento-docente/dashboard/desglose-pilares"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard-docentes`

async function getIndicadoresGlobales() {
    const response = await fetch(`${URL}/metricas-globales`)
    return response.json()
}

async function getDesempeñoGeneral() {
    const response = await fetch(`${URL}/desempeno-general`)
    return response.json()
}

async function getRankingDocentes() {
    const response = await fetch(`${URL}/ranking-docentes`)
    return response.json()
}

async function getPerfilProfesional() {
    const response = await fetch(`${URL}/perfil-profesional`)
    return response.json()
}

async function getCumplimiento() {
    const response = await fetch(`${URL}/cumplimiento`)
    return response.json()
}

async function getGestionMetodologica() {
    const response = await fetch(`${URL}/gestion-metodologica`)
    return response.json()
}

async function getValoracionEstudiantil() {
    const response = await fetch(`${URL}/valoracion-estudiantil`)
    return response.json()
}

export default async function PerfilDocente() {
    const indicadoresGlobales = await getIndicadoresGlobales()
    const desempeñoGeneral = await getDesempeñoGeneral()
    const rankingDocentes = await getRankingDocentes()
    const perfilProfesional = await getPerfilProfesional()
    const cumplimiento = await getCumplimiento()
    const gestionMetodologica = await getGestionMetodologica()
    const valoracionEstudiantil = await getValoracionEstudiantil()

    return (
        <React.Fragment>
            <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Análisis de Desempeño Docente</h2>
                        <p className="text-muted-foreground font-medium">Panel de gestión estratégica y cumplimiento</p>
                    </div>
                </div>

                <Tabs defaultValue="global" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="global" className="px-6">Indicadores Globales</TabsTrigger>
                        <TabsTrigger value="pilares" className="px-6">Desglose por Pilares</TabsTrigger>
                    </TabsList>

                    <TabsContent value="global" className="space-y-6">
                        <IndicadoresGlobales
                            indicadoresGlobales={indicadoresGlobales}
                            desempeñoGeneral={desempeñoGeneral}
                            rankingDocentes={rankingDocentes}
                        />
                    </TabsContent>

                    <TabsContent value="pilares" className="space-y-6">
                        <DesglosePorPilares
                            perfilProfesional={perfilProfesional}
                            cumplimiento={cumplimiento}
                            gestionMetodologica={gestionMetodologica}
                            valoracionEstudiantil={valoracionEstudiantil}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </React.Fragment>
    )
}
