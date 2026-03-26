import React from "react"
import NavigationBread from "@/components/navigation-bread"
import MyTabs from "@/components/my-tabs"
import OpTipoDocumentos from "@/modules/seguimiento-docente/opciones/components/op-tipodocumentos"
import OpAreasSeguimiento from "@/modules/seguimiento-docente/opciones/components/op-areasseguimiento"
import OpPuntajeAcadAdmin from "@/modules/seguimiento-docente/opciones/components/op-puntajeacadadmin"
import ProtectedRoute from "@/components/protected-route"

export default function Opciones() {
    return (
        <ProtectedRoute>
            <React.Fragment>
                <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Opciones" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <MyTabs defaultValue="documentos" items={[
                        {
                            value: "documentos",
                            label: "Tipos de documentos",
                            content: <OpTipoDocumentos />
                        },
                        {
                            value: "areas",
                            label: "Areas de seguimiento",
                            content: <OpAreasSeguimiento />
                        },
                        {
                            value: "puntajes",
                            label: "Puntajes academico-administrativo",
                            content: <OpPuntajeAcadAdmin />
                        },
                    ]} />
                </div>
            </React.Fragment>
        </ProtectedRoute>
    )
}
