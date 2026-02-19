import React from "react";
import NavigationBread from "@/components/navigation-bread";
import BackButton from "@/components/back.button";
import DocenteForm from "@/modules/seguimiento-docente/docentes/forms/docente.form";

export default function DocenteNuevo() {
    return <React.Fragment>
        <NavigationBread section="Docentes" href="/perfil-docente/docentes" page="Nuevo Docente" />
        <div className="container mx-auto p-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Nuevo Docente</h1>
                <BackButton href="/perfil-docente/docentes" />
            </div>
            <DocenteForm />
        </div>
    </React.Fragment>
}