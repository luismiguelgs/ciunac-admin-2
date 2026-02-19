import React from "react";
import NavigationBread from "@/components/navigation-bread";
import BackButton from "@/components/back.button";
import PerfilDocenteForm from "@/modules/seguimiento-docente/perfil-docente/forms/perfil-docente.form";

export default function PagePerfilDocenteNuevo() {
    return <React.Fragment>
        <NavigationBread section="Perfil Docente" href="/perfil-docente" page="Nuevo Perfil Docente" />
        <div className="container mx-auto p-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Nuevo Perfil Docente</h1>
                <BackButton href="/perfil-docente/ranking-docentes" />
            </div>
            <PerfilDocenteForm />
        </div>
    </React.Fragment>
}