import React from "react"
import NavigationBread from "@/components/navigation-bread"
import MyTabs from "@/components/my-tabs"

export default function Opciones() {
    return <React.Fragment>
        <NavigationBread section="Perfil Docentes" href="/perfil-docente" page="Opciones" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <MyTabs defaultValue="documentos" items={[
                {
                    value: "documentos",
                    label: "Tipos de documentos",
                    content: <div>Tipos de documentos</div>
                },
                {
                    value: "areas",
                    label: "Áreas de seguimiento",
                    content: <div>Áreas de seguimiento</div>
                },
                {
                    value: "puntajes",
                    label: "Puntajes académico-administrativo",
                    content: <div>Puntajes académico-administrativo</div>
                },
            ]} />
        </div>
    </React.Fragment>
}