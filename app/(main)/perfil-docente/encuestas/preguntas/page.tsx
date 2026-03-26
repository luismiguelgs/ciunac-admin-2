import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { PreguntasDataTable } from "@/modules/seguimiento-docente/encuestas/components/preguntas-datatable"
import ProtectedRoute from "@/components/protected-route"

export default function Preguntas() {
    return (
        <ProtectedRoute>
            <React.Fragment>
                <NavigationBread section="Encuestas" href="/perfil-docente/encuestas" page="Preguntas" />
                <div className="container mx-auto p-4">
                    <PreguntasDataTable />
                </div>
            </React.Fragment>
        </ProtectedRoute>
    )
}
