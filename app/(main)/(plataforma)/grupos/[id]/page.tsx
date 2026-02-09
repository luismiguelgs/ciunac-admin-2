import NavigationBread from "@/components/navigation-bread";
import BackButton from "@/components/back.button";
import React from "react";
import GrupoForm from "@/modules/grupos/forms/grupo.form";
import GruposService from "@/modules/grupos/grupo.service";
import { IGrupo } from "@/modules/grupos/interfaces/grupo.interface";

async function getData(id: number) {
    const data = await GruposService.getItem<IGrupo>(id)
    return data
}

export default async function Grupo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const grupo = await getData(Number(id))
    return <React.Fragment>
        <NavigationBread section="Grupos" href="/grupos" page="Detalle Grupo" />
        <div className="container mx-auto p-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Detalle Grupo {id}</h1>
                <BackButton href="/grupos" />
            </div>
            <GrupoForm grupo={grupo} />
        </div>
    </React.Fragment>
}