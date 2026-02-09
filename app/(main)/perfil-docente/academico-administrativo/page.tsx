import React from "react";
import NavigationBread from "@/components/navigation-bread";
import MyTabs from "@/components/my-tabs";
import DocumentacionPagos from "@/modules/perfil-docente/academico-administrativo/components/documentacion-pagos";
import PresentacionActas from "@/modules/perfil-docente/academico-administrativo/components/presentacion-actas";
import ExamenSustitutorio from "@/modules/perfil-docente/academico-administrativo/components/examen-sustitutorio";
import GestionAula from "@/modules/perfil-docente/academico-administrativo/components/gestion-aula";

export default function AcademicoAdministrativo() {
    return <React.Fragment>
        <NavigationBread section="Perfil Docentes" page="Académico administrativo" href="/perfil-docente" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <MyTabs defaultValue="pagos" items={[
                {
                    value: "pagos",
                    label: "Documentación para Pagos",
                    content: <DocumentacionPagos />
                },
                {
                    value: "actas",
                    label: "Presentación de Actas",
                    content: <PresentacionActas />
                },
                {
                    value: "sustitutorio",
                    label: "Trámite para examen sustitutorio",
                    content: <ExamenSustitutorio />
                },
                {
                    value: "gestion",
                    label: "Gestión de Aula y Metodología",
                    content: <GestionAula />
                }
            ]} />
        </div>
    </React.Fragment>
}
