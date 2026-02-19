import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { MetricasDataTable } from "@/modules/seguimiento-docente/encuestas/components/metricas-datatable"

export default function Encuestas() {
    return <React.Fragment>
        <NavigationBread section="Encuestas" href="/perfil-docente/encuestas" page="Respuestas" />
        <div className="container mx-auto p-4">
            <MetricasDataTable />
        </div>
    </React.Fragment>
}