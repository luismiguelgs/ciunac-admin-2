import React from "react";
import NavigationBread from "@/components/navigation-bread";
import BackButton from "@/components/back.button";
import DocentesService from "@/modules/perfil-docente/docentes/docente.service";
import DocenteForm from "@/modules/perfil-docente/docentes/forms/docente.form";

async function getData(id: string) {
    const data = await DocentesService.getItem(id)
    return data
}

export default async function Docente({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const docente = await getData(id)

    return <React.Fragment>
        <NavigationBread section="Docentes" href="/perfil-docente/docentes" page="Detalle Docente" />
        <div className="container mx-auto p-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Detalle Docente {id}</h1>
                <BackButton href="/perfil-docente/docentes" />
            </div>
            <DocenteForm docente={docente} />
        </div>
    </React.Fragment>
}