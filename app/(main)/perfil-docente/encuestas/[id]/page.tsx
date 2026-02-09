import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { RespuestasDataTable } from "@/modules/perfil-docente/encuestas/components/respuestas-datatable"
import EncuestaService from "@/modules/perfil-docente/encuestas/services/encuesta.service";
import { IEncuestaMetricas } from "@/modules/perfil-docente/encuestas/interfaces/encuesta-metricas.interface";
import { IEncuestaRespuesta } from "@/modules/perfil-docente/encuestas/interfaces/respuestas.interface";

async function getEncuestaDetalles(id: number): Promise<IEncuestaMetricas> {
    const res = await EncuestaService.getItem<IEncuestaMetricas>(id)
    return res;
}

async function getRespuestasDocenteModulo(docenteId: string, moduloId: number): Promise<IEncuestaRespuesta[]> {
    const res = await EncuestaService.getItemsByDocenteAndModulo(docenteId, moduloId)
    return res;
}

export default async function EncuestasDetalles({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const encuestaDetalles = await getEncuestaDetalles(Number(id));
    const respuestasDocenteModulo = await getRespuestasDocenteModulo(encuestaDetalles.docenteId, encuestaDetalles.moduloId);
    return <React.Fragment>
        <NavigationBread section="Encuestas" href="/perfil-docente/encuestas" page="Respuestas-Detalles" />
        <div className="container mx-auto p-4">
            <RespuestasDataTable data={respuestasDocenteModulo} metricas={encuestaDetalles} />
        </div>
    </React.Fragment>
}