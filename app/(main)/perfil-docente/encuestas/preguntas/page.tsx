import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { PreguntasDataTable } from "@/modules/seguimiento-docente/encuestas/components/preguntas-datatable"

export default function Preguntas() {
    return <React.Fragment>
        <NavigationBread section="Encuestas" href="/encuestas" page="Preguntas" />
        <div className="container mx-auto p-4">
            <PreguntasDataTable />
        </div>
    </React.Fragment>
}